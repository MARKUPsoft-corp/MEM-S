<template>
    <div class="auth-page">
        <!-- African Pattern Background -->
        <AfricanPatternBackground opacity="light" color="gold" />

        <div class="auth-container">
            <!-- Auth Card -->
            <div class="auth-card">
                <!-- African Pattern Background -->
                <!-- Logo -->
                <div class="auth-logo">
                    <NuxtLink to="/">
                        <img src="/images/LOGO.png" alt="MEM'S" class="logo-image" />
                    </NuxtLink>
                </div>

                <!-- Tabs -->
                <div class="auth-tabs">
                    <button @click="activeTab = 'login'" :class="['auth-tab', { active: activeTab === 'login' }]">
                        Connexion
                    </button>
                    <button @click="activeTab = 'register'" :class="['auth-tab', { active: activeTab === 'register' }]">
                        Inscription
                    </button>
                </div>

                <!-- Login Form -->
                <div v-if="activeTab === 'login'" class="auth-form">
                    <h2 class="auth-title">Bienvenue</h2>
                    <p class="auth-subtitle">Connectez-vous pour continuer vos achats</p>

                    <!-- Google Sign In Button -->
                    <button @click="signInWithGoogle" class="btn-google">
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

                    <!-- Divider -->
                    <div class="divider">
                        <span class="divider-text">ou</span>
                    </div>

                    <!-- Email/Password Form -->
                    <form @submit.prevent="handleLogin" class="form">
                        <div class="form-group">
                            <label class="form-label">Email</label>
                            <input type="email" v-model="loginForm.email" class="form-input"
                                placeholder="votre@email.com" required />
                        </div>

                        <div class="form-group">
                            <label class="form-label">Mot de passe</label>
                            <input type="password" v-model="loginForm.password" class="form-input"
                                placeholder="••••••••" required />
                        </div>

                        <div class="form-footer">
                            <NuxtLink to="/forgot-password" class="link-forgot">
                                Mot de passe oublié ?
                            </NuxtLink>
                        </div>

                        <button type="submit" class="btn-submit">
                            Se connecter
                        </button>
                    </form>
                </div>

                <!-- Register Form -->
                <div v-if="activeTab === 'register'" class="auth-form">
                    <h2 class="auth-title">Créer un compte</h2>
                    <p class="auth-subtitle">Rejoignez-nous pour une expérience unique</p>

                    <!-- Google Sign In Button -->
                    <button @click="signInWithGoogle" class="btn-google">
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

                    <!-- Divider -->
                    <div class="divider">
                        <span class="divider-text">ou</span>
                    </div>

                    <!-- Email/Password Form -->
                    <form @submit.prevent="handleRegister" class="form">
                        <div class="form-group">
                            <label class="form-label">Nom complet</label>
                            <input type="text" v-model="registerForm.name" class="form-input" placeholder="Votre nom"
                                required />
                        </div>

                        <div class="form-group">
                            <label class="form-label">Email</label>
                            <input type="email" v-model="registerForm.email" class="form-input"
                                placeholder="votre@email.com" required />
                        </div>

                        <div class="form-group">
                            <label class="form-label">Mot de passe</label>
                            <input type="password" v-model="registerForm.password" class="form-input"
                                placeholder="••••••••" required />
                        </div>

                        <div class="form-group">
                            <label class="form-label">Confirmer le mot de passe</label>
                            <input type="password" v-model="registerForm.confirmPassword" class="form-input"
                                placeholder="••••••••" required />
                        </div>

                        <button type="submit" class="btn-submit">
                            S'inscrire
                        </button>
                    </form>
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

const activeTab = ref('login')

const loginForm = ref({
    email: '',
    password: ''
})

const registerForm = ref({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
})

// Google Sign In
const signInWithGoogle = () => {
    // TODO: Implement Google OAuth
    console.log('Sign in with Google')
    alert('Authentification Google à implémenter avec le backend')
}

