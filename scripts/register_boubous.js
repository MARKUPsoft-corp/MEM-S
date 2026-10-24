import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve, join } from 'path'
import fs from 'fs'
import os from 'os'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: resolve(__dirname, '../.env') })

const cloudName = process.env.NUXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dacfzjszd'
const uploadPreset = process.env.NUXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'mems_unsigned'
const projectId = process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID || 'mem-s-18304'

const boubouDir = resolve(__dirname, '../public/boubous')
const cacheFile = resolve(__dirname, 'boubous_upload_cache.json')

// 24 paires ordonnées face (vue de face) et profil (vue de côté)
const rawPairs = [
  ['Image ChatGPT 28 sept. 2026, 03_29_18.png', 'Image ChatGPT 28 sept. 2026, 03_29_24.png'],
  ['Image ChatGPT 28 sept. 2026, 03_29_43.png', 'Image ChatGPT 28 sept. 2026, 03_29_53.png'],
  ['Image ChatGPT 28 sept. 2026, 03_29_58.png', 'Image ChatGPT 28 sept. 2026, 03_30_03.png'],
  ['Image ChatGPT 28 sept. 2026, 03_30_16.png', 'Image ChatGPT 28 sept. 2026, 03_30_51.png'],
  ['Image ChatGPT 28 sept. 2026, 03_31_12.png', 'Image ChatGPT 28 sept. 2026, 03_31_27(1).png'],
  ['Image ChatGPT 28 sept. 2026, 03_31_27.png', 'Image ChatGPT 28 sept. 2026, 03_31_31.png'],
  ['Image ChatGPT 28 sept. 2026, 03_31_36.png', 'Image ChatGPT 28 sept. 2026, 03_31_39.png'],
  ['Image ChatGPT 28 sept. 2026, 03_31_53.png', 'Image ChatGPT 28 sept. 2026, 03_31_58.png'],
  ['Image ChatGPT 28 sept. 2026, 03_32_02.png', 'Image ChatGPT 28 sept. 2026, 03_32_07.png'],
  ['Image ChatGPT 28 sept. 2026, 03_32_38.png', 'Image ChatGPT 28 sept. 2026, 03_32_42.png'],
  ['Image ChatGPT 28 sept. 2026, 03_34_52.png', 'Image ChatGPT 28 sept. 2026, 03_34_57.png'],
  ['Image ChatGPT 28 sept. 2026, 03_35_03.png', 'Image ChatGPT 28 sept. 2026, 03_35_09.png'],
  ['Image ChatGPT 28 sept. 2026, 03_35_26.png', 'Image ChatGPT 28 sept. 2026, 03_35_30.png'],
  ['Image ChatGPT 28 sept. 2026, 03_35_37.png', 'Image ChatGPT 28 sept. 2026, 03_35_44.png'],
  ['Image ChatGPT 28 sept. 2026, 03_35_50.png', 'Image ChatGPT 28 sept. 2026, 03_35_55.png'],
  ['Image ChatGPT 28 sept. 2026, 03_36_05.png', 'Image ChatGPT 28 sept. 2026, 03_36_09.png'],
  ['Image ChatGPT 28 sept. 2026, 03_36_20.png', 'Image ChatGPT 28 sept. 2026, 03_36_41.png'],
  ['Image ChatGPT 28 sept. 2026, 03_36_50.png', 'Image ChatGPT 28 sept. 2026, 03_36_53.png'],
  ['Image ChatGPT 28 sept. 2026, 03_36_58.png', 'Image ChatGPT 28 sept. 2026, 03_37_02.png'],
  ['Image ChatGPT 28 sept. 2026, 03_37_07.png', 'Image ChatGPT 28 sept. 2026, 03_37_11.png'],
  ['Image ChatGPT 28 sept. 2026, 03_37_39.png', 'Image ChatGPT 28 sept. 2026, 03_37_44.png'],
  ['Image ChatGPT 28 sept. 2026, 03_37_50.png', 'Image ChatGPT 28 sept. 2026, 03_37_54.png'],
  ['Image ChatGPT 28 sept. 2026, 03_38_16.png', 'Image ChatGPT 28 sept. 2026, 03_38_21.png'],
  ['Image ChatGPT 28 sept. 2026, 03_38_34.png', 'Image ChatGPT 28 sept. 2026, 03_38_38.png']
]

// Construction de la liste des 24 boubous (de 041 à 064)
const START_INDEX = 41
const boubousList = rawPairs.map((pair, idx) => {
  const num = String(START_INDEX + idx).padStart(3, '0')
  return {
    num,
    name: `Boubou Prestige ${num}`,
    slug: `boubou-prestige-${num}`,
    description: "Boubou africain moderne au tombé élégant, sublimé par une broderie raffinée aux finitions soignées.\nPersonnalisez votre modèle : choisissez votre COULEUR, votre TISSU et même le style et les motifs de la BRODERIE via le bouton WhatsApp",
    price: 44900,
    faceFile: pair[0],
    profileFile: pair[1],
    cleanFaceName: `boubou-prestige-${num}-1.png`,
    cleanProfileName: `boubou-prestige-${num}-2.png`
  }
})

// Gestion du cache d'upload
let uploadCache = {}
if (fs.existsSync(cacheFile)) {
  try {
    uploadCache = JSON.parse(fs.readFileSync(cacheFile, 'utf8'))
  } catch (e) {
    uploadCache = {}
  }
}

function saveCache() {
  fs.writeFileSync(cacheFile, JSON.stringify(uploadCache, null, 2))
}

