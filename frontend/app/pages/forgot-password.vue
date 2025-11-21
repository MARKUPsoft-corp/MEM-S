<template>
    <div class="forgot-password-page">
        <!-- African Pattern Background -->
        <AfricanPatternBackground opacity="light" color="gold" />

        <div class="forgot-container">
            <div class="forgot-card">
                <h2 class="forgot-title">Mot de passe oublié</h2>
                <p class="forgot-subtitle">Entrez votre email pour réinitialiser votre mot de passe</p>

                <div v-if="success" class="alert alert-success" role="alert">
                    Un lien de réinitialisation a été envoyé à votre adresse email.
                </div>

                <div v-if="error" class="alert alert-danger" role="alert">
                    {{ error }}
                </div>

                <form @submit.prevent="handleSubmit" class="form">
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" v-model="email" class="form-input"
                            placeholder="votre@email.com" required />
                    </div>

                    <button type="submit" class="btn-submit" :disabled="loading">
                        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                        {{ loading ? 'Envoi...' : 'Réinitialiser le mot de passe' }}
                    </button>
                </form>

                <div class="back-link">
                    <NuxtLink to="/auth">
                        <i class="bi bi-arrow-left"></i>
                        Retour à la connexion
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import AfricanPatternBackground from '../components/AfricanPatternBackground.vue'

const email = ref('')
const loading = ref(false)
const success = ref(false)
const error = ref('')

const handleSubmit = async () => {
    loading.value = true
    success.value = false
    error.value = ''

    try {
        // TODO: Implémenter l'appel API pour reset password
        // const config = useRuntimeConfig()
        // await $fetch(`${config.public.apiBase}/auth/password/reset/`, {
        //     method: 'POST',
        //     body: { email: email.value }
        // })
        
        // Simuler succès pour l'instant
        await new Promise(resolve => setTimeout(resolve, 1000))
        success.value = true
        email.value = ''
    } catch (err: any) {
        error.value = 'Une erreur est survenue. Veuillez réessayer.'
    } finally {
        loading.value = false
    }
}

useHead({
    title: 'Mot de passe oublié - MEM\'S',
    meta: [
        {
            name: 'description',
            content: 'Réinitialiser votre mot de passe MEM\'S'
        }
    ]
})
</script>

<style scoped>
.forgot-password-page {
    position: relative;
    min-height: 100vh;
    background: #F5F2EC;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 100px 1rem 2rem;
}

.forgot-container {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 480px;
}

.forgot-card {
    background: #F5F2EC;
    border-radius: 12px;
    padding: 3rem 2.5rem;
    border: 2px solid rgba(201, 164, 108, 0.3);
    box-shadow: 0 4px 20px rgba(14, 58, 52, 0.15);
}

.forgot-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 1.75rem;
    font-weight: 600;
    color: #0E3A34;
    margin: 0 0 0.5rem 0;
    text-align: center;
}

.forgot-subtitle {
    font-family: 'Montserrat', sans-serif;
    font-size: 0.9375rem;
    color: #2A2A2A;
    margin: 0 0 2rem 0;
    text-align: center;
}

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
}

.btn-submit:hover {
    background: transparent;
    color: #0E3A34;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(14, 58, 52, 0.2);
}

.btn-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.alert {
    padding: 0.75rem 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    font-size: 0.875rem;
}

.alert-success {
    background-color: #d4edda;
    border: 1px solid #c3e6cb;
    color: #155724;
}

.alert-danger {
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    color: #721c24;
}

.back-link {
    text-align: center;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(201, 164, 108, 0.2);
}

.back-link a {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #0E3A34;
    text-decoration: none;
    transition: color 0.3s ease;
}

.back-link a:hover {
    color: #C9A46C;
}

@media (max-width: 767px) {
    .forgot-card {
        padding: 2rem 1.5rem;
    }

    .forgot-title {
        font-size: 1.5rem;
    }
}
</style>
