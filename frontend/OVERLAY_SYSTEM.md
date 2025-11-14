# Système d'Overlay pour Catégories - Page Hommes

## 🎯 Concept

Un système en **2 niveaux** pour afficher les produits:

1. **Aperçu** (Page principale) → 4 produits + bouton "Voir Plus"
2. **Overlay** (Plein écran) → Tous les produits + bouton fermer rond

---

## 📦 Composants Créés

### 1. BoubouPreview.vue
**Emplacement:** `app/components/men/BoubouPreview.vue`

**Rôle:** Afficher un aperçu de 4 produits boubous

**Fonctionnalités:**
- Affiche 4 produits (sur 8 disponibles)
- Titre "Boubous" + compteur
- Bouton "Voir Plus"
- Émet un événement `@view-all` au clic

**Structure:**
```vue
<BoubouPreview @view-all="openBoubouOverlay" />
```

---

### 2. CategoryOverlay.vue
**Emplacement:** `app/components/men/CategoryOverlay.vue`

**Rôle:** Afficher TOUS les produits d'une catégorie en overlay plein écran

**Fonctionnalités:**
- Overlay plein écran (comme SearchOverlay)
- Bouton fermer rond en haut à droite
- Titre + compteur de produits
- Système de tri (Prix, Nom, Nouveautés)
- Grille 6 colonnes (responsive)
- Fermeture avec Escape
- Lock du scroll body

**Props:**
```typescript
interface Props {
  isOpen: boolean      // État ouvert/fermé
  title: string        // Titre (ex: "Boubous")
  products: any[]      // Tous les produits
}
```

**Events:**
```typescript
@close  // Émis quand on ferme l'overlay
```

---

## 🎨 Structure Visuelle

### Page Principale (Aperçu)
```
┌──────────────────────────────────────────────────┐
│  Boubous                          8 produits     │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐            │
│  │  1  │  │  2  │  │  3  │  │  4  │            │
│  │35kF │  │42kF │  │38kF │  │45kF │            │
│  └─────┘  └─────┘  └─────┘  └─────┘            │
│                                                  │
│              [ Voir Plus ]                       │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Overlay (Tous les Produits)
```
┌──────────────────────────────────────────────────┐
│                                          [X]     │ ← Bouton rond
│                                                  │
│  Boubous                          8 produits    │
│                                                  │
│                            [Trier par ▼]        │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐          │
│  │ 1 │ │ 2 │ │ 3 │ │ 4 │ │ 5 │ │ 6 │          │
│  └───┘ └───┘ └───┘ └───┘ └───┘ └───┘          │
│                                                  │
│  ┌───┐ ┌───┐                                    │
│  │ 7 │ │ 8 │                                    │
│  └───┘ └───┘                                    │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## 🔄 Flux Utilisateur

### 1. État Initial
```
Page Hommes
  └─ Aperçu Boubous (4 produits)
     └─ Bouton "Voir Plus"
```

### 2. Clic "Voir Plus"
```
Overlay s'ouvre
  ├─ Fond blanc plein écran
  ├─ Bouton fermer (X) en haut à droite
  ├─ Titre "Boubous" + 8 produits
  ├─ Dropdown tri
  └─ Grille 6 colonnes avec TOUS les produits
```

### 3. Fermeture
```
Clic sur [X] ou Escape
  └─ Overlay se ferme
     └─ Retour à la page hommes
```

---

## 💻 Code d'Intégration

### Dans men.vue

```vue
<template>
  <div class="men-page">
    <!-- Hero + Breadcrumb -->
    
    <main class="products-main">
      <!-- Aperçu Boubous -->
      <BoubouPreview @view-all="openBoubouOverlay" />
      
      <!-- Autres catégories -->
      <!-- <GandouraPreview @view-all="openGandouraOverlay" /> -->
    </main>

    <!-- Overlay -->
    <CategoryOverlay
      :is-open="overlayOpen"
      :title="overlayTitle"
      :products="overlayProducts"
      @close="closeOverlay"
    />
  </div>
</template>

<script setup>
import BoubouPreview from '../components/men/BoubouPreview.vue'
import CategoryOverlay from '../components/men/CategoryOverlay.vue'

const overlayOpen = ref(false)
const overlayTitle = ref('')
const overlayProducts = ref([])

const boubouProducts = [ /* 8 produits */ ]

function openBoubouOverlay() {
  overlayTitle.value = 'Boubous'
  overlayProducts.value = boubouProducts
  overlayOpen.value = true
}

function closeOverlay() {
  overlayOpen.value = false
}
</script>
```

