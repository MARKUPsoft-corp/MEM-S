# Guide Visuel - Pages Collections MEM'S

## 📐 Structure Visuelle des Pages

```
┌─────────────────────────────────────────────────────────────┐
│                        NAVBAR (Fixed)                        │
│  Logo MEM'S | Hommes | Femmes | Babouches | Lins | Icons   │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│                      HERO BANNER                             │
│                    (400px height)                            │
│                                                               │
│              [Image de fond avec overlay]                    │
│                                                               │
│                  COLLECTION HOMMES                           │
│            Élégance et tradition africaine                   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│  Accueil / Hommes                    [BREADCRUMB]           │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  ┌──────────────┐  ┌────────────────────────────────────┐  │
│  │              │  │                                     │  │
│  │   FILTERS    │  │        PRODUCTS GRID               │  │
│  │   SIDEBAR    │  │                                     │  │
│  │              │  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐      │  │
│  │ Categories   │  │  │ P1 │ │ P2 │ │ P3 │ │ P4 │      │  │
│  │ □ Boubou     │  │  └────┘ └────┘ └────┘ └────┘      │  │
│  │ □ Gandoura   │  │                                     │  │
│  │ □ Costumes   │  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐      │  │
│  │ □ Chemise    │  │  │ P5 │ │ P6 │ │ P7 │ │ P8 │      │  │
│  │ □ Pantalon   │  │  └────┘ └────┘ └────┘ └────┘      │  │
│  │              │  │                                     │  │
│  │ Prix         │  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐      │  │
│  │ [====|====]  │  │  │ P9 │ │P10 │ │P11 │ │P12 │      │  │
│  │              │  │  └────┘ └────┘ └────┘ └────┘      │  │
│  │ Taille       │  │                                     │  │
│  │ □ S          │  │         [PAGINATION]                │  │
│  │ □ M          │  │                                     │  │
│  │ □ L          │  │                                     │  │
│  │ □ XL         │  │                                     │  │
│  │              │  │                                     │  │
│  └──────────────┘  └────────────────────────────────────┘  │
│   (280px)                    (1fr)                          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                          FOOTER                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 Responsive Behavior

### Desktop (> 1024px)
```
┌────────────────────────────────────────┐
│            HERO (400px)                │
├────────────────────────────────────────┤
│  Breadcrumb                            │
├────────────────────────────────────────┤
│  ┌──────┐  ┌──────────────────────┐  │
│  │Filter│  │    Products Grid     │  │
│  │280px │  │        (1fr)         │  │
│  │Sticky│  │   4-6 columns        │  │
│  └──────┘  └──────────────────────┘  │
└────────────────────────────────────────┘
```

### Tablet (768px - 1024px)
```
┌────────────────────────────────────────┐
│            HERO (350px)                │
├────────────────────────────────────────┤
│  Breadcrumb                            │
├────────────────────────────────────────┤
│  ┌─────┐  ┌───────────────────────┐  │
│  │Filtr│  │   Products Grid       │  │
│  │240px│  │      (1fr)            │  │
│  │     │  │   3-4 columns         │  │
│  └─────┘  └───────────────────────┘  │
└────────────────────────────────────────┘
```

### Mobile (< 768px)
```
┌──────────────────────────┐
│    HERO (300px)          │
├──────────────────────────┤
│  Breadcrumb              │
├──────────────────────────┤
│  ┌────────────────────┐ │
│  │   Filters          │ │
│  │   (Collapsible)    │ │
│  └────────────────────┘ │
│                          │
│  ┌────────────────────┐ │
│  │  Products Grid     │ │
│  │   2 columns        │ │
│  │                    │ │
│  │  ┌────┐  ┌────┐   │ │
│  │  │ P1 │  │ P2 │   │ │
│  │  └────┘  └────┘   │ │
│  │                    │ │
│  │  ┌────┐  ┌────┐   │ │
│  │  │ P3 │  │ P4 │   │ │
│  │  └────┘  └────┘   │ │
│  └────────────────────┘ │
└──────────────────────────┘
```

---

## 🎨 Palette de Couleurs par Zone

### Hero Banner
- **Background:** Image avec overlay
- **Overlay:** `rgba(11, 11, 11, 0.5)` → `rgba(11, 11, 11, 0.7)`
- **Titre:** `#F5F2EC` (Ivoire)
- **Sous-titre:** `#C9A46C` (Or Brossé)

### Breadcrumb
- **Background:** `#F5F2EC` (Ivoire)
- **Texte:** `#2A2A2A` (Gris Anthracite)
- **Actif:** `#0E3A34` (Vert Ébène)
- **Hover:** `#C9A46C` (Or Brossé)
- **Border:** `rgba(201, 164, 108, 0.2)`

### Content Area
- **Background:** `#F5F2EC` (Ivoire)
- **Sidebar:** `#FFFFFF` (Blanc)
- **Main:** `#FFFFFF` (Blanc)

---

## 🔗 Routes et Navigation

### Pages Principales
```
/                    → Page d'accueil (index.vue)
/men                 → Collection Hommes (men.vue)
/women               → Collection Femmes (women.vue)
/babouches           → Collection Babouches (babouches.vue)
/lins                → Collection Lins (lins.vue)
```

### Sous-catégories (À créer)
```
/men/boubou          → Boubous
/men/gandoura        → Gandouras
/men/costumes        → Costumes
/men/chemise         → Chemises
/men/pantalon        → Pantalons
/women/vetements     → Vêtements Femmes
/women/sacs          → Sacs
```

