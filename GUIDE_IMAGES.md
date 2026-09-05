# Guide des Images - MEM'S

## 🖼️ Images de la Hero Section

### Images Actuelles (Temporaires)

J'ai configuré le carousel avec des images de placeholder d'Unsplash. Ces images sont temporaires et doivent être remplacées par tes vraies photos de produits.

**Images actuelles:**
1. **Slide 1 - ALKEBU-LAN** : Mannequin mode (fond neutre)
2. **Slide 2 - COLLECTION PRINTEMPS** : Mannequin mode (style élégant)
3. **Slide 3 - NOUVEAUTÉS** : Mannequin mode (look moderne)

---

## 📸 Comment Ajouter Tes Propres Images

### Option 1 : Images Locales (Recommandé)

**Étape 1 : Préparer tes images**

Spécifications recommandées :
- **Format** : JPG ou WebP
- **Dimensions** : 1920x1080px (ratio 16:9)
- **Poids** : < 500KB (optimisé pour le web)
- **Qualité** : 80-85%

**Étape 2 : Placer les images**

```bash
# Créer le dossier si nécessaire
mkdir -p frontend/public/images/hero

# Copier tes images
cp ton-image-1.jpg frontend/public/images/hero/slide-1.jpg
cp ton-image-2.jpg frontend/public/images/hero/slide-2.jpg
cp ton-image-3.jpg frontend/public/images/hero/slide-3.jpg
```

**Étape 3 : Mettre à jour le code**

Dans `frontend/app/components/HeroSection.vue`, remplace les URLs Unsplash par :

```typescript
const slides = ref<Slide[]>([
    {
        id: 1,
        title: 'ALKEBU-LAN',
        price: '2100 FCFA',
        image: '/images/hero/slide-1.jpg',  // ← Image locale
        link: '/products'
    },
    {
        id: 2,
        title: 'COLLECTION PRINTEMPS',
        price: '1500 FCFA',
        image: '/images/hero/slide-2.jpg',  // ← Image locale
        link: '/products'
    },
    {
        id: 3,
        title: 'NOUVEAUTÉS',
        price: '1800 FCFA',
        image: '/images/hero/slide-3.jpg',  // ← Image locale
        link: '/products'
    }
])
```

---

### Option 2 : Images Hébergées (CDN)

Si tu héberges tes images sur un service externe (Cloudinary, AWS S3, etc.) :

```typescript
const slides = ref<Slide[]>([
    {
        id: 1,
        title: 'ALKEBU-LAN',
        price: '2100 FCFA',
        image: 'https://ton-cdn.com/images/hero-1.jpg',
        link: '/products'
    },
    // ...
])
```

---

## 🎨 Conseils pour les Photos

### Style Photographique

**Pour correspondre à ta charte graphique :**

1. **Fond** : Neutre (beige, bois, texture naturelle)
2. **Éclairage** : Naturel et doux
3. **Composition** : Mannequin centré ou légèrement décalé
4. **Couleurs** : Tons chauds qui s'harmonisent avec ta palette

### Exemples de Compositions

**Slide 1 - ALKEBU-LAN (Image de référence fournie)**
- 2 mannequins côte à côte
- Fond bois texturé
- Vêtements traditionnels africains
- Éclairage naturel

**Slide 2 - COLLECTION PRINTEMPS**
- 1 mannequin en pied
- Fond uni (ivoire ou beige)
- Vêtements légers et colorés
- Pose dynamique

**Slide 3 - NOUVEAUTÉS**
- 1-2 mannequins
- Fond urbain ou naturel
- Vêtements tendance
- Mise en scène moderne

---

## 🛠️ Outils d'Optimisation

### Compression d'Images

**En ligne (gratuit) :**
- [TinyPNG](https://tinypng.com/) - Compression intelligente
- [Squoosh](https://squoosh.app/) - Outil Google
- [Compressor.io](https://compressor.io/) - Compression rapide

**En ligne de commande :**
```bash
# Installer ImageMagick
sudo apt install imagemagick  # Linux
brew install imagemagick      # macOS

# Optimiser une image
convert input.jpg -quality 85 -resize 1920x1080^ -gravity center -extent 1920x1080 output.jpg
```

### Conversion WebP

WebP offre une meilleure compression que JPG :

```bash
# Installer cwebp
sudo apt install webp  # Linux
brew install webp      # macOS

# Convertir en WebP
cwebp -q 85 input.jpg -o output.webp
```

Puis utiliser avec fallback :
```typescript
image: '/images/hero/slide-1.webp',
```

---

## 📐 Dimensions Recommandées

### Hero Section
- **Desktop** : 1920x1080px (Full HD)
- **Tablet** : 1280x720px
- **Mobile** : 768x1024px (portrait)

### Cartes Produits (futur)
- **Principale** : 800x1000px (ratio 4:5)
- **Miniature** : 400x500px
- **Galerie** : 1200x1500px

### Catégories (futur)
- **Bannière** : 1200x400px (ratio 3:1)
- **Vignette** : 400x400px (carré)

---

## 🌐 Sources d'Images Gratuites

Si tu as besoin d'images temporaires de qualité :

### Mode Africaine
- [Unsplash](https://unsplash.com/s/photos/african-fashion) - Photos haute qualité
- [Pexels](https://www.pexels.com/search/african-clothing/) - Gratuit pour usage commercial
- [Pixabay](https://pixabay.com/images/search/african%20fashion/) - Domaine public

### Recherches Suggérées
- "african fashion model"
- "traditional african clothing"
- "african textile"
- "ankara fashion"
- "african print dress"

---

## ✅ Checklist Avant Publication

Avant de mettre ton site en ligne, vérifie :

- [ ] Toutes les images sont optimisées (< 500KB)
- [ ] Les images ont les bonnes dimensions (1920x1080px)
- [ ] Les images sont au format JPG ou WebP
- [ ] Les noms de fichiers sont descriptifs (pas de espaces)
- [ ] Les images sont placées dans `/public/images/hero/`
- [ ] Le code référence les bonnes URLs
- [ ] Les images s'affichent correctement sur mobile
- [ ] Les temps de chargement sont acceptables (< 3s)

---

## 🚀 Performance

### Lazy Loading (futur)

Pour améliorer les performances, tu peux précharger seulement la première image :

```typescript
// Précharger la première image
onMounted(() => {
    if (import.meta.client) {
        const img = new Image()
        img.src = slides.value[0].image
    }
})
```

### Responsive Images

Utiliser différentes tailles selon l'écran :

```typescript
const slides = ref<Slide[]>([
    {
        id: 1,
        title: 'ALKEBU-LAN',
        price: '2100 FCFA',
        image: '/images/hero/slide-1-desktop.jpg',
        imageMobile: '/images/hero/slide-1-mobile.jpg',
        link: '/products'
    }
])
```

---

## 📞 Support

Si tu as besoin d'aide pour :
- Optimiser tes images
- Choisir les bonnes dimensions
- Configurer un CDN
- Améliorer les performances

N'hésite pas à demander !

---

**Dernière mise à jour :** 2025  
**Version :** 1.0
