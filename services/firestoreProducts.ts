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
  /**
   * Récupère toutes les collections
   */
  static async getCollections(): Promise<Collection[]> {
    const { db } = useFirebase()
    if (!db) return INITIAL_COLLECTIONS

    try {
      const colRef = collection(db, 'collections')
      const q = query(colRef, orderBy('order', 'asc'))
      const snapshot = await getDocs(q)

      if (!snapshot.empty) {
        return snapshot.docs.map(doc => ({ id: doc.id as any, ...doc.data() } as Collection))
      }
    } catch (error) {
      console.warn('[Firestore] Collections fallback vers données locales:', error)
    }

    return INITIAL_COLLECTIONS
  }

  /**
   * Récupère toutes les catégories
   */
  static async getCategories(): Promise<Category[]> {
    const { db } = useFirebase()
    if (!db) return INITIAL_CATEGORIES

    try {
      const catRef = collection(db, 'categories')
      const q = query(catRef, orderBy('order', 'asc'))
      const snapshot = await getDocs(q)

      if (!snapshot.empty) {
        return snapshot.docs.map(doc => ({ id: doc.id as any, ...doc.data() } as Category))
      }
    } catch (error) {
      console.warn('[Firestore] Catégories fallback vers données locales:', error)
    }

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
   * Récupère la liste des produits avec filtres
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
    const { db } = useFirebase()

    let items: Product[] = []

    if (db) {
      try {
        const prodRef = collection(db, 'products')
        let q = query(prodRef)

        if (filters?.category) {
          q = query(q, where('category.slug', '==', filters.category))
        }
        if (filters?.is_new !== undefined) {
          q = query(q, where('is_new', '==', filters.is_new))
        }
        if (filters?.is_featured !== undefined) {
          q = query(q, where('is_featured', '==', filters.is_featured))
        }

        const snapshot = await getDocs(q)
        if (!snapshot.empty) {
          items = snapshot.docs.map(doc => this.sanitizeProduct({ id: doc.id as any, ...doc.data() } as Product))
        }
      } catch (error) {
        console.warn('[Firestore] Produits fallback vers données locales:', error)
      }
    }

    // Si Firestore n'est pas encore peuplé ou inaccessible, utiliser les données locales
    if (items.length === 0) {
      items = [...INITIAL_PRODUCTS]
    }

    // Appliquer les filtres côté client
    if (filters) {
      if (filters.category) {
        items = items.filter(p => p.category?.slug === filters.category)
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
          p.description.toLowerCase().includes(queryStr)
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
    }

    return {
      results: items,
      count: items.length
    }
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
   */
  static async getProductBySlug(slug: string): Promise<Product | null> {
    const { db } = useFirebase()

    if (db) {
      try {
        const prodRef = collection(db, 'products')
        const q = query(prodRef, where('slug', '==', slug), limit(1))
        const snapshot = await getDocs(q)

        if (!snapshot.empty) {
          const doc = snapshot.docs[0]
          const prod = { id: doc.id as any, ...doc.data() } as Product
          return this.sanitizeProduct(prod)
        }
      } catch (error) {
        console.warn('[Firestore] getProductBySlug fallback:', error)
      }
    }

    const localProduct = INITIAL_PRODUCTS.find(p => p.slug === slug)
    return localProduct ? this.sanitizeProduct(localProduct) : null
  }
}
