import { defineStore } from 'pinia'
import type { User, LoginCredentials, RegisterData, AuthResponse } from '../types/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    refreshToken: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
  },

  actions: {
    async login(credentials: LoginCredentials) {
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<AuthResponse>(`${config.public.apiBase}/auth/login/`, {
          method: 'POST',
          body: credentials,
        })

        this.token = response.access
        this.refreshToken = response.refresh
        this.user = response.user

        // Sauvegarder dans localStorage
        if (process.client) {
          localStorage.setItem('token', response.access)
          localStorage.setItem('refreshToken', response.refresh)
          localStorage.setItem('user', JSON.stringify(response.user))
        }

        return response
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },

    async register(data: RegisterData) {
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<AuthResponse>(`${config.public.apiBase}/auth/register/`, {
          method: 'POST',
          body: data,
        })

        this.token = response.access
        this.refreshToken = response.refresh
        this.user = response.user

        // Sauvegarder dans localStorage
        if (process.client) {
          localStorage.setItem('token', response.access)
          localStorage.setItem('refreshToken', response.refresh)
          localStorage.setItem('user', JSON.stringify(response.user))
        }

        return response
      } catch (error) {
        console.error('Register error:', error)
        throw error
      }
    },

    async fetchProfile() {
      try {
        const config = useRuntimeConfig()
        const user = await $fetch<User>(`${config.public.apiBase}/auth/profile/`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })

        this.user = user

        if (process.client) {
          localStorage.setItem('user', JSON.stringify(user))
        }

        return user
      } catch (error) {
        console.error('Fetch profile error:', error)
        throw error
      }
    },

    async updateProfile(data: Partial<User>) {
      try {
        const config = useRuntimeConfig()
        const user = await $fetch<User>(`${config.public.apiBase}/auth/profile/`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          body: data,
        })

        this.user = user

        if (process.client) {
          localStorage.setItem('user', JSON.stringify(user))
        }

        return user
      } catch (error) {
        console.error('Update profile error:', error)
        throw error
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.refreshToken = null

      if (process.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
      }
    },

    initFromLocalStorage() {
      if (process.client) {
        const token = localStorage.getItem('token')
        const refreshToken = localStorage.getItem('refreshToken')
        const userStr = localStorage.getItem('user')

        if (token && userStr) {
          this.token = token
          this.refreshToken = refreshToken
          this.user = JSON.parse(userStr)
        }
      }
    },
  },
})