// Handle Login
const handleLogin = () => {
    console.log('Login:', loginForm.value)
    // TODO: Implement login logic
    alert('Connexion à implémenter avec le backend')
}

// Handle Register
const handleRegister = () => {
    if (registerForm.value.password !== registerForm.value.confirmPassword) {
        alert('Les mots de passe ne correspondent pas')
        return
    }
    console.log('Register:', registerForm.value)
    // TODO: Implement register logic
    alert('Inscription à implémenter avec le backend')
}

// Disable default layout (no navbar/footer)
definePageMeta({
    layout: false
})

// Page metadata
useHead({
    title: 'Connexion / Inscription - MEM\'S',
    meta: [
        {
            name: 'description',
            content: 'Connectez-vous ou créez un compte pour profiter de tous les avantages MEM\'S'
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
    padding: 2rem 1rem;
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

/* Logo */
.auth-logo {
    position: relative;
    z-index: 2;
    text-align: center;
    margin-bottom: 2rem;
}

.logo-image {
    height: 120px;
    width: auto;
    transition: opacity 0.3s ease;
}

.auth-logo a:hover .logo-image {
    opacity: 0.8;
}

/* Tabs */
.auth-tabs {
    position: relative;
    z-index: 2;
    display: flex;
    gap: 0;
    margin-bottom: 2rem;
    border-bottom: 2px solid rgba(201, 164, 108, 0.2);
}

.auth-tab {
    flex: 1;
    padding: 1rem;
    background: transparent;
    border: none;
    border-bottom: 3px solid transparent;
    font-family: 'Montserrat', sans-serif;
    font-size: 1rem;
    font-weight: 500;
    color: #2A2A2A;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    bottom: -2px;
}

.auth-tab:hover {
    color: #0E3A34;
}

.auth-tab.active {
    color: #0E3A34;
    font-weight: 600;
    border-bottom-color: #0E3A34;
}

/* Auth Form */
.auth-form {
    position: relative;
    z-index: 2;
}

.auth-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 1.75rem;
    font-weight: 600;
    color: #0E3A34;
    margin: 0 0 0.5rem 0;
    text-align: center;
}

.auth-subtitle {
    font-family: 'Montserrat', sans-serif;
    font-size: 0.9375rem;
    color: #2A2A2A;
    margin: 0 0 2rem 0;
    text-align: center;
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

/* Divider */
.divider {
    position: relative;
    text-align: center;
    margin: 1.5rem 0;
}

.divider::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(201, 164, 108, 0.2);
}

.divider-text {
    position: relative;
    display: inline-block;
    padding: 0 1rem;
    background: #F5F2EC;
    font-size: 0.875rem;
    color: #2A2A2A;
}

/* Form */
.form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-label {
    font-family: 'Montserrat', sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    color: #0E3A34;
}

.form-input {
    padding: 0.875rem 1rem;
    border: 2px solid rgba(201, 164, 108, 0.2);
    border-radius: 8px;
    font-family: 'Montserrat', sans-serif;
    font-size: 0.9375rem;
    color: #0B0B0B;
    background: #F5F2EC;
    transition: all 0.3s ease;
}

.form-input:focus {
    outline: none;
    border-color: #C9A46C;
    background: #FFFFFF;
}

.form-input::placeholder {
    color: #999;
}

.form-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: -0.5rem;
}

.link-forgot {
    font-size: 0.875rem;
    color: #C9A46C;
    text-decoration: none;
    transition: color 0.3s ease;
}

.link-forgot:hover {
    color: #0E3A34;
}

/* Submit Button */
.btn-submit {
    width: 100%;
    padding: 1rem;
    background: #0E3A34;
    border: 2px solid #0E3A34;
    border-radius: 8px;
    font-family: 'Montserrat', sans-serif;
    font-size: 0.9375rem;
    font-weight: 600;
    color: #F5F2EC;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 0.5rem;
}

.btn-submit:hover {
    background: transparent;
    color: #0E3A34;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(14, 58, 52, 0.2);
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

    .logo-image {
        height: 60px;
    }
}
</style>
