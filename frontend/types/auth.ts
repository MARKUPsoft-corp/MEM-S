export interface User {
  id: number
  email: string
  phone: string
  whatsapp: string
  address: string
  city: string
  first_name?: string
  last_name?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  password_confirm: string
  phone: string
  whatsapp: string
  address: string
  city: string
  first_name?: string
  last_name?: string
}

export interface AuthResponse {
  access: string
  refresh: string
  user: User
}
