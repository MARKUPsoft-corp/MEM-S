<template>
    <div class="auth-page">
        <!-- African Pattern Background -->
        <AfricanPatternBackground opacity="light" color="gold" />

        <div class="auth-container">
            <!-- Auth Card -->
            <div class="auth-card">
                <div class="auth-form">
                    <h2 class="auth-title">Bienvenue</h2>
                    <p class="auth-subtitle">Connectez-vous pour continuer vos achats</p>

                    <!-- Error Message -->
                    <div v-if="errors.general" class="alert alert-danger" role="alert">
                        {{ errors.general }}
                    </div>

                    <!-- Google Sign In Button -->
                    <button @click="handleGoogleButton" type="button" class="btn-google" :disabled="loading">
                        <svg class="google-icon" viewBox="0 0 24 24">
                            <path fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continuer avec Google
                    </button>
                </div>

                <!-- Back to Home -->
                <div class="auth-footer">
                    <NuxtLink to="/" class="link-home">
                        <i class="bi bi-arrow-left"></i>
                        Retour à l'accueil
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import AfricanPatternBackground from '../components/AfricanPatternBackground.vue'
import { googleAuthCodeLogin } from 'vue3-google-login'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

// Configuration
const config = useRuntimeConfig()

// États de chargement et erreurs
const loading = ref(false)
const errors = ref<Record<string, string>>({})

// Google Sign In Button click
const handleGoogleButton = () => {
    if (!config.public.googleClientId) {
        errors.value = { general: 'Configuration Google OAuth manquante' }
        return
    }
    
    googleAuthCodeLogin({
        clientId: config.public.googleClientId,
    }).then((response: any) => {
        handleGoogleSuccess(response)
    }).catch(() => {
        errors.value = { general: 'Connexion Google annulée ou échouée' }
    })
}

// Google Sign In - Callback appelé après succès Google
const handleGoogleSuccess = async (response: any) => {
    if (!response.code) {
        errors.value = { general: 'Erreur lors de la connexion Google' }
        return
    }

    loading.value = true
    errors.value = {}

    try {
        // Appeler l'API backend avec le code Google
        const apiResponse = await $fetch(`${config.public.apiBase}/auth/google/`, {
            method: 'POST',
            body: {
                code: response.code
            },
            credentials: 'include'
        })

        // @ts-ignore
        authStore.token = apiResponse.access
        // @ts-ignore
        authStore.user = apiResponse.user
        
        // Sauvegarder dans localStorage
        if (process.client) {
            // @ts-ignore
            localStorage.setItem('token', apiResponse.access)
            // @ts-ignore
            localStorage.setItem('user', JSON.stringify(apiResponse.user))
        }

        // Rediriger vers le profil
        await navigateTo('/profile')
    } catch (error: any) {
        console.error('Erreur Google OAuth:', error)
        errors.value = { general: error.data?.detail || 'Erreur lors de la connexion avec Google' }
    } finally {
        loading.value = false
    }
}

// Page metadata
useHead({
    title: 'Connexion - MEM\'S',
    meta: [
        {
            name: 'description',
            content: 'Connectez-vous pour profiter de tous les avantages MEM\'S'
        }
    ]
})
</script>

<style scoped>
.auth-page {
    position: relative;
    min-height: 100vh;
    background: #F5F2EC;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 100px 1rem 2rem;
}

.auth-container {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 480px;
}

/* Auth Card */
.auth-card {
    position: relative;
    background: #F5F2EC;
    border-radius: 12px;
    padding: 3rem 2.5rem;
    border: 2px solid rgba(201, 164, 108, 0.3);
    box-shadow: 0 4px 20px rgba(14, 58, 52, 0.15);
}

/* Auth Form */
.auth-form {
    position: relative;
    z-index: 2;
    text-align: center;
}

.auth-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 1.75rem;
    font-weight: 600;
    color: #0E3A34;
    margin: 0 0 0.5rem 0;
}

.auth-subtitle {
    font-family: 'Montserrat', sans-serif;
    font-size: 0.9375rem;
    color: #2A2A2A;
    margin: 0 0 2rem 0;
}

/* Google Button */
.btn-google {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 0.875rem 1.5rem;
    background: #FFFFFF;
    border: 2px solid #E5E5E5;
    border-radius: 8px;
    font-family: 'Montserrat', sans-serif;
    font-size: 0.9375rem;
    font-weight: 600;
    color: #2A2A2A;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-google:hover {
    border-color: #C9A46C;
    box-shadow: 0 2px 8px rgba(201, 164, 108, 0.2);
}

.google-icon {
    width: 20px;
    height: 20px;
}

.alert {
  padding: 0.75rem 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.alert-danger {
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

/* Auth Footer */
.auth-footer {
    position: relative;
    z-index: 2;
    text-align: center;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(201, 164, 108, 0.2);
}

.link-home {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #0E3A34;
    text-decoration: none;
    transition: color 0.3s ease;
}

.link-home:hover {
    color: #C9A46C;
}

/* Responsive */
@media (max-width: 767px) {
    .auth-page {
        padding: 100px 1rem 2rem;
    }

    .auth-card {
        padding: 2rem 1.5rem;
    }

    .auth-title {
        font-size: 1.5rem;
    }
}
</style>
