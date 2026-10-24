import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: resolve(__dirname, '../.env') })

const firebaseConfig = {
  apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function run() {
  console.log('Ajout du produit ALKEBU-LAN dans Firestore...')
  const productData = {
    id: 100,
    name: 'ALKEBU-LAN',
    slug: 'alkebu-lan',
    description: "Création exclusive ALKEBU-LAN d'inspiration africaine. Élégance intemporelle, confection artisanale soignée et finitions haut de gamme.",
    category: {
      id: 1,
      name: 'Boubous',
      slug: 'boubous',
      order: 1,
      collectionSlug: 'men',
      collection: {
        id: 1,
        name: 'Hommes',
        slug: 'men',
        description: 'Collection masculine traditionnelle',
        order: 1
      }
    },
    collectionSlug: 'men',
    price: 2100,
    is_new: true,
    is_featured: true,
    stock: 25,
    images: [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1000&fit=crop&q=80',
        is_primary: true,
        order: 1
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&h=1000&fit=crop&q=80',
        is_primary: false,
        order: 2
      }
    ],
    variants: [
      { id: 1, size: 'M', color: 'Blanc / Or', stock: 10 },
      { id: 2, size: 'L', color: 'Blanc / Or', stock: 10 },
      { id: 3, size: 'XL', color: 'Blanc / Or', stock: 5 }
    ],
    created_at: new Date().toISOString()
  }

  await setDoc(doc(db, 'products', 'alkebu-lan'), productData)
  console.log('✅ Produit alkebu-lan créé avec succès dans Firestore !')

  // Mettre également à jour content/hero_slides pour que le lien pointe directement sur /products/alkebu-lan
  const heroSlides = [
    {
      id: 1,
      title: 'ALKEBU-LAN',
      price: '2100 FCFA',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=1080&fit=crop&q=80',
      link: '/products/alkebu-lan'
    },
    {
      id: 2,
      title: 'COLLECTION PRINTEMPS',
      price: '1500 FCFA',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=1080&fit=crop&q=80',
      link: '/products/robe-africaine-1'
    },
    {
      id: 3,
      title: 'NOUVEAUTÉS',
      price: '1800 FCFA',
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&h=1080&fit=crop&q=80',
      link: '/products/costume-moderne-1'
    }
  ]

  await setDoc(doc(db, 'content', 'hero_slides'), {
    slides: heroSlides,
    updatedAt: new Date().toISOString()
  })
  console.log('✅ Diapositives Hero enregistrées dans content/hero_slides avec liens directs vers les fiches produits !')
}

run().then(() => process.exit(0)).catch(err => {
  console.error('Erreur:', err)
  process.exit(1)
})