---

## 🎨 Style du Bouton Fermer

### CSS
```css
.overlay-close {
  position: fixed;
  top: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  background: #0E3A34;        /* Vert Ébène */
  border: none;
  border-radius: 50%;         /* Rond */
  color: #F5F2EC;             /* Ivoire */
  font-size: 2rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(14, 58, 52, 0.3);
  z-index: 2001;
}

.overlay-close:hover {
  background: #C9A46C;        /* Or Brossé */
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(14, 58, 52, 0.4);
}
```

---

## 📱 Responsive

### Aperçu (BoubouPreview)
| Écran | Colonnes |
|-------|----------|
| Desktop | 4 |
| Tablet | 3 |
| Mobile | 2 |

### Overlay (CategoryOverlay)
| Écran | Colonnes |
|-------|----------|
| Large Desktop (> 1400px) | 6 |
| Desktop (1024-1400px) | 4 |
| Tablet (768-1024px) | 3 |
| Mobile (< 768px) | 2 |

---

## 🚀 Prochaines Étapes

### 1. Créer les Autres Aperçus
```
- [ ] GandouraPreview.vue
- [ ] CostumesPreview.vue
- [ ] ChemisePreview.vue
- [ ] PantalonPreview.vue
```

### 2. Ajouter dans men.vue
```vue
<BoubouPreview @view-all="openBoubouOverlay" />
<GandouraPreview @view-all="openGandouraOverlay" />
<CostumesPreview @view-all="openCostumesOverlay" />
<ChemisePreview @view-all="openChemiseOverlay" />
<PantalonPreview @view-all="openPantalonOverlay" />
```

### 3. Créer les Fonctions d'Ouverture
```javascript
function openGandouraOverlay() {
  overlayTitle.value = 'Gandouras'
  overlayProducts.value = gandouraProducts
  overlayOpen.value = true
}

// Etc. pour chaque catégorie
```

---

## ✨ Fonctionnalités Avancées

### Lock Scroll Body
```javascript
watch(() => props.isOpen, (isOpen) => {
  if (import.meta.client) {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  }
})
```

### Fermeture Escape
```javascript
function handleEscapeKey(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.isOpen) {
    emit('close')
  }
}
```

### Tri Dynamique
```javascript
const sortedProducts = computed(() => {
  const sorted = [...props.products]
  
  switch (sortBy.value) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'newest':
      return sorted.reverse()
    default:
      return sorted
  }
})
```

---

## 🎯 Avantages du Système

### 1. UX
- ✅ Aperçu rapide (4 produits)
- ✅ Détails complets (overlay)
- ✅ Navigation fluide
- ✅ Pas de changement de page

### 2. Performance
- ✅ Charge seulement 4 produits initialement
- ✅ Overlay chargé à la demande
- ✅ Scroll optimisé

### 3. Design
- ✅ Interface épurée
- ✅ Overlay immersif
- ✅ Bouton fermer intuitif
- ✅ Cohérent avec SearchOverlay

### 4. Technique
- ✅ Composants réutilisables
- ✅ Props/Events clairs
- ✅ Facile à étendre
- ✅ Maintenable

---

## 📋 Checklist

### ✅ Complété
- [x] BoubouPreview.vue créé
- [x] CategoryOverlay.vue créé
- [x] Intégration dans men.vue
- [x] Bouton fermer rond
- [x] Système de tri
- [x] Lock scroll body
- [x] Fermeture Escape
- [x] Responsive complet

### ⏳ À Faire
- [ ] Créer GandouraPreview
- [ ] Créer CostumesPreview
- [ ] Créer ChemisePreview
- [ ] Créer PantalonPreview
- [ ] Intégrer API
- [ ] Tests E2E

---

## 🎉 Résultat

Le système d'overlay est maintenant opérationnel:
- ✅ **Aperçu** avec 4 produits
- ✅ **Overlay** plein écran avec tous les produits
- ✅ **Bouton fermer** rond en haut à droite
- ✅ **Tri** fonctionnel
- ✅ **Responsive** sur tous les devices

**Testez en visitant `/men` et en cliquant sur "Voir Plus"!** 🚀

---

**Date:** 2025  
**Version:** 1.0  
**Statut:** ✅ Système opérationnel
