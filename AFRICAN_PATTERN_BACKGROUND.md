# AfricanPatternBackground - Composant Réutilisable

## 📖 Description

Composant Vue réutilisable qui ajoute des motifs africains en arrière-plan de vos sections. Les motifs sont inspirés des textiles traditionnels africains (mudcloth, kente) avec des chevrons, lignes diagonales et points décoratifs.

## 🎨 Caractéristiques

- **Motifs SVG** : Patterns vectoriels pour une qualité parfaite sur tous les écrans
- **3 couleurs disponibles** : Or Brossé, Vert Ébène, Terracotta
- **3 niveaux d'opacité** : Light, Medium, Strong
- **Performance optimale** : SVG encodé en CSS, pas de fichiers externes
- **Responsive** : S'adapte automatiquement à la taille de la section

## 📦 Installation

Le composant est déjà créé dans `frontend/app/components/AfricanPatternBackground.vue`

## 🚀 Utilisation

### Utilisation de base

```vue
<template>
    <section class="my-section">
        <AfricanPatternBackground />
        <div class="content">
            <!-- Votre contenu ici -->
        </div>
    </section>
</template>

<style scoped>
.my-section {
    position: relative;
    overflow: hidden;
    background: #F5F2EC; /* Fond de base */
}

.content {
    position: relative;
    z-index: 2; /* Au-dessus du pattern */
}
</style>
```

### Avec options personnalisées

```vue
<template>
    <section class="my-section">
        <!-- Motif or avec opacité moyenne (défaut) -->
        <AfricanPatternBackground opacity="medium" color="gold" />
        
        <div class="content">
            <!-- Votre contenu -->
        </div>
    </section>
</template>
```

## ⚙️ Props

### `opacity`
Contrôle l'intensité du motif

- **Type** : `'light' | 'medium' | 'strong'`
- **Défaut** : `'medium'`
- **Valeurs** :
  - `light` : Motif très subtil (opacity: 0.5)
  - `medium` : Motif équilibré (opacity: 1)
  - `strong` : Motif prononcé (opacity: 1.5)

### `color`
Couleur du motif selon la charte graphique MEM'S

- **Type** : `'gold' | 'green' | 'terracotta'`
- **Défaut** : `'gold'`
- **Valeurs** :
  - `gold` : Or Brossé (#C9A46C) - Élégant et luxueux
  - `green` : Vert Ébène (#0E3A34) - Culturel et profond
  - `terracotta` : Terracotta (#A14E36) - Chaleureux et terreux

## 📋 Exemples d'Utilisation

### Exemple 1 : Section avec motif or subtil

```vue
<template>
    <section class="categories-section">
        <AfricanPatternBackground opacity="light" color="gold" />
        <div class="container">
            <h2>Nos Collections</h2>
            <!-- Contenu -->
        </div>
    </section>
</template>

<style scoped>
.categories-section {
    position: relative;
    overflow: hidden;
    background: #F5F2EC;
    padding: 3rem 0;
}

.container {
    position: relative;
    z-index: 2;
}
</style>
```

### Exemple 2 : Section avec motif vert prononcé

```vue
<template>
    <section class="mens-collection">
        <AfricanPatternBackground opacity="strong" color="green" />
        <div class="container">
            <h2>Collection Hommes</h2>
            <!-- Contenu -->
        </div>
    </section>
</template>

<style scoped>
.mens-collection {
    position: relative;
    overflow: hidden;
    background: #F5F2EC;
    padding: 3rem 0;
}

.container {
    position: relative;
    z-index: 2;
}
</style>
```

### Exemple 3 : Section avec motif terracotta

```vue
<template>
    <section class="promo-section">
        <AfricanPatternBackground opacity="medium" color="terracotta" />
        <div class="container">
            <h2>Promotions</h2>
            <!-- Contenu -->
        </div>
    </section>
</template>

<style scoped>
.promo-section {
    position: relative;
    overflow: hidden;
    background: #F5F2EC;
    padding: 3rem 0;
}

.container {
    position: relative;
    z-index: 2;
}
</style>
```

## 🎯 Bonnes Pratiques

### 1. Structure de la section parente

La section qui contient le composant doit avoir :
- `position: relative` - Pour que le pattern soit positionné correctement
- `overflow: hidden` - Pour éviter que le pattern déborde
- Un fond de base (ex: `background: #F5F2EC`)

```css
.my-section {
    position: relative;
    overflow: hidden;
    background: #F5F2EC;
}
```

### 2. Z-index du contenu

Le contenu de votre section doit avoir un `z-index` supérieur au pattern :

```css
.content {
    position: relative;
    z-index: 2;
}
```

### 3. Choix de la couleur

- **Or Brossé (`gold`)** : Pour les sections principales, élégantes
- **Vert Ébène (`green`)** : Pour les sections culturelles, authentiques
- **Terracotta (`terracotta`)** : Pour les sections promotionnelles, chaleureuses

### 4. Choix de l'opacité

- **Light** : Quand vous avez beaucoup de contenu texte
- **Medium** : Pour un équilibre parfait (recommandé)
- **Strong** : Pour les sections avec peu de texte ou images dominantes

## 🔧 Personnalisation Avancée

Si vous souhaitez modifier les motifs eux-mêmes, éditez le fichier :
`frontend/app/components/AfricanPatternBackground.vue`

Les motifs sont définis en SVG dans les classes CSS :
- `.color-gold` : Motif or
- `.color-green` : Motif vert
- `.color-terracotta` : Motif terracotta

## 📱 Responsive

Le composant est automatiquement responsive et s'adapte à toutes les tailles d'écran sans configuration supplémentaire.

## ⚡ Performance

- **Léger** : SVG encodé en CSS, pas de requête HTTP
- **Rapide** : Rendu natif par le navigateur
- **Optimisé** : Pas d'impact sur les performances

## 🎨 Sections Recommandées

Utilisez ce composant dans :
- ✅ CategoriesSection
- ✅ MensCollectionSection
- ✅ WomensCollectionSection
- ✅ BabouchesSection
- ✅ LinsCollectionSection
- ✅ FeaturedProductsSection
- ✅ AboutSection
- ✅ Toute section avec fond clair

## 🚫 À Éviter

- ❌ Sur des sections avec fond sombre (le motif ne sera pas visible)
- ❌ Sur des sections avec beaucoup d'images (peut créer de la confusion visuelle)
- ❌ Superposer plusieurs instances du composant

## 📝 Notes

- Le composant utilise `position: absolute` et se place automatiquement en arrière-plan
- Le `z-index: 0` garantit qu'il reste derrière le contenu
- Le `pointer-events: none` permet de cliquer à travers le pattern

---

**Dernière mise à jour** : 2025  
**Version** : 1.0  
**Auteur** : MARKUPsoft Corp
