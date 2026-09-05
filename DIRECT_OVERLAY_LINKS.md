# Liens Directs vers les Overlays de Catégories

## 📋 Fonctionnalité

Le système permet maintenant d'ouvrir directement l'overlay d'une catégorie spécifique via l'URL. Cela permet de créer des liens directs depuis:
- La navbar
- La page d'accueil
- Les sections de la page d'accueil
- N'importe quelle page du site

---

## 🔗 Format des URLs

### Structure Générale
```
/[page]?category=[nom-categorie]
```

---

## 📝 Liste Complète des Liens

### Page Hommes (/men)

#### Boubous
```
/men?category=boubous
```
**Utilisation dans un composant:**
```vue
<NuxtLink to="/men?category=boubous">Voir les Boubous</NuxtLink>
```

#### Gandouras
```
/men?category=gandouras
```
**Utilisation:**
```vue
<NuxtLink to="/men?category=gandouras">Voir les Gandouras</NuxtLink>
```

#### Costumes
```
/men?category=costumes
```
**Utilisation:**
```vue
<NuxtLink to="/men?category=costumes">Voir les Costumes</NuxtLink>
```

#### Chemises
```
/men?category=chemises
```
**Utilisation:**
```vue
<NuxtLink to="/men?category=chemises">Voir les Chemises</NuxtLink>
```

#### Pantalons
```
/men?category=pantalons
```
**Utilisation:**
```vue
<NuxtLink to="/men?category=pantalons">Voir les Pantalons</NuxtLink>
```

---

### Page Femmes (/women)

#### Robes
```
/women?category=robes
```
**Utilisation:**
```vue
<NuxtLink to="/women?category=robes">Voir les Robes</NuxtLink>
```

#### Ensembles
```
/women?category=ensembles
```
**Utilisation:**
```vue
<NuxtLink to="/women?category=ensembles">Voir les Ensembles</NuxtLink>
```

#### Sacs & Accessoires
```
/women?category=sacs
```
**Utilisation:**
```vue
<NuxtLink to="/women?category=sacs">Voir les Sacs</NuxtLink>
```

---

### Page Babouches (/babouches)

#### Cuir
```
/babouches?category=cuir
```
**Utilisation:**
```vue
<NuxtLink to="/babouches?category=cuir">Voir Babouches en Cuir</NuxtLink>
```

#### Brodées
```
/babouches?category=brodes
```
**Utilisation:**
```vue
<NuxtLink to="/babouches?category=brodes">Voir Babouches Brodées</NuxtLink>
```

---

### Page Lins (/lins)

#### Chemises
```
/lins?category=chemises
```
**Utilisation:**
```vue
<NuxtLink to="/lins?category=chemises">Voir Chemises en Lin</NuxtLink>
```

#### Pantalons
```
/lins?category=pantalons
```
**Utilisation:**
```vue
<NuxtLink to="/lins?category=pantalons">Voir Pantalons en Lin</NuxtLink>
```

---

## 💡 Exemples d'Utilisation

### 1. Dans la Navbar (Dropdown Menu)

```vue
<template>
  <div class="dropdown">
    <button>Hommes</button>
    <div class="dropdown-menu">
      <NuxtLink to="/men?category=boubous">Boubous</NuxtLink>
      <NuxtLink to="/men?category=gandouras">Gandouras</NuxtLink>
      <NuxtLink to="/men?category=costumes">Costumes</NuxtLink>
      <NuxtLink to="/men?category=chemises">Chemises</NuxtLink>
      <NuxtLink to="/men?category=pantalons">Pantalons</NuxtLink>
    </div>
  </div>
</template>
```

### 2. Dans MensCollectionSection (Page d'accueil)

