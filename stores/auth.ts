import { defineStore } from 'pinia'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import type { User, LoginCredentials, RegisterData } from '../types/auth'
import { useFirebase } from '../composables/useFirebase'

let authInitPromise: Promise<User | null> | null = null

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    loading: false,
    initialized: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user,
    isAdmin: (state) => state.user?.role === 'admin' || state.user?.uid === 'XFCmH3lWVkPejOmu0VgPm1VeWdm1',
  },

  actions: {
    /**
     * Initialise l'écouteur d'état d'authentification Firebase
     */
    initAuth(): Promise<User | null> {
      if (!process.client) return Promise.resolve(null)

      // Hydratation immédiate depuis le localStorage pour éliminer tout flash
      if (!this.user) {
        this.initFromLocalStorage()
      }

      if (authInitPromise) {
        return authInitPromise
      }

      const { auth } = useFirebase()
      if (!auth) {
        this.initialized = true
        return Promise.resolve(this.user)
      }

      authInitPromise = new Promise((resolve) => {
        let firstEvent = true

        onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
          if (firebaseUser) {
            try {
              const u = await this.syncUserProfile(firebaseUser)
              if (firstEvent) {
                firstEvent = false
                this.initialized = true
                resolve(u)
              }
            } catch (error) {
              console.error('[Auth] Erreur récupération profil Firestore:', error)
              if (firstEvent) {
                firstEvent = false
                this.initialized = true
                resolve(this.user)
              }
            }
          } else {
            this.user = null
            this.token = null
            if (process.client) {
              localStorage.removeItem('user')
              localStorage.removeItem('token')
            }
            if (firstEvent) {
              firstEvent = false
              this.initialized = true
              resolve(null)
            }
          }
        })
      })

      return authInitPromise
    },

    /**
     * Synchronise le profil utilisateur avec Firestore et garantit la présence d'un rôle (admin ou customer)
     */
    async syncUserProfile(firebaseUser: FirebaseUser): Promise<User> {
      const { db } = useFirebase()
      const token = await firebaseUser.getIdToken()
      this.token = token

      const isDefaultAdmin = firebaseUser.uid === 'XFCmH3lWVkPejOmu0VgPm1VeWdm1'
      let role: 'admin' | 'customer' = isDefaultAdmin ? 'admin' : 'customer'

      if (db) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid)
          const userSnap = await getDoc(userDocRef)

          if (userSnap.exists()) {
            const data = userSnap.data()
            if (data.role) {
              role = data.role
            } else {
              // Si le rôle manque dans le document, l'enregistrer dans Firestore
              await updateDoc(userDocRef, { role })
            }

            this.user = {
              id: firebaseUser.uid,
              uid: firebaseUser.uid,
              email: firebaseUser.email || data.email || '',
              first_name: data.first_name || firebaseUser.displayName?.split(' ')[0] || '',
              last_name: data.last_name || firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
              phone: data.phone || firebaseUser.phoneNumber || '',
              whatsapp: data.whatsapp || data.phone || '',
              address: data.address || '',
              city: data.city || '',
              photoURL: firebaseUser.photoURL || data.photoURL || undefined,
              role: role,
              createdAt: data.createdAt || undefined
            }
          } else {
            // Créer le document profil avec son rôle dans Firestore
            const newUser: User = {
              id: firebaseUser.uid,
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              first_name: firebaseUser.displayName?.split(' ')[0] || '',
              last_name: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
              phone: firebaseUser.phoneNumber || '',
              whatsapp: firebaseUser.phoneNumber || '',
              address: '',
              city: '',
              photoURL: firebaseUser.photoURL || undefined,
              role: role,
              createdAt: new Date().toISOString()
            }
            await setDoc(userDocRef, {
              email: newUser.email,
              first_name: newUser.first_name,
              last_name: newUser.last_name,
              phone: newUser.phone,
              whatsapp: newUser.whatsapp,
              address: newUser.address,
              city: newUser.city,
              role: newUser.role,
              createdAt: newUser.createdAt
            })
            this.user = newUser
          }
        } catch (err) {
          console.error('[Auth] Erreur synchronisation profil Firestore:', err)
        }
      }

      if (!this.user) {
        this.user = {
          id: firebaseUser.uid,
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          first_name: firebaseUser.displayName?.split(' ')[0] || '',
          last_name: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
          role: role
        }
      }

      // Sauvegarder dans localStorage pour persistance hors ligne
      if (process.client) {
        localStorage.setItem('user', JSON.stringify(this.user))
        localStorage.setItem('token', token)
      }

      // Synchroniser le panier si disponible
      try {
        const { useCartStore } = await import('./cart')
        const cartStore = useCartStore()
        await cartStore.syncWithBackend()
      } catch (err) {
        console.warn('[Cart] Erreur synchronisation panier après login:', err)
      }

      return this.user
    },

    /**
     * Connexion par Email et Mot de passe
     */
    async login(credentials: LoginCredentials): Promise<User> {
      const { auth } = useFirebase()
      if (!auth) throw new Error('Firebase Auth non initialisé')

      try {
        this.loading = true
        const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password)
        const user = await this.syncUserProfile(userCredential.user)
        return user
      } catch (error: any) {
        console.error('[Auth] Erreur connexion email:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Inscription par Email et Mot de passe
     */
    async register(data: RegisterData): Promise<User> {
      const { auth, db } = useFirebase()
      if (!auth || !db) throw new Error('Firebase Auth / Firestore non initialisé')

      try {
        this.loading = true
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password)
        const firebaseUser = userCredential.user

        // Enregistrer les métadonnées dans Firestore avec le rôle customer obligatoire
        const userDocRef = doc(db, 'users', firebaseUser.uid)
        const profileData = {
          email: data.email,
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          phone: data.phone || '',
          whatsapp: data.whatsapp || data.phone || '',
          address: data.address || '',
          city: data.city || '',
          role: 'customer' as const,
          createdAt: new Date().toISOString()
        }

        await setDoc(userDocRef, profileData)

        this.user = {
          id: firebaseUser.uid,
          uid: firebaseUser.uid,
          ...profileData
        }

        const token = await firebaseUser.getIdToken()
        this.token = token

        if (process.client) {
          localStorage.setItem('user', JSON.stringify(this.user))
          localStorage.setItem('token', token)
        }

        return this.user
      } catch (error: any) {
        console.error('[Auth] Erreur inscription:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Connexion avec Google via Popup
     */
    async loginWithGoogle(): Promise<User> {
      const { auth } = useFirebase()
      if (!auth) throw new Error('Firebase Auth non initialisé')

      try {
        this.loading = true
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account' })
        const result = await signInWithPopup(auth, provider)
        const user = await this.syncUserProfile(result.user)
        return user
      } catch (error: any) {
        console.error('[Auth] Erreur Google Sign-In:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Mise à jour du profil utilisateur dans Firestore
     */
    async updateProfile(data: Partial<User>) {
      const { db } = useFirebase()
      if (!this.user?.uid || !db) throw new Error('Utilisateur non connecté ou Firestore non disponible')

      try {
        this.loading = true
        const userDocRef = doc(db, 'users', this.user.uid)
        await updateDoc(userDocRef, {
          first_name: data.first_name ?? this.user.first_name,
          last_name: data.last_name ?? this.user.last_name,
          phone: data.phone ?? this.user.phone,
          whatsapp: data.whatsapp ?? this.user.whatsapp,
          address: data.address ?? this.user.address,
          city: data.city ?? this.user.city,
          updatedAt: new Date().toISOString()
        })

        this.user = {
          ...this.user,
          ...data
        }

        if (process.client) {
          localStorage.setItem('user', JSON.stringify(this.user))
        }

        return this.user
      } catch (error: any) {
        console.error('[Auth] Erreur mise à jour profil:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Déconnexion
     */
    async logout() {
      const { auth } = useFirebase()

      // Vider le panier
      try {
        const { useCartStore } = await import('./cart')
        const cartStore = useCartStore()
        cartStore.items = []
        cartStore.saveToLocalStorage()
      } catch (error) {
        console.warn('[Cart] Erreur vidage panier logout:', error)
      }

      if (auth) {
        await signOut(auth)
      }

      this.user = null
      this.token = null
      authInitPromise = null

      if (process.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
      }
    },

    /**
     * Fallback initialisation depuis le localStorage
     */
    initFromLocalStorage() {
      if (process.client) {
        const token = localStorage.getItem('token')
        const userStr = localStorage.getItem('user')
        if (token && userStr) {
          try {
            this.token = token
            this.user = JSON.parse(userStr)
          } catch (e) {
            console.error('Erreur parsing user localStorage', e)
          }
        }
      }
    },
  },
})
