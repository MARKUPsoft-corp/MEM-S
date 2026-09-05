/**
 * Script de Seeding Firestore pour MEM'S
 * Permet de peupler automatiquement les collections, catégories et les 93 produits dans Firebase Firestore.
 * 
 * Utilisation :
 * node scripts/seed_firestore.js
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { readFileSync } from 'fs'

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

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('❌ Erreur : Veuillez renseigner NUXT_PUBLIC_FIREBASE_API_KEY et NUXT_PUBLIC_FIREBASE_PROJECT_ID dans frontend/.env avant d\'exécuter ce script.')
  process.exit(1)
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

import createJiti from 'jiti'
const jiti = createJiti(import.meta.url)

console.log('🚀 Initialisation du seeding Firestore pour le projet:', firebaseConfig.projectId)

async function seed() {
  try {
    // Importer dynamiquement les données avec jiti
    const { INITIAL_COLLECTIONS, INITIAL_CATEGORIES, INITIAL_PRODUCTS } = jiti('../data/productsData.ts')

    console.log(`📦 Insertion de ${INITIAL_COLLECTIONS.length} collections...`)
    for (const col of INITIAL_COLLECTIONS) {
      await setDoc(doc(db, 'collections', col.slug), col)
      console.log(`  ✓ Collection: ${col.name}`)
    }

    console.log(`📦 Insertion de ${INITIAL_CATEGORIES.length} catégories...`)
    for (const cat of INITIAL_CATEGORIES) {
      await setDoc(doc(db, 'categories', cat.slug), cat)
      console.log(`  ✓ Catégorie: ${cat.name}`)
    }

    console.log(`📦 Insertion de ${INITIAL_PRODUCTS.length} produits...`)
    let count = 0
    for (const prod of INITIAL_PRODUCTS) {
      const cleanProd = JSON.parse(JSON.stringify(prod))
      await setDoc(doc(db, 'products', prod.slug), cleanProd)
      count++
      if (count % 10 === 0 || count === INITIAL_PRODUCTS.length) {
        console.log(`  ✓ ${count}/${INITIAL_PRODUCTS.length} produits insérés...`)
      }
    }

    console.log('\n🎉 Seeding Firestore terminé avec succès !')
  } catch (error) {
    console.error('❌ Erreur lors du seeding Firestore:', error)
  }
}

seed()
