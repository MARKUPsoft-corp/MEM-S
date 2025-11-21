import { z } from 'zod'

/**
 * Schéma de validation pour l'email
 */
export const emailSchema = z
    .string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide')

/**
 * Schéma de validation pour le mot de passe
 * - Minimum 8 caractères
 * - Au moins 1 lettre majuscule
 * - Au moins 1 chiffre
 * - Au moins 1 caractère spécial
 */
export const passwordSchema = z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une lettre majuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
    .regex(/[^A-Za-z0-9]/, 'Le mot de passe doit contenir au moins un caractère spécial')

/**
 * Schéma de validation pour le formulaire de connexion
 */
export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, 'Le mot de passe est requis')
})

/**
 * Schéma de validation pour le formulaire d'inscription
 */
export const registerSchema = z.object({
    name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Veuillez confirmer le mot de passe')
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword']
})

/**
 * Composable pour la validation de formulaires
 */
export const useValidation = () => {
    /**
     * Valider les données de connexion
     */
    const validateLogin = (email: string, password: string) => {
        try {
            loginSchema.parse({ email, password })
            return { success: true, errors: {} }
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors: Record<string, string> = {}
                error.errors.forEach((err) => {
                    if (err.path[0]) {
                        errors[err.path[0] as string] = err.message
                    }
                })
                return { success: false, errors }
            }
            return { success: false, errors: { general: 'Erreur de validation' } }
        }
    }

    /**
     * Valider les données d'inscription
     */
    const validateRegister = (name: string, email: string, password: string, confirmPassword: string) => {
        try {
            registerSchema.parse({ name, email, password, confirmPassword })
            return { success: true, errors: {} }
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors: Record<string, string> = {}
                error.errors.forEach((err) => {
                    if (err.path[0]) {
                        errors[err.path[0] as string] = err.message
                    }
                })
                return { success: false, errors }
            }
            return { success: false, errors: { general: 'Erreur de validation' } }
        }
    }

    /**
     * Valider un email
     */
    const validateEmail = (email: string) => {
        try {
            emailSchema.parse(email)
            return { success: true, error: null }
        } catch (error) {
            if (error instanceof z.ZodError) {
                return { success: false, error: error.errors[0]?.message || 'Email invalide' }
            }
            return { success: false, error: 'Email invalide' }
        }
    }

    /**
     * Valider un mot de passe
     */
    const validatePassword = (password: string) => {
        try {
            passwordSchema.parse(password)
            return { success: true, error: null }
        } catch (error) {
            if (error instanceof z.ZodError) {
                return { success: false, error: error.errors[0]?.message || 'Mot de passe invalide' }
            }
            return { success: false, error: 'Mot de passe invalide' }
        }
    }

    return {
        validateLogin,
        validateRegister,
        validateEmail,
        validatePassword,
        loginSchema,
        registerSchema,
        emailSchema,
        passwordSchema
    }
}