```vue
<template>
  <section class="mens-collection-section">
    <h2>Collection Hommes</h2>
    
    <!-- Tabs avec liens directs -->
    <div class="subcategory-tabs">
      <NuxtLink 
        to="/men?category=boubous" 
        class="subcategory-tab"
      >
        Boubou
      </NuxtLink>
      <NuxtLink 
        to="/men?category=gandouras" 
        class="subcategory-tab"
      >
        Gandoura
      </NuxtLink>
      <!-- etc. -->
    </div>
    
    <!-- Ou bouton "Voir la collection complète" -->
    <NuxtLink 
      to="/men?category=boubous" 
      class="btn-view-all"
    >
      Voir la collection complète
    </NuxtLink>
  </section>
</template>
```

### 3. Dans CategoriesSection (Page d'accueil)

```vue
<template>
  <div class="categories-grid">
    <NuxtLink 
      to="/men?category=boubous" 
      class="category-card"
    >
      <img src="..." alt="Boubous">
      <h3>Boubous</h3>
    </NuxtLink>
    
    <NuxtLink 
      to="/women?category=robes" 
      class="category-card"
    >
      <img src="..." alt="Robes">
      <h3>Robes Africaines</h3>
    </NuxtLink>
    
    <NuxtLink 
      to="/babouches?category=cuir" 
      class="category-card"
    >
      <img src="..." alt="Babouches">
      <h3>Babouches en Cuir</h3>
    </NuxtLink>
  </div>
</template>
```

### 4. Liens Programmatiques (JavaScript)

```typescript
// Navigation avec le router
const router = useRouter()

function goToCategory(page: string, category: string) {
  router.push({
    path: `/${page}`,
    query: { category }
  })
}

// Exemple d'utilisation
goToCategory('men', 'boubous')  // Ouvre /men?category=boubous
goToCategory('women', 'robes')  // Ouvre /women?category=robes
```

### 5. Boutons avec Actions

```vue
<template>
  <button @click="viewBoubous">
    Découvrir les Boubous
  </button>
</template>

<script setup>
const router = useRouter()

function viewBoubous() {
  router.push('/men?category=boubous')
}
</script>
```

---

## 🎯 Comportement

### Quand un utilisateur clique sur un lien avec `?category=...`:

1. **Navigation** vers la page concernée
2. **Détection** du paramètre `category` dans l'URL
3. **Ouverture automatique** de l'overlay correspondant
4. **Affichage** de tous les produits de la catégorie
5. **Système de tri** disponible immédiatement

### Fonctionnalités de l'Overlay:

- ✅ Affichage de tous les produits de la catégorie
- ✅ Tri par prix (croissant/décroissant)
- ✅ Tri par nom (A-Z)
- ✅ Tri par nouveautés
- ✅ Fermeture par bouton X
- ✅ Fermeture par touche Escape
- ✅ Grid responsive (6/4/3/2 colonnes)
- ✅ Scroll verrouillé sur la page principale

---

## 🔄 Gestion des Changements d'URL

Le système utilise `watch` pour détecter les changements de paramètres:

```typescript
// Si l'utilisateur change l'URL manuellement
watch(() => route.query.category, () => {
  openOverlayFromUrl()
})
```

Cela signifie que:
- Changer l'URL manuellement ouvre l'overlay
- Utiliser les boutons précédent/suivant du navigateur fonctionne
- Les liens partagés fonctionnent correctement

---

## 📊 Tableau Récapitulatif

| Page | Catégorie | URL | Produits |
|------|-----------|-----|----------|
| **Hommes** | Boubous | `/men?category=boubous` | 8 |
| **Hommes** | Gandouras | `/men?category=gandouras` | 6 |
| **Hommes** | Costumes | `/men?category=costumes` | 6 |
| **Hommes** | Chemises | `/men?category=chemises` | 6 |
| **Hommes** | Pantalons | `/men?category=pantalons` | 6 |
| **Femmes** | Robes | `/women?category=robes` | 6 |
| **Femmes** | Ensembles | `/women?category=ensembles` | 6 |
| **Femmes** | Sacs | `/women?category=sacs` | 6 |
| **Babouches** | Cuir | `/babouches?category=cuir` | 6 |
| **Babouches** | Brodées | `/babouches?category=brodes` | 6 |
| **Lins** | Chemises | `/lins?category=chemises` | 6 |
| **Lins** | Pantalons | `/lins?category=pantalons` | 6 |

