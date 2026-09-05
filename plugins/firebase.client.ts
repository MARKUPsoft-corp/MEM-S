import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { initializeFirestore, getFirestore, type Firestore } from 'firebase/firestore'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey || 'AIzaSyBoNLQUaQc9fUtn0TnfIS4dAxUKVrUnM94',
    authDomain: config.public.firebaseAuthDomain || 'mem-s-18304.firebaseapp.com',
    projectId: config.public.firebaseProjectId || 'mem-s-18304',
    storageBucket: config.public.firebaseStorageBucket || 'mem-s-18304.firebasestorage.app',
    messagingSenderId: config.public.firebaseMessagingSenderId || '542286802778',
    appId: config.public.firebaseAppId || '1:542286802778:web:832e2f215734728a8d4d63',
  }

  let app: FirebaseApp
  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0]
  }

  const auth = getAuth(app)
  let db: Firestore
  try {
    db = initializeFirestore(app, {
      experimentalForceLongPolling: true
    })
  } catch {
    db = getFirestore(app)
  }

  return {
    provide: {
      firebaseApp: app,
      firebaseAuth: auth,
      firestore: db
    }
  }
})
