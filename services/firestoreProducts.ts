import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  doc,
  getDoc,
  type DocumentData
} from 'firebase/firestore'
import type { Product, Category, Collection, ProductFilter } from '../types/product'
import { INITIAL_COLLECTIONS, INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '../data/productsData'
import { useFirebase } from '../composables/useFirebase'

export class FirestoreProductsService {
  // Cache en mémoire ultra-rapide pré-rempli avec les données locales
  private static allProductsCache: Product[] = [...INITIAL_PRODUCTS]
  private static collectionsCache: Collection[] | null = null
  private static categoriesCache: Category[] | null = null
  private static lastSyncTime: number = 0
  private static inFlightSync: Promise<Product[]> | null = null
  private static readonly CACHE_TTL = 3 * 60 * 1000 // 3 minutes

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
   * Synchronisation en arrière-plan avec Firestore (Dedupliquée)
   */
  private static async syncFromFirestore(): Promise<Product[]> {
    if (this.inFlightSync) {
      return this.inFlightSync
    }

    this.inFlightSync = (async () => {
      const { db } = useFirebase()
      if (!db) return this.allProductsCache

      try {
        const prodRef = collection(db, 'products')
        const snapshot = await getDocs(prodRef)

        if (!snapshot.empty) {
          const remoteProducts = snapshot.docs.map(doc =>
            this.sanitizeProduct({ id: doc.id as any, ...doc.data() } as Product)
          )
          if (remoteProducts.length > 0) {
            this.allProductsCache = remoteProducts
            this.lastSyncTime = Date.now()
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
   * Récupère la liste des produits avec filtres
   * RENVOIE LES RÉSULTATS EN 0 MILLISECONDE GRÂCE AU CACHE EN MÉMOIRE
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
    // Si le cache est vierge ou expiré (> 3 min), déclencher la synchronisation en tâche de fond
    const now = Date.now()
    if (now - this.lastSyncTime > this.CACHE_TTL && typeof window !== 'undefined') {
      // Synchronisation asynchrone non-bloquante
      this.syncFromFirestore().catch(() => {})
    }

    // Filtrer immédiatement la liste en mémoire
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
   * Récupère un produit par son slug (immédiat depuis le cache)
   */
  static async getProductBySlug(slug: string): Promise<Product | null> {
    const cached = this.allProductsCache.find(p => p.slug === slug)
    if (cached) {
      return this.sanitizeProduct(cached)
    }

    // Si pas trouvé dans le cache local, chercher dans Firestore
    const { db } = useFirebase()
    if (db) {
      try {
        const prodRef = collection(db, 'products')
        const q = query(prodRef, where('slug', '==', slug), limit(1))
        const snapshot = await getDocs(q)

        if (!snapshot.empty) {
          const doc = snapshot.docs[0]
          const prod = { id: doc.id as any, ...doc.data() } as Product
          const sanitized = this.sanitizeProduct(prod)
          // Ajouter au cache
          this.allProductsCache.push(sanitized)
          return sanitized
        }
      } catch (error) {
        console.warn('[Firestore] getProductBySlug fallback:', error)
      }
    }

    const localProduct = INITIAL_PRODUCTS.find(p => p.slug === slug)
    return localProduct ? this.sanitizeProduct(localProduct) : null
  }

  /**
   * Invalide le cache après création, modification ou suppression d'un produit (Admin)
   */
  static clearCache(): void {
    this.lastSyncTime = 0
    this.collectionsCache = null
    this.categoriesCache = null
    this.syncFromFirestore().catch(() => {})
  }
}
