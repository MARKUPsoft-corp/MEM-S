/**
 * Composable pour l'optimisation et la livraison d'images via Cloudinary
 */
export const useCloudinary = () => {
  const config = useRuntimeConfig()
  const cloudName = config.public?.cloudinaryCloudName || 'dacfzjszd'
  const uploadPreset = config.public?.cloudinaryUploadPreset || 'mems_unsigned'

  /**
   * Génère une URL d'image optimisée via Cloudinary
   * Prend en charge les URLs externes (Unsplash, etc.) via Cloudinary Fetch
   * et les images uploadées directement sur Cloudinary.
   */
  const getOptimizedImageUrl = (
    imageUrl: string,
    options: {
      width?: number
      height?: number
      crop?: string
      quality?: string | number
      format?: string
    } = {}
  ): string => {
    if (!imageUrl) return ''
    if (imageUrl.includes('photo-1514989940745-12a14b18c6e2')) {
      imageUrl = imageUrl.replace('photo-1514989940745-12a14b18c6e2', 'photo-1542291026-7eec264c27ff')
    }

    // Si Cloudinary n'est pas encore configuré dans le .env, retourner l'image originale
    if (!cloudName) {
      // Pour Unsplash, appliquer des paramètres d'optimisation natifs
      if (imageUrl.includes('images.unsplash.com') && options.width) {
        const url = new URL(imageUrl)
        url.searchParams.set('w', String(options.width))
        url.searchParams.set('q', '80')
        url.searchParams.set('auto', 'format')
        return url.toString()
      }
      return imageUrl
    }

    const {
      width = 800,
      height,
      crop = 'limit',
      quality = 'auto',
      format = 'auto'
    } = options

    const transformations: string[] = [
      `f_${format}`,
      `q_${quality}`,
      `c_${crop}`,
      `w_${width}`
    ]

    if (height) {
      transformations.push(`h_${height}`)
    }

    const transformStr = transformations.join(',')

    // Cas 1 : Image hébergée sur Cloudinary (upload direct)
    if (imageUrl.includes('res.cloudinary.com')) {
      return imageUrl.replace('/upload/', `/upload/${transformStr}/`)
    }

    // Cas 2 : Image Unsplash (optimisation native)
    if (imageUrl.includes('images.unsplash.com')) {
      try {
        const url = new URL(imageUrl)
        if (width) url.searchParams.set('w', String(width))
        if (height) url.searchParams.set('h', String(height))
        url.searchParams.set('q', '80')
        url.searchParams.set('auto', 'format')
        return url.toString()
      } catch {
        return imageUrl
      }
    }

    // Cas 3 : Autre URL web absolue
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl
    }

    // Cas 4 : Identifiant Cloudinary relatif (ex: 'MEMS/boubou-1' ou 'sample')
    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformStr}/${imageUrl}`
  }

  /**
   * Upload direct vers Cloudinary (Unsigned Upload)
   */
  const uploadImage = async (file: File | Blob, folder = 'mems-products'): Promise<{ secure_url: string; public_id: string }> => {
    const activeCloudName = cloudName || config.public?.cloudinaryCloudName || 'dacfzjszd'
    const preset = uploadPreset || config.public?.cloudinaryUploadPreset || 'mems_unsigned'

    if (!activeCloudName) {
      throw new Error('Cloud Name Cloudinary non configuré dans .env')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', preset)
    formData.append('folder', folder)

    const response = await fetch(`https://api.cloudinary.com/v1_1/${activeCloudName}/image/upload`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      const rawMsg = err.error?.message || 'Échec du téléversement vers Cloudinary'
      if (rawMsg.includes('Upload preset not found')) {
        throw new Error(`Upload preset "${preset}" introuvable. Veuillez créer un preset nommé "${preset}" en mode "Unsigned" dans votre console Cloudinary (Settings > Upload > Add upload preset).`)
      }
      if (rawMsg.includes('must be whitelisted for unsigned')) {
        throw new Error(`Le preset "${preset}" doit être configuré avec Signing Mode = "Unsigned" dans votre console Cloudinary pour autoriser l'envoi depuis le navigateur.`)
      }
      throw new Error(rawMsg)
    }

    const data = await response.json()
    return {
      secure_url: data.secure_url,
      public_id: data.public_id
    }
  }

  return {
    cloudName,
    getOptimizedImageUrl,
    uploadImage
  }
}