async function getFirebaseAccessToken() {
  const p = join(os.homedir(), '.config/configstore/firebase-tools.json')
  if (!fs.existsSync(p)) {
    throw new Error('Fichier firebase-tools.json introuvable')
  }
  const creds = JSON.parse(fs.readFileSync(p, 'utf8'))
  let token = creds.tokens?.access_token

  // Vérifier si le token est encore valide
  const testRes = await fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/products/boubou-prestige-040`, {
    headers: { Authorization: `Bearer ${token}` }
  })

  if (testRes.status === 401) {
    console.log('🔄 Token expiré, rafraîchissement via Firebase CLI...')
    const { execSync } = await import('child_process')
    execSync('firebase projects:list', { stdio: 'ignore' })
    const refreshedCreds = JSON.parse(fs.readFileSync(p, 'utf8'))
    token = refreshedCreds.tokens?.access_token
    console.log('✅ Token rafraîchi avec succès')
  }

  return token
}

function toFirestoreValue(val) {
  if (val === null || val === undefined) return { nullValue: null }
  if (typeof val === 'boolean') return { booleanValue: val }
  if (typeof val === 'number') {
    if (Number.isInteger(val)) return { integerValue: String(val) }
    return { doubleValue: val }
  }
  if (typeof val === 'string') return { stringValue: val }
  if (Array.isArray(val)) {
    if (val.length === 0) return { arrayValue: {} }
    return { arrayValue: { values: val.map(toFirestoreValue) } }
  }
  if (typeof val === 'object') {
    const fields = {}
    for (const [k, v] of Object.entries(val)) {
      fields[k] = toFirestoreValue(v)
    }
    return { mapValue: { fields } }
  }
  return { stringValue: String(val) }
}

async function uploadToCloudinary(filePath, customFileName, retries = 5) {
  if (uploadCache[customFileName]) {
    return uploadCache[customFileName]
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const fileBuffer = fs.readFileSync(filePath)
      const blob = new Blob([fileBuffer], { type: 'image/png' })
      const formData = new FormData()
      formData.append('file', blob, customFileName)
      formData.append('upload_preset', uploadPreset)
      formData.append('folder', 'MEMS')

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Échec upload Cloudinary pour ${customFileName}: ${errorText}`)
      }

      const data = await res.json()
      uploadCache[customFileName] = data.secure_url
      saveCache()
      return data.secure_url
    } catch (err) {
      console.warn(`  ⚠️ Tentative ${attempt}/${retries} échouée pour ${customFileName} (${err.message}). Nouvelle tentative dans 3s...`)
      if (attempt === retries) throw err
      await new Promise(r => setTimeout(r, 3000))
    }
  }
}

async function saveProductToFirestore(token, slug, productData) {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/products/${slug}`
  const fields = toFirestoreValue(productData).mapValue.fields

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fields })
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`Échec écriture Firestore (${res.status}): ${errorText}`)
  }

  return await res.json()
}

async function run() {
  console.log(`🚀 Démarrage du traitement de ${boubousList.length} boubous (Boubou Prestige 041 à 064)...`)
  const token = await getFirebaseAccessToken()
  console.log('🔑 Authentification Firebase CLI confirmée')

  // Copie/renommage propre dans public/boubous/ si nécessaire
  for (const item of boubousList) {
    const origFacePath = join(boubouDir, item.faceFile)
    const cleanFacePath = join(boubouDir, item.cleanFaceName)
    if (fs.existsSync(origFacePath) && !fs.existsSync(cleanFacePath)) {
      fs.copyFileSync(origFacePath, cleanFacePath)
    }

    const origProfilePath = join(boubouDir, item.profileFile)
    const cleanProfilePath = join(boubouDir, item.cleanProfileName)
    if (fs.existsSync(origProfilePath) && !fs.existsSync(cleanProfilePath)) {
      fs.copyFileSync(origProfilePath, cleanProfilePath)
    }
  }

  for (let i = 0; i < boubousList.length; i++) {
    const item = boubousList[i]
    console.log(`\n👘 [${i + 1}/${boubousList.length}] Traitement de ${item.name} (${item.slug})...`)

    const facePath = join(boubouDir, item.cleanFaceName)
    const profilePath = join(boubouDir, item.cleanProfileName)

    console.log(`  - Upload face: ${item.cleanFaceName}`)
    const faceUrl = await uploadToCloudinary(facePath, item.cleanFaceName)
    console.log(`    ✓ ${faceUrl}`)

    console.log(`  - Upload profil: ${item.cleanProfileName}`)
    const profileUrl = await uploadToCloudinary(profilePath, item.cleanProfileName)
    console.log(`    ✓ ${profileUrl}`)

    const now = Date.now() + i * 1000
    const nowIso = new Date().toISOString()

    const productData = {
      id: now,
      name: item.name,
      slug: item.slug,
      description: item.description,
      category: {
        id: 1,
        name: 'Boubous',
        slug: 'boubous',
        collectionSlug: 'men'
      },
      collectionSlug: 'men',
      price: item.price,
      discount_price: null,
      is_new: true,
      is_featured: false,
      stock: 10,
      variants: [],
      images: [
        {
          id: now + 1,
          image: faceUrl,
          is_primary: true,
          order: 1
        },
        {
          id: now + 2,
          image: profileUrl,
          is_primary: false,
          order: 2
        }
      ],
      created_at: nowIso,
      updated_at: nowIso
    }

    console.log(`  - Enregistrement Firestore...`)
    await saveProductToFirestore(token, item.slug, productData)
    console.log(`  ✅ ${item.name} sauvegardé dans Firestore !`)
  }

  console.log(`\n🎉 Succès total : 24 boubous (Boubou Prestige 041 à 064) enregistrés dans Firestore !`)
}

run().catch(err => {
  console.error('❌ Erreur:', err)
  process.exit(1)
})
