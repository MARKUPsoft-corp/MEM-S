<template>
    <div class="profile-page">
        <!-- African Pattern Background -->
        <AfricanPatternBackground opacity="light" color="gold" />

        <div class="profile-container">
            <div class="profile-card">
                <div class="profile-header">
                    <h2 class="profile-title">Mon Profil</h2>
                    <div class="title-underline"></div>
                    <p class="profile-subtitle">Gérez vos informations personnelles</p>
                </div>

                <!-- Success Message -->
                <div v-if="successMessage" class="alert alert-success" role="alert">
                    {{ successMessage }}
                </div>

                <!-- Error Message -->
                <div v-if="errorMessage" class="alert alert-danger" role="alert">
                    {{ errorMessage }}
                </div>

                <form @submit.prevent="handleUpdateProfile" class="form">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Prénom</label>
                            <input type="text" v-model="profileForm.first_name" class="form-input" placeholder="Votre prénom" />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Nom</label>
                            <input type="text" v-model="profileForm.last_name" class="form-input" placeholder="Votre nom" />
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" v-model="profileForm.email" class="form-input" disabled />
                        <small class="form-text">L'email ne peut pas être modifié.</small>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Téléphone</label>
                            <input type="tel" v-model="profileForm.phone" class="form-input" placeholder="+237..." />
                        </div>
                        <div class="form-group">
                            <label class="form-label">WhatsApp</label>
                            <input type="tel" v-model="profileForm.whatsapp" class="form-input" placeholder="+237..." />
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Adresse</label>
                        <input type="text" v-model="profileForm.address" class="form-input" placeholder="Votre adresse" />
                    </div>

                    <div class="form-group">
                        <label class="form-label">Ville</label>
                        <input type="text" v-model="profileForm.city" class="form-input" placeholder="Votre ville" />
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn-submit" :disabled="loading">
                            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                            {{ loading ? 'Enregistrement...' : 'Enregistrer les modifications' }}
                        </button>

                        <button type="button" @click="handleLogout" class="btn-logout">
                            <i class="bi bi-box-arrow-right"></i>
                            Se déconnecter
                        </button>
                    </div>
                </form>

                <div class="profile-footer">
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
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const config = useRuntimeConfig()

const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// Initialiser le formulaire avec les données de l'utilisateur
const profileForm = ref({
    first_name: authStore.user?.first_name || '',
    last_name: authStore.user?.last_name || '',
    email: authStore.user?.email || '',
    phone: authStore.user?.phone || '',
    whatsapp: authStore.user?.whatsapp || '',
    address: authStore.user?.address || '',
    city: authStore.user?.city || ''
})

// Mettre à jour le formulaire si l'utilisateur change (ex: rechargement)
watch(() => authStore.user, (newUser) => {
    if (newUser) {
        profileForm.value = {
            first_name: newUser.first_name || '',
            last_name: newUser.last_name || '',
            email: newUser.email || '',
            phone: newUser.phone || '',
            whatsapp: newUser.whatsapp || '',
            address: newUser.address || '',
            city: newUser.city || ''
        }
    }
}, { immediate: true })

const handleUpdateProfile = async () => {
    loading.value = true
    successMessage.value = ''
    errorMessage.value = ''

    try {
        const response = await $fetch(`${config.public.apiBase}/accounts/user/`, {
            method: 'PATCH',
            body: profileForm.value,
            headers: {
                'Authorization': `Bearer ${authStore.token}`
            }
        })
        
        // Mettre à jour le store avec les nouvelles données
        // @ts-ignore
        authStore.user = response
        if (process.client) {
            localStorage.setItem('user', JSON.stringify(response))
        }

        successMessage.value = 'Profil mis à jour avec succès !'
    } catch (error: any) {
        console.error('Erreur mise à jour profil:', error)
        errorMessage.value = 'Erreur lors de la mise à jour du profil.'
    } finally {
        loading.value = false
    }
}

const handleLogout = () => {
    authStore.logout()
    navigateTo('/auth')
}

useHead({
    title: 'Mon Profil - MEM\'S',
    meta: [
        {
            name: 'description',
            content: 'Gérez votre profil MEM\'S'
        }
    ]
})
</script>

<style scoped>
.profile-page {
    position: relative;
    min-height: 100vh;
    background: #F5F2EC;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 100px 1rem 2rem;
}

.profile-container {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 600px; /* Plus large que auth pour le confort */
}

.profile-card {
    background: #F5F2EC;
    border-radius: 12px;
    padding: 3rem 2.5rem;
    border: 2px solid rgba(201, 164, 108, 0.3);
    box-shadow: 0 4px 20px rgba(14, 58, 52, 0.15);
}

.profile-header {
    text-align: center;
    margin-bottom: 2rem;
}

.profile-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 1.75rem;
    font-weight: 600;
    color: #0E3A34;
    margin: 0 0 1rem 0;
}

.title-underline {
    width: 80px;
    height: 3px;
    background: #C9A46C;
    border-radius: 2px;
    margin: 0 auto 1rem;
}

.profile-subtitle {
    font-family: 'Montserrat', sans-serif;
    font-size: 0.9375rem;
    color: #2A2A2A;
    margin: 0;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.form-row {
    display: flex;
    gap: 1rem;
}

.form-row .form-group {
    flex: 1;
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

.form-input:disabled {
    background-color: #e9ecef;
    cursor: not-allowed;
    opacity: 0.7;
}

.form-text {
    font-size: 0.75rem;
    color: #6c757d;
}

.form-actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
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

.btn-logout {
    width: 100%;
    padding: 0.875rem;
    background: transparent;
    border: 2px solid #dc3545;
    border-radius: 8px;
    font-family: 'Montserrat', sans-serif;
    font-size: 0.9375rem;
    font-weight: 600;
    color: #dc3545;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.btn-logout:hover {
    background: #dc3545;
    color: white;
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

.profile-footer {
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

@media (max-width: 767px) {
    .profile-card {
        padding: 2rem 1.5rem;
    }

    .form-row {
        flex-direction: column;
        gap: 1.25rem;
    }
}
</style>
