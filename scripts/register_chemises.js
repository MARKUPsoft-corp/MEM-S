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

const chemiseDir = resolve(__dirname, '../public/chemise')

const chemisePairs = [
  {
    num: '026',
    name: 'Chemise 026',
    slug: 'chemise-026',
    description: "Chemise africaine moderne bicolore blanche avec manches et détails rayés bleus, col officier au tombé impeccable. Finitions soignées et élégance contemporaine. Personnalisez votre modèle : choisissez votre COULEUR, votre TISSU (Wax, Dashiki, Kita...) et les détails de vos finitions via le bouton WhatsApp.",
    faceFile: 'Image ChatGPT 28 sept. 2026, 02_30_04.png',
    profileFile: 'Image ChatGPT 28 sept. 2026, 02_30_10.png',
    cleanFaceName: 'chemise-026-1.png',
    cleanProfileName: 'chemise-026-2.png',
    knownFaceUrl: 'https://res.cloudinary.com/dacfzjszd/image/upload/v1790558222/MEMS/szhc8unsw8mrv2bgsqzf.png',
    knownProfileUrl: 'https://res.cloudinary.com/dacfzjszd/image/upload/v1790558224/MEMS/px5qmvcqqiagfzkzbzqg.png'
  },
  {
    num: '027',
    name: 'Chemise 027',
    slug: 'chemise-027',
    description: "Chemise africaine moderne noire avec plastron central à motifs tie-dye / batik texturé marron et beige. Élégance intemporelle et inspiration artisanale. Personnalisez votre modèle : choisissez votre COULEUR, votre TISSU (Wax, Dashiki, Kita...) et les détails de vos finitions via le bouton WhatsApp.",
    faceFile: 'Image ChatGPT 28 sept. 2026, 02_30_17.png',
    profileFile: 'Image ChatGPT 28 sept. 2026, 02_30_22.png',
    cleanFaceName: 'chemise-027-1.png',
    cleanProfileName: 'chemise-027-2.png'
  },
  {
    num: '028',
    name: 'Chemise 028',
    slug: 'chemise-028',
    description: "Chemise africaine moderne beige à motifs verticaux tie-dye et poches plaquées stylisées. Coupe élégante et tissu d'exception. Personnalisez votre modèle : choisissez votre COULEUR, votre TISSU (Wax, Dashiki, Kita...) et les détails de vos finitions via le bouton WhatsApp.",
    faceFile: 'Image ChatGPT 28 sept. 2026, 02_30_26.png',
    profileFile: 'Image ChatGPT 28 sept. 2026, 02_30_31.png',
    cleanFaceName: 'chemise-028-1.png',
    cleanProfileName: 'chemise-028-2.png'
  }
]

async function getFirebaseAccessToken() {
  const p = join(os.homedir(), '.config/configstore/firebase-tools.json')
  if (!fs.existsSync(p)) {
    throw new Error('Fichier firebase-tools.json introuvable')
  }
  const creds = JSON.parse(fs.readFileSync(p, 'utf8'))
  let token = creds.tokens?.access_token

  // Vérifier si le token est encore valide
  const testRes = await fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/products/chemise-025`, {
    headers: { Authorization: `Bearer ${token}` }
  })

  if (testRes.status === 401 && creds.tokens?.refresh_token) {
    console.log('🔄 Token expiré, rafraîchissement en cours...')
    const refreshRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: '563584335869-fgrhgmd47bqnekij5i8b5pr03ho859e1.apps.googleusercontent.com',
        grant_type: 'refresh_token',
        refresh_token: creds.tokens.refresh_token
      })
    })
    const refreshData = await refreshRes.json()
    if (refreshData.access_token) {
      token = refreshData.access_token
      creds.tokens.access_token = token
      fs.writeFileSync(p, JSON.stringify(creds, null, 2))
      console.log('✅ Token rafraîchi avec succès')
    } else {
      throw new Error('Impossible de rafraîchir le token: ' + JSON.stringify(refreshData))
    }
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

async function uploadToCloudinary(filePath, customFileName) {
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
  return data.secure_url
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
  console.log('🚀 Démarrage de l\'enregistrement des chemises dans Firestore...')
  const token = await getFirebaseAccessToken()
  console.log('🔑 Authentification Firebase CLI confirmée')

  // Copie/renommage propre dans public/chemise/
  for (const item of chemisePairs) {
    const origFacePath = join(chemiseDir, item.faceFile)
    const cleanFacePath = join(chemiseDir, item.cleanFaceName)
    if (fs.existsSync(origFacePath) && !fs.existsSync(cleanFacePath)) {
      fs.copyFileSync(origFacePath, cleanFacePath)
      console.log(`📁 Fichier copié: ${item.cleanFaceName}`)
    }

    const origProfilePath = join(chemiseDir, item.profileFile)
    const cleanProfilePath = join(chemiseDir, item.cleanProfileName)
    if (fs.existsSync(origProfilePath) && !fs.existsSync(cleanProfilePath)) {
      fs.copyFileSync(origProfilePath, cleanProfilePath)
      console.log(`📁 Fichier copié: ${item.cleanProfileName}`)
    }
  }

  for (let i = 0; i < chemisePairs.length; i++) {
    const item = chemisePairs[i]
    console.log(`\n👕 Traitement de ${item.name} (${item.slug})...`)

    let faceUrl = item.knownFaceUrl
    if (!faceUrl) {
      const facePath = join(chemiseDir, item.cleanFaceName)
      console.log(`  - Upload Cloudinary face: ${item.cleanFaceName}`)
      faceUrl = await uploadToCloudinary(facePath, item.cleanFaceName)
      console.log(`    ✓ ${faceUrl}`)
    } else {
      console.log(`  - URL face existante réutilisée: ${faceUrl}`)
    }

    let profileUrl = item.knownProfileUrl
    if (!profileUrl) {
      const profilePath = join(chemiseDir, item.cleanProfileName)
      console.log(`  - Upload Cloudinary profil: ${item.cleanProfileName}`)
      profileUrl = await uploadToCloudinary(profilePath, item.cleanProfileName)
      console.log(`    ✓ ${profileUrl}`)
    } else {
      console.log(`  - URL profil existante réutilisée: ${profileUrl}`)
    }

    const now = Date.now() + i * 1000
    const nowIso = new Date().toISOString()

    const productData = {
      id: now,
      name: item.name,
      slug: item.slug,
      description: item.description,
      category: {
        id: 4,
        name: 'Chemises',
        slug: 'chemises',
        collectionSlug: 'men'
      },
      collectionSlug: 'men',
      price: 15000,
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

    console.log(`  - Sauvegarde du document dans Firestore...`)
    await saveProductToFirestore(token, item.slug, productData)
    console.log(`  ✅ ${item.name} (${item.slug}) enregistré avec succès dans Firestore !`)
  }

  console.log('\n🎉 Les 3 produits ont été enregistrés avec succès dans Firestore !')
}

run().catch(err => {
  console.error('❌ Erreur:', err)
  process.exit(1)
})
