import { useNuxtApp } from '#app'
import { initializeApp, getApps } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { initializeFirestore, getFirestore, type Firestore } from 'firebase/firestore'

const DEFAULT_FIREBASE_CONFIG = {
  apiKey: 'AIzaSyBoNLQUaQc9fUtn0TnfIS4dAxUKVrUnM94',
  authDomain: 'mem-s-18304.firebaseapp.com',
  projectId: 'mem-s-18304',
  storageBucket: 'mem-s-18304.firebasestorage.app',
  messagingSenderId: '542286802778',
  appId: '1:542286802778:web:832e2f215734728a8d4d63'
}

export const useFirebase = () => {
  let auth: Auth | null = null
  let db: Firestore | null = null

  try {
    const nuxtApp = useNuxtApp()
    if (nuxtApp?.$firebaseAuth) {
      auth = nuxtApp.$firebaseAuth as Auth
    }
    if (nuxtApp?.$firestore) {
      db = nuxtApp.$firestore as Firestore
    }
  } catch {
    // Nuxt context not yet ready
  }

  // Fallback direct si le plugin client n'est pas encore exécuté
  if (!auth || !db) {
    let app = getApps().length > 0 ? getApps()[0] : null
    if (!app && typeof window !== 'undefined') {
      try {
        app = initializeApp(DEFAULT_FIREBASE_CONFIG)
      } catch {
        app = getApps()[0] || null
      }
    }
    if (app) {
      if (!auth) auth = getAuth(app)
      if (!db) {
        try {
          db = initializeFirestore(app, { experimentalForceLongPolling: true })
        } catch {
          db = getFirestore(app)
        }
      }
    }
  }

  return {
    auth,
    db
  }
}
