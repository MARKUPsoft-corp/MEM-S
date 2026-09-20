import { googleOneTap } from 'vue3-google-login'

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()

    if (process.client && config.public.googleClientId) {
        // Initialiser Google One Tap
        googleOneTap({
            clientId: config.public.googleClientId,
        })
        console.log('Google OAuth Client ID configuré:', config.public.googleClientId.substring(0, 20) + '...')
    }
})