---

## 🚀 Avantages

### Pour les Utilisateurs:
- ✅ Accès direct aux catégories depuis n'importe où
- ✅ Liens partageables (copier-coller l'URL)
- ✅ Bookmarks fonctionnels
- ✅ Navigation intuitive

### Pour le SEO:
- ✅ URLs descriptives
- ✅ Liens internes structurés
- ✅ Meilleure indexation des catégories

### Pour le Développement:
- ✅ Code réutilisable
- ✅ Facile à maintenir
- ✅ Extensible pour nouvelles catégories

---

## 🛠️ Implémentation Technique

### Code dans chaque page:

```typescript
// 1. Import du router
const route = useRoute()

// 2. Fonction pour ouvrir l'overlay depuis l'URL
function openOverlayFromUrl() {
  const category = route.query.category as string
  if (category) {
    switch (category) {
      case 'boubous':
        openBoubouOverlay()
        break
      // ... autres cas
    }
  }
}

// 3. Appel au montage du composant
onMounted(() => {
  openOverlayFromUrl()
})

// 4. Watch pour les changements d'URL
watch(() => route.query.category, () => {
  openOverlayFromUrl()
})
```

---

## 📝 Notes Importantes

1. **Paramètre obligatoire**: Le paramètre `category` doit correspondre exactement aux valeurs définies dans le switch
2. **Case-sensitive**: Les noms de catégories sont sensibles à la casse
3. **Valeurs valides uniquement**: Si le paramètre ne correspond à aucune catégorie, rien ne se passe
4. **Compatible avec le scroll**: Le système de scroll vers les sections fonctionne toujours normalement

---

## 🎨 Exemple Complet pour la Page d'Accueil

```vue
<template>
  <section class="categories-section">
    <h2>Nos Collections</h2>
    
    <div class="categories-grid">
      <!-- Hommes -->
      <div class="category-group">
        <h3>Collection Hommes</h3>
        <NuxtLink to="/men?category=boubous">Boubous</NuxtLink>
        <NuxtLink to="/men?category=gandouras">Gandouras</NuxtLink>
        <NuxtLink to="/men?category=costumes">Costumes</NuxtLink>
        <NuxtLink to="/men?category=chemises">Chemises</NuxtLink>
        <NuxtLink to="/men?category=pantalons">Pantalons</NuxtLink>
      </div>
      
      <!-- Femmes -->
      <div class="category-group">
        <h3>Collection Femmes</h3>
        <NuxtLink to="/women?category=robes">Robes Africaines</NuxtLink>
        <NuxtLink to="/women?category=ensembles">Ensembles</NuxtLink>
        <NuxtLink to="/women?category=sacs">Sacs & Accessoires</NuxtLink>
      </div>
      
      <!-- Babouches -->
      <div class="category-group">
        <h3>Collection Babouches</h3>
        <NuxtLink to="/babouches?category=cuir">Babouches en Cuir</NuxtLink>
        <NuxtLink to="/babouches?category=brodes">Babouches Brodées</NuxtLink>
      </div>
      
      <!-- Lins -->
      <div class="category-group">
        <h3>Collection Lins</h3>
        <NuxtLink to="/lins?category=chemises">Chemises en Lin</NuxtLink>
        <NuxtLink to="/lins?category=pantalons">Pantalons en Lin</NuxtLink>
      </div>
    </div>
  </section>
</template>
```

---

**Date de création:** Novembre 2025  
**Statut:** ✅ ACTIF  
**Pages concernées:** Hommes, Femmes, Babouches, Lins
