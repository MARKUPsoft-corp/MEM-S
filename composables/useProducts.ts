import { useProductsStore } from '../stores/products'

// Composable pour gérer les produits via l'API
export const useProducts = () => {
  const productsStore = useProductsStore()
  const config = useRuntimeConfig()

  /**
   * Récupère tous les produits avec filtres optionnels
   */
  const fetchProducts = async (filters?: {
    category?: string
    collection?: string
    min_price?: number
    max_price?: number
    is_new?: boolean
    is_featured?: boolean
    search?: string
    ordering?: string
    page?: number
  }) => {
    return await productsStore.fetchProducts(filters)
  }

  /**
   * Récupère un produit par son slug
   */
  const fetchProductBySlug = async (slug: string) => {
    return await productsStore.fetchProductBySlug(slug)
  }

  /**
   * Récupère les produits en vedette
   */
  const fetchFeaturedProducts = async () => {
    return await productsStore.fetchFeaturedProducts()
  }

  /**
   * Récupère les nouveaux produits
   */
  const fetchNewArrivals = async () => {
    return await productsStore.fetchNewArrivals()
  }

  /**
   * Récupère toutes les catégories
   */
  const fetchCategories = async () => {
    return await productsStore.fetchCategories()
  }

  /**
   * Récupère les catégories groupées par collection
   */
  const fetchCategoriesByCollection = async () => {
    return await productsStore.fetchCategoriesByCollection()
  }

  /**
   * Récupère les produits d'une catégorie spécifique
   */
  const fetchProductsByCategory = async (categorySlug: string) => {
    return await fetchProducts({ category: categorySlug })
  }

  /**
   * Récupère les produits d'une collection spécifique
   */
  const fetchProductsByCollection = async (collectionType: string) => {
    return await fetchProducts({ collection: collectionType })
  }

  /**
   * Récupère toutes les collections
   */
  const fetchCollections = async () => {
    return await productsStore.fetchCollections()
  }

  return {
    // Méthodes
    fetchProducts,
    fetchProductBySlug,
    fetchFeaturedProducts,
    fetchNewArrivals,
    fetchCategories,
    fetchCategoriesByCollection,
    fetchProductsByCategory,
    fetchProductsByCollection,
    fetchCollections,

    // State du store
    products: computed(() => productsStore.products),
    categories: computed(() => productsStore.categories),
    collections: computed(() => productsStore.collections),
    loading: computed(() => productsStore.loading),
    totalCount: computed(() => productsStore.totalCount),
  }
}