### Navigation depuis Navbar
```
Navbar
  ├─ HOMMES (dropdown)
  │   ├─ Tous les produits → /men
  │   ├─ Boubou → /men/boubou
  │   ├─ Gandoura → /men/gandoura
  │   ├─ Costumes → /men/costumes
  │   ├─ Chemise → /men/chemise
  │   └─ Pantalon → /men/pantalon
  │
  ├─ FEMMES (dropdown)
  │   ├─ Tous les produits → /women
  │   ├─ Vêtements → /women/vetements
  │   └─ Sacs → /women/sacs
  │
  ├─ BABOUCHES → /babouches
  └─ LINS → /lins
```

---

## 🧩 Composants Utilisés

### Structure de Page Type
```vue
<template>
  <div class="page">
    <!-- Hero Banner -->
    <PageHero
      title="Collection Hommes"
      subtitle="Élégance et tradition africaine"
      background-image="..."
    />

    <!-- Breadcrumb -->
    <Breadcrumb :items="[{ label: 'Hommes' }]" />

    <!-- Content -->
    <div class="page-content">
      <div class="container">
        <div class="content-wrapper">
          <!-- Filters Sidebar -->
          <aside class="filters-sidebar">
            <!-- Composants de filtres à venir -->
          </aside>

          <!-- Products Grid -->
          <main class="products-main">
            <!-- Grille de produits à venir -->
          </main>
        </div>
      </div>
    </div>
  </div>
</template>
```

### Composants Réutilisables
1. **PageHero.vue** - Hero banner
2. **Breadcrumb.vue** - Fil d'Ariane
3. **ProductCard.vue** - Carte produit (déjà existant)

### Composants à Créer
1. **FilterCategory.vue** - Filtres par catégorie
2. **FilterPrice.vue** - Filtres par prix
3. **FilterSize.vue** - Filtres par taille
4. **FilterColor.vue** - Filtres par couleur
5. **ProductsGrid.vue** - Grille de produits
6. **ProductsHeader.vue** - En-tête de grille
7. **ProductsPagination.vue** - Pagination

---

## 📊 Grille de Produits

### Desktop (> 1200px)
```
┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐
│ P1 │ │ P2 │ │ P3 │ │ P4 │ │ P5 │ │ P6 │
└────┘ └────┘ └────┘ └────┘ └────┘ └────┘
```
**6 colonnes** - `grid-template-columns: repeat(6, 1fr)`

### Tablet (768px - 1200px)
```
┌────┐ ┌────┐ ┌────┐ ┌────┐
│ P1 │ │ P2 │ │ P3 │ │ P4 │
└────┘ └────┘ └────┘ └────┘
```
**4 colonnes** - `grid-template-columns: repeat(4, 1fr)`

### Mobile (< 768px)
```
┌────┐ ┌────┐
│ P1 │ │ P2 │
└────┘ └────┘
```
**2 colonnes** - `grid-template-columns: repeat(2, 1fr)`

---

## 🎯 Exemple d'Utilisation

### Page Hommes Complète (Futur)
```vue
<template>
  <div class="men-page">
    <PageHero
      title="Collection Hommes"
      subtitle="Élégance et tradition africaine"
      background-image="https://..."
    />

    <Breadcrumb :items="[{ label: 'Hommes' }]" />

    <div class="page-content">
      <div class="container">
        <div class="content-wrapper">
          <aside class="filters-sidebar">
            <FilterCategory :categories="menCategories" />
            <FilterPrice :min="0" :max="100000" />
            <FilterSize :sizes="['S', 'M', 'L', 'XL', 'XXL']" />
            <FilterColor :colors="colors" />
          </aside>

          <main class="products-main">
            <ProductsHeader
              :total="products.length"
              :view="view"
              @change-view="changeView"
            />
            <ProductsGrid
              :products="filteredProducts"
              :loading="loading"
            />
            <ProductsPagination
              :current-page="currentPage"
              :total-pages="totalPages"
              @change-page="changePage"
            />
          </main>
        </div>
      </div>
    </div>
  </div>
</template>
```

---

## ✅ Checklist de Développement

### Phase 1 - Structure (✅ Complété)
- [x] Créer les 4 pages principales
- [x] Créer PageHero.vue
- [x] Créer Breadcrumb.vue
- [x] Documenter la structure

### Phase 2 - Filtres (À faire)
- [ ] Créer FilterCategory.vue
- [ ] Créer FilterPrice.vue
- [ ] Créer FilterSize.vue
- [ ] Créer FilterColor.vue
- [ ] Créer FilterSort.vue

### Phase 3 - Grille (À faire)
- [ ] Créer ProductsGrid.vue
- [ ] Créer ProductsHeader.vue
- [ ] Créer ProductsPagination.vue
- [ ] Créer ProductsEmpty.vue

### Phase 4 - Intégration (À faire)
- [ ] Connecter au store Pinia
- [ ] Fetch produits par catégorie
- [ ] Appliquer les filtres
- [ ] Loading states
- [ ] Error handling

### Phase 5 - Sous-catégories (À faire)
- [ ] Créer /men/boubou
- [ ] Créer /men/gandoura
- [ ] Créer /men/costumes
- [ ] Créer /men/chemise
- [ ] Créer /men/pantalon
- [ ] Créer /women/vetements
- [ ] Créer /women/sacs

---

**Date:** 2025  
**Version:** 1.0  
**Statut:** Phase 1 complétée ✅
