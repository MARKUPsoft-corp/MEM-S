import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useFirebase } from '../composables/useFirebase'

export interface HeroSlide {
  id: number
  title: string
  price: string
  image: string
  link: string
}

export interface PageBanners {
  men: string
  women: string
  babouches: string
  lins: string
  nouveautes: string
  vedettes: string
  about: string
}

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    title: 'ALKEBU-LAN',
    price: '2100 FCFA',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=1080&fit=crop&q=80',
    link: '/products'
  },
  {
    id: 2,
    title: 'COLLECTION PRINTEMPS',
    price: '1500 FCFA',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=1080&fit=crop&q=80',
    link: '/products'
  },
  {
    id: 3,
    title: 'NOUVEAUTÉS',
    price: '1800 FCFA',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&h=1080&fit=crop&q=80',
    link: '/products'
  }
]

export const DEFAULT_PAGE_BANNERS: PageBanners = {
  men: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=1920&h=600&fit=crop&q=80',
  women: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1920&h=600&fit=crop&q=80',
  babouches: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1920&h=600&fit=crop&q=80',
  lins: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1920&h=600&fit=crop&q=80',
  nouveautes: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=600&fit=crop&q=80',
  vedettes: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=600&fit=crop&q=80',
  about: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=600&fit=crop&q=80'
}

export class ContentService {
  /**
   * Récupère les slides du Hero
   */
  static async getHeroSlides(): Promise<HeroSlide[]> {
    const { db } = useFirebase()
    if (!db) return DEFAULT_HERO_SLIDES

    try {
      const snap = await getDoc(doc(db, 'content', 'hero_slides'))
      if (snap.exists() && Array.isArray(snap.data()?.slides)) {
        return snap.data().slides
      }
    } catch (err) {
      console.warn('[ContentService] Fallback hero slides:', err)
    }

    return DEFAULT_HERO_SLIDES
  }

  /**
   * Enregistre les slides du Hero
   */
  static async saveHeroSlides(slides: HeroSlide[]): Promise<void> {
    const { db } = useFirebase()
    if (!db) throw new Error('Firestore non initialisé')

    const clean = JSON.parse(JSON.stringify(slides))
    await setDoc(doc(db, 'content', 'hero_slides'), {
      slides: clean,
      updatedAt: new Date().toISOString()
    })
  }

  /**
   * Récupère les bannières des pages
   */
  static async getPageBanners(): Promise<PageBanners> {
    const { db } = useFirebase()
    if (!db) return DEFAULT_PAGE_BANNERS

    try {
      const snap = await getDoc(doc(db, 'content', 'banners'))
      if (snap.exists()) {
        return { ...DEFAULT_PAGE_BANNERS, ...snap.data() }
      }
    } catch (err) {
      console.warn('[ContentService] Fallback page banners:', err)
    }

    return DEFAULT_PAGE_BANNERS
  }

  /**
   * Enregistre les bannières des pages
   */
  static async savePageBanners(banners: Partial<PageBanners>): Promise<void> {
    const { db } = useFirebase()
    if (!db) throw new Error('Firestore non initialisé')

    const clean = JSON.parse(JSON.stringify(banners))
    await setDoc(doc(db, 'content', 'banners'), {
      ...clean,
      updatedAt: new Date().toISOString()
    })
  }
}
