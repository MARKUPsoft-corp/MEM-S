<template>
    <div class="auth-page">
        <!-- African Pattern Background -->
        <AfricanPatternBackground opacity="light" color="gold" />

        <div class="auth-container">
            <!-- Auth Card -->
            <div class="auth-card">
                <div class="auth-form">
                    <h2 class="auth-title">{{ isRegister ? 'Créer un compte' : 'Bienvenue' }}</h2>
                    <div class="title-underline"></div>
                    <p class="auth-subtitle">{{ isRegister ? 'Rejoignez l\'univers MEM\'S' : 'Connectez-vous pour continuer vos achats' }}</p>

                    <!-- Error Message -->
                    <div v-if="error" class="alert alert-danger" role="alert">
                        <i class="bi bi-exclamation-triangle-fill me-2"></i>
                        {{ error }}
                    </div>

                    <!-- Google Sign In Button -->
                    <button @click="handleGoogleLogin" type="button" class="btn-google" :disabled="loading">
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

                    <div class="auth-divider">
                        <span>ou par email</span>
                    </div>

                    <!-- Email/Password Form -->
                    <form @submit.prevent="handleEmailAuth" class="email-form">
                        <div v-if="isRegister" class="form-row">
                            <div class="form-group">
                                <label class="form-label">Prénom</label>
                                <input v-model="formData.firstName" type="text" class="form-input" placeholder="Prénom" required />
                            </div>
                            <div class="form-group">
                                <label class="form-label">Nom</label>
                                <input v-model="formData.lastName" type="text" class="form-input" placeholder="Nom" required />
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Email</label>
                            <input v-model="formData.email" type="email" class="form-input" placeholder="exemple@email.com" required />
                        </div>

                        <div class="form-group">
                            <label class="form-label">Mot de passe</label>
                            <input v-model="formData.password" type="password" class="form-input" placeholder="••••••••" required minlength="6" />
                        </div>

                        <button type="submit" class="btn-submit" :disabled="loading">
                            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                            {{ isRegister ? 'Créer mon compte' : 'Se connecter' }}
                        </button>
                    </form>

                    <!-- Toggle Mode -->
                    <div class="auth-toggle">
                        <span>{{ isRegister ? 'Vous avez déjà un compte ?' : 'Nouveau client ?' }}</span>
                        <button type="button" @click="isRegister = !isRegister" class="btn-toggle">
                            {{ isRegister ? 'Se connecter' : 'Créer un compte' }}
                        </button>
                    </div>
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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AfricanPatternBackground from '../components/AfricanPatternBackground.vue'
import { useAuthStore } from '../../stores/auth'
import type { User } from '../../types/auth'

const authStore = useAuthStore()
const route = useRoute()

const isRegister = ref(false)
const loading = ref(false)
const error = ref('')

const formData = ref({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
})

// Redirection selon le rôle de l'utilisateur
const redirectAfterAuth = (user: User) => {
    // Si son rôle est admin, il tombe directement dans le tableau admin
    if (user.role === 'admin' || authStore.isAdmin) {
        return navigateTo('/admin')
    }

    // S'il est client, il reste sur la page client (page demandée ou accueil)
    const redirectUrl = route.query.redirect as string
    if (redirectUrl && !redirectUrl.startsWith('/admin')) {
        return navigateTo(redirectUrl)
    }
    return navigateTo('/')
}

// Si l'utilisateur est déjà connecté en arrivant sur /auth
onMounted(async () => {
    await authStore.initAuth()
    if (authStore.isAuthenticated && authStore.user) {
        if (authStore.isAdmin) {
            navigateTo('/admin')
        } else {
            const redirectUrl = route.query.redirect as string
            if (redirectUrl && !redirectUrl.startsWith('/admin')) {
                navigateTo(redirectUrl)
            } else {
                navigateTo('/')
            }
        }
    }
})

const handleGoogleLogin = async () => {
    if (loading.value) return
    loading.value = true
    error.value = ''
    try {
        const user = await authStore.loginWithGoogle()
        await redirectAfterAuth(user)
    } catch (err: any) {
        console.error('Erreur Google Login:', err)
        error.value = err.message || 'Échec de la connexion avec Google.'
    } finally {
        loading.value = false
    }
}

