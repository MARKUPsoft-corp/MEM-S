import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  doc,
  getDoc,
  onSnapshot,
  type Unsubscribe,
  type DocumentData
} from 'firebase/firestore'
import type { Product, Category, Collection, ProductFilter } from '../types/product'
import { INITIAL_COLLECTIONS, INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '../data/productsData'
import { useFirebase } from '../composables/useFirebase'

const STORAGE_KEY = 'mems_products_cache_v2'

export class FirestoreProductsService {
  // Cache en mémoire réactif, hydraté depuis localStorage si disponible
  private static allProductsCache: Product[] = []
  private static collectionsCache: Collection[] | null = null
  private static categoriesCache: Category[] | null = null
  private static lastSyncTime: number = 0
  private static inFlightSync: Promise<Product[]> | null = null
  private static readonly CACHE_TTL = 60 * 1000 // 1 minute (rafraîchissement périodique en plus du temps réel)

  // Écouteur temps réel Firestore
  private static unsubscribeSnapshot: Unsubscribe | null = null
  private static subscribers: Set<(products: Product[]) => void> = new Set()
  private static isInitialized: boolean = false
  private static initPromise: Promise<Product[]> | null = null

  /**
   * Charge le cache initial depuis le stockage local (persistance après rechargement)
   */
  private static loadFromLocalStorage(): boolean {
    if (typeof window === 'undefined') return false
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.allProductsCache = parsed.map(p => this.sanitizeProduct(p))
          return true
        }
      }
    } catch (e) {
      console.warn('[Firestore] Impossible de lire localStorage:', e)
    }
    return false
  }

  /**
   * Sauvegarde le cache en local pour affichage instantané au prochain rechargement
   */
  private static saveToLocalStorage(): void {
    if (typeof window === 'undefined') return
    try {
      if (this.allProductsCache.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.allProductsCache))
      }
    } catch (e) {
      console.warn('[Firestore] Erreur écriture localStorage:', e)
    }
  }

  /**
   * Initialise et abonne l'application aux mises à jour TEMPS RÉEL Firestore (onSnapshot)
   * Tout ajout, modification ou suppression dans Firestore est diffusé instantanément (< 50ms)
   */
  static initRealtimeSubscription(onUpdate?: (products: Product[]) => void): () => void {
    if (onUpdate) {
      this.subscribers.add(onUpdate)
    }

    // 1. Charger le cache local d'abord (synchrone, 0ms)
    if (this.allProductsCache.length === 0) {
      const hasLocal = this.loadFromLocalStorage()
      if (!hasLocal) {
        // Fallback : afficher les produits initiaux en attendant Firestore
        this.allProductsCache = [...INITIAL_PRODUCTS]
      }
    }

    // 2. Notifier immédiatement le nouvel abonné avec ce qu'on a déjà (local ou INITIAL)
    if (onUpdate && this.allProductsCache.length > 0) {
      try { onUpdate(this.allProductsCache) } catch (e) {}
    }

    // 3. Démarrer l'écouteur Firestore si ce n'est pas déjà fait
    if (!this.unsubscribeSnapshot && typeof window !== 'undefined') {
      const { db } = useFirebase()
      if (db) {
        try {
          const prodRef = collection(db, 'products')
          this.unsubscribeSnapshot = onSnapshot(
            prodRef,
            (snapshot) => {
              if (!snapshot.empty) {
                const remoteProducts = snapshot.docs.map(d =>
                  this.sanitizeProduct({ id: d.id as any, ...d.data() } as Product)
                )

                // Firestore est la source unique de vérité absolue (aucun écrasement par INITIAL_PRODUCTS)
                this.allProductsCache = remoteProducts
                this.isInitialized = true
                this.lastSyncTime = Date.now()
                this.saveToLocalStorage()

                // Notifier tous les composants et stores connectés en temps réel
                this.subscribers.forEach(cb => {
                  try { cb(this.allProductsCache) } catch (err) { console.error('[Realtime Subscriber Error]:', err) }
                })
              } else if (!this.isInitialized) {
                // Si la collection Firestore est vide, garder le fallback
                this.allProductsCache = [...INITIAL_PRODUCTS]
                this.isInitialized = true
                this.subscribers.forEach(cb => {
                  try { cb(this.allProductsCache) } catch (err) {}
                })
              }
            },
            (error) => {
              console.warn('[Firestore] Erreur écouteur temps réel:', error)
            }
          )
        } catch (err) {
          console.warn('[Firestore] Échec initialisation listener:', err)
        }
      }
    }

    return () => {
      if (onUpdate) {
        this.subscribers.delete(onUpdate)
      }
    }
  }


  /**
   * Récupère toutes les collections (avec mise en cache)
   */
  static async getCollections(): Promise<Collection[]> {
    if (this.collectionsCache && this.collectionsCache.length > 0) {
      return this.collectionsCache
    }

    const { db } = useFirebase()
    if (!db) {
      this.collectionsCache = INITIAL_COLLECTIONS
      return INITIAL_COLLECTIONS
    }

    try {
      const colRef = collection(db, 'collections')
      const q = query(colRef, orderBy('order', 'asc'))
      const snapshot = await getDocs(q)

      if (!snapshot.empty) {
        this.collectionsCache = snapshot.docs.map(doc => ({ id: doc.id as any, ...doc.data() } as Collection))
        return this.collectionsCache
      }
    } catch (error) {
      console.warn('[Firestore] Collections fallback vers données locales:', error)
    }

    this.collectionsCache = INITIAL_COLLECTIONS
    return INITIAL_COLLECTIONS
  }

  /**
   * Récupère toutes les catégories (avec mise en cache)
   */
  static async getCategories(): Promise<Category[]> {
    if (this.categoriesCache && this.categoriesCache.length > 0) {
      return this.categoriesCache
    }

    const { db } = useFirebase()
    if (!db) {
      this.categoriesCache = INITIAL_CATEGORIES
      return INITIAL_CATEGORIES
    }

    try {
      const catRef = collection(db, 'categories')
      const q = query(catRef, orderBy('order', 'asc'))
      const snapshot = await getDocs(q)

      if (!snapshot.empty) {
        this.categoriesCache = snapshot.docs.map(doc => ({ id: doc.id as any, ...doc.data() } as Category))
        return this.categoriesCache
      }
    } catch (error) {
      console.warn('[Firestore] Catégories fallback vers données locales:', error)
    }

    this.categoriesCache = INITIAL_CATEGORIES
    return INITIAL_CATEGORIES
  }

  /**
   * Récupère les catégories groupées par slug de collection
   */
  static async getCategoriesByCollection(): Promise<Record<string, Category[]>> {
    const categories = await this.getCategories()
    const grouped: Record<string, Category[]> = {
      men: [],
      women: [],
      babouches: [],
      lins: []
    }

    categories.forEach(cat => {
      const colSlug = (cat as any).collectionSlug || cat.collection?.slug || 'men'
      if (!grouped[colSlug]) grouped[colSlug] = []
      grouped[colSlug].push(cat)
    })

    return grouped
  }

  /**
   * Synchronisation explicite depuis Firestore (Dedupliquée et non destructive)
   */
  static async syncFromFirestore(): Promise<Product[]> {
    if (this.inFlightSync) {
      return this.inFlightSync
    }

    this.inFlightSync = (async () => {
      const { db } = useFirebase()
      if (!db) {
        if (this.allProductsCache.length === 0) {
          this.loadFromLocalStorage() || (this.allProductsCache = [...INITIAL_PRODUCTS])
        }
        return this.allProductsCache
      }

      try {
        const prodRef = collection(db, 'products')
        const snapshot = await getDocs(prodRef)

        if (!snapshot.empty) {
          const remoteProducts = snapshot.docs.map(doc =>
            this.sanitizeProduct({ id: doc.id as any, ...doc.data() } as Product)
          )
          if (remoteProducts.length > 0) {
            // Firestore est l'autorité absolue : remplace la mémoire pour éviter les produits fantômes
            this.allProductsCache = remoteProducts
            this.isInitialized = true
            this.lastSyncTime = Date.now()
            this.saveToLocalStorage()

            // Notifier tous les abonnés
            this.subscribers.forEach(cb => {
              try { cb(this.allProductsCache) } catch (err) { console.error('[Subscriber notify error]:', err) }
            })
          }
        }
      } catch (error) {
        console.warn('[Firestore] Sync silencieuse en arrière-plan:', error)
      } finally {
        this.inFlightSync = null
      }

      return this.allProductsCache
    })()

    return this.inFlightSync
  }

  /**
   * Récupère la liste des produits avec filtres.
   * Assure que les vraies données Firestore sont chargées au premier appel.
   */
  static async getProducts(filters?: {
    category?: string
    collection?: string
    is_new?: boolean
    is_featured?: boolean
    min_price?: number
    max_price?: number
    search?: string
    ordering?: string
    page?: number
  }): Promise<{ results: Product[]; count: number }> {
    // 1. Initialiser le listener temps réel si ce n'est pas fait
    if (!this.unsubscribeSnapshot && typeof window !== 'undefined') {
      this.initRealtimeSubscription()
    }

    // 2. Si non initialisé et cache vide, charger immédiatement depuis localStorage ou Firestore
    if (this.allProductsCache.length === 0) {
      const hadLocal = this.loadFromLocalStorage()
      if (!hadLocal && typeof window !== 'undefined') {
        await this.syncFromFirestore()
      }
    } else if (!this.isInitialized && typeof window !== 'undefined') {
      // Sync en tâche de fond pour garantir la fraîcheur
      this.syncFromFirestore().catch(() => {})
    }

    // 3. Filtrer immédiatement la liste en mémoire
    const results = this.filterProducts(this.allProductsCache, filters)

    return {
      results,
      count: results.length
    }
  }

  /**
   * Filtre les produits selon les critères passés
   */
  private static filterProducts(
    source: Product[],
    filters?: {
      category?: string
      collection?: string
      is_new?: boolean
      is_featured?: boolean
      min_price?: number
      max_price?: number
      search?: string
      ordering?: string
      page?: number
    }
  ): Product[] {
    let items = [...source]

    if (!filters) {
      return items
    }

    if (filters.category) {
      const catQuery = filters.category.toLowerCase()
      items = items.filter(p => {
        const slug = p.category?.slug?.toLowerCase() || ''
        return slug === catQuery || slug.includes(catQuery) || catQuery.includes(slug)
      })
    }

    if (filters.collection) {
      items = items.filter(p => {
        const colSlug = (p.category as any)?.collectionSlug || p.category?.collection?.slug
        return colSlug === filters.collection
      })
    }

    if (filters.is_new !== undefined) {
      items = items.filter(p => p.is_new === filters.is_new)
    }

    if (filters.is_featured !== undefined) {
      items = items.filter(p => p.is_featured === filters.is_featured)
    }

    if (filters.min_price !== undefined) {
      items = items.filter(p => (p.discount_price || p.price) >= filters.min_price!)
    }

    if (filters.max_price !== undefined) {
      items = items.filter(p => (p.discount_price || p.price) <= filters.max_price!)
    }

    if (filters.search) {
      const queryStr = filters.search.toLowerCase()
      items = items.filter(p =>
        p.name.toLowerCase().includes(queryStr) ||
        p.description?.toLowerCase().includes(queryStr)
      )
    }

    // Tri
    if (filters.ordering === 'price') {
      items.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price))
    } else if (filters.ordering === '-price') {
      items.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price))
    } else if (filters.ordering === '-created_at') {
      items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    return items
  }

  /**
   * Nettoie les éventuelles URLs d'images expirées
   */
  private static sanitizeProduct(product: Product): Product {
    if (!product) return product
    const BAD_IMAGE = 'photo-1514989940745-12a14b18c6e2'
    const GOOD_IMAGE = 'photo-1542291026-7eec264c27ff'

    if (Array.isArray(product.images)) {
      product.images = product.images.map((img: any) => {
        if (typeof img === 'string' && img.includes(BAD_IMAGE)) {
          return img.replace(BAD_IMAGE, GOOD_IMAGE)
        }
        if (typeof img === 'object' && img?.image && img.image.includes(BAD_IMAGE)) {
          return { ...img, image: img.image.replace(BAD_IMAGE, GOOD_IMAGE) }
        }
        return img
      })
    }
    return product
  }

  /**
   * Récupère un produit par son slug
   * Utilise le cache temps réel en priorité, puis Firestore direct si non trouvé
   */
  static async getProductBySlug(slug: string): Promise<Product | null> {
    // 1. Recherche dans le cache mémoire temps réel
    if (this.allProductsCache.length === 0) {
      this.loadFromLocalStorage()
    }
    const cached = this.allProductsCache.find(p => p.slug === slug)
    if (cached) {
      return this.sanitizeProduct(cached)
    }

    // 2. Interrogation directe de Firestore
    const { db } = useFirebase()
    if (db) {
      try {
        const docSnap = await getDoc(doc(db, 'products', slug))
        if (docSnap.exists()) {
          const prod = { id: docSnap.id as any, ...docSnap.data() } as Product
          const sanitized = this.sanitizeProduct(prod)
          this.updateLocalProduct(sanitized)
          return sanitized
        }

        const prodRef = collection(db, 'products')
        const q = query(prodRef, where('slug', '==', slug), limit(1))
        const snapshot = await getDocs(q)
        if (!snapshot.empty) {
          const docItem = snapshot.docs[0]
          const prod = { id: docItem.id as any, ...docItem.data() } as Product
          const sanitized = this.sanitizeProduct(prod)
          this.updateLocalProduct(sanitized)
          return sanitized
        }
      } catch (error) {
        console.warn('[Firestore] getProductBySlug fallback vers cache:', error)
      }
    }

    // 3. Fallback sur les données initiales
    const localProduct = INITIAL_PRODUCTS.find(p => p.slug === slug)
    return localProduct ? this.sanitizeProduct(localProduct) : null
  }

  /**
   * Met à jour ou insère immédiatement un produit dans le cache local (optimiste)
   */
  static updateLocalProduct(product: Product): void {
    const sanitized = this.sanitizeProduct(product)
    const idx = this.allProductsCache.findIndex(p => p.slug === sanitized.slug || String(p.id) === String(sanitized.id))
    if (idx !== -1) {
      this.allProductsCache[idx] = sanitized
    } else {
      this.allProductsCache.unshift(sanitized)
    }
    this.saveToLocalStorage()
    this.subscribers.forEach(cb => {
      try { cb(this.allProductsCache) } catch (err) { console.error('[Subscriber update error]:', err) }
    })
  }

  /**
   * Supprime un produit du cache local (optimiste)
   */
  static removeLocalProduct(slug: string): void {
    this.allProductsCache = this.allProductsCache.filter(p => p.slug !== slug)
    this.saveToLocalStorage()
    this.subscribers.forEach(cb => {
      try { cb(this.allProductsCache) } catch (err) { console.error('[Subscriber delete error]:', err) }
    })
  }

  /**
   * Invalide le cache et force une re-synchronisation
   */
  static clearCache(): void {
    this.lastSyncTime = 0
    this.collectionsCache = null
    this.categoriesCache = null
    this.syncFromFirestore().catch(() => {})
  }
}