const handleEmailAuth = async () => {
    loading.value = true
    error.value = ''

    try {
        let user: User
        if (isRegister.value) {
            user = await authStore.register({
                email: formData.value.email,
                password: formData.value.password,
                first_name: formData.value.firstName,
                last_name: formData.value.lastName
            })
        } else {
            user = await authStore.login({
                email: formData.value.email,
                password: formData.value.password
            })
        }
        await redirectAfterAuth(user)
    } catch (err: any) {
        console.error('Erreur authentification:', err)
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
            error.value = 'Email ou mot de passe incorrect.'
        } else if (err.code === 'auth/email-already-in-use') {
            error.value = 'Un compte existe déjà avec cette adresse email.'
        } else if (err.code === 'auth/weak-password') {
            error.value = 'Le mot de passe doit contenir au moins 6 caractères.'
        } else {
            error.value = err.message || 'Une erreur est survenue lors de l\'authentification.'
        }
    } finally {
        loading.value = false
    }
}

useHead({
    title: 'Authentification - MEM\'S',
    meta: [
        { name: 'description', content: 'Connectez-vous à votre espace client MEM\'S.' }
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
    padding: 2rem 1rem;
}

.auth-container {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 460px;
}

.auth-card {
    background: #FFFFFF;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(14, 58, 52, 0.08);
    border: 1px solid rgba(201, 164, 108, 0.25);
    overflow: hidden;
}

.auth-form {
    padding: 2.5rem 2rem;
}

.auth-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 1.85rem;
    font-weight: 700;
    color: #0E3A34;
    text-align: center;
    margin-bottom: 0.5rem;
}

.title-underline {
    width: 50px;
    height: 3px;
    background: #C9A46C;
    margin: 0 auto 1rem auto;
    border-radius: 2px;
}

.auth-subtitle {
    text-align: center;
    color: #666;
    font-size: 0.95rem;
    margin-bottom: 2rem;
}

.btn-google {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 0.85rem 1.25rem;
    background: #FFFFFF;
    border: 1.5px solid #E0E0E0;
    border-radius: 8px;
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    font-size: 0.95rem;
    color: #2A2A2A;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-google:hover:not(:disabled) {
    background: #FAFAFA;
    border-color: #C9A46C;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.btn-google:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.google-icon {
    width: 20px;
    height: 20px;
}

.auth-divider {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 1.75rem 0;
    color: #999;
    font-size: 0.85rem;
}

.auth-divider::before,
.auth-divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #E5E5E5;
}

.auth-divider span {
    padding: 0 1rem;
}

.email-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}

.form-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #0E3A34;
}

.form-input {
    padding: 0.75rem 1rem;
    border: 1px solid rgba(201, 164, 108, 0.3);
    border-radius: 8px;
    font-family: 'Montserrat', sans-serif;
    font-size: 0.95rem;
    outline: none;
    transition: border-color 0.3s ease;
}

.form-input:focus {
    border-color: #C9A46C;
    box-shadow: 0 0 0 3px rgba(201, 164, 108, 0.15);
}

.btn-submit {
    margin-top: 0.5rem;
    padding: 0.85rem;
    background: #0E3A34;
    color: #F5F2EC;
    border: none;
    border-radius: 8px;
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s ease;
}

.btn-submit:hover:not(:disabled) {
    background: #C9A46C;
    color: #0B0B0B;
}

.btn-submit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.auth-toggle {
    text-align: center;
    margin-top: 1.5rem;
    font-size: 0.9rem;
    color: #666;
}

.btn-toggle {
    background: none;
    border: none;
    color: #C9A46C;
    font-weight: 600;
    cursor: pointer;
    margin-left: 0.35rem;
    text-decoration: underline;
}

.auth-footer {
    background: #FAFAFA;
    padding: 1.25rem;
    text-align: center;
    border-top: 1px solid #F0F0F0;
}

.link-home {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: #0E3A34;
    font-size: 0.9rem;
    font-weight: 500;
    text-decoration: none;
    transition: color 0.3s ease;
}

.link-home:hover {
    color: #C9A46C;
}
</style>
