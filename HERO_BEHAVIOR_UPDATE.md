# Mise à Jour - Comportement du Hero Banner

## 🎯 Objectif

Faire en sorte que le **PageHero** des pages de collections se comporte exactement comme le **HeroSection** de la page d'accueil:
- S'étendre derrière la navbar transparente
- Occuper toute la hauteur de l'écran (100vh)
- Navbar transparente en haut de page, opaque au scroll

---

## 🔍 Analyse du Comportement Original

### HeroSection (Page d'Accueil)
```css
.hero-section {
  height: 100vh;           /* Pleine hauteur d'écran */
  /* Pas de margin-top */  /* S'étend derrière la navbar */
}
```

### Navbar
```css
.navbar {
  position: fixed;
  background: transparent;  /* Transparent par défaut */
}

.navbar--scrolled {
  background: #F5F2EC;     /* Opaque au scroll */
}
```

**Logique JavaScript:**
```javascript
function handleScroll() {
  if (isHomePage.value) {
    isScrolled.value = window.scrollY > 50  // Transparent → Opaque
  } else {
    isScrolled.value = true                 // Toujours opaque
  }
}
```

---

## ✅ Modifications Effectuées

### 1. PageHero.vue (Composant)

**Avant:**
```css
.page-hero {
  height: 400px;
  margin-top: 90px;  /* Décalage pour la navbar */
}
```

**Après:**
```css
.page-hero {
  height: 100vh;     /* Pleine hauteur comme HeroSection */
  /* Pas de margin-top - s'étend derrière la navbar */
}
```

### 2. Pages de Collections (4 pages)

Modifications identiques appliquées à:
- ✅ `men.vue`
- ✅ `women.vue`
- ✅ `babouches.vue`
- ✅ `lins.vue`

**Changements:**
1. `height: 400px` → `height: 100vh`
2. Suppression de `margin-top: 90px`
3. Suppression des hauteurs responsive (350px, 300px)

---

## 📱 Comportement Responsive

### Desktop & Tablet
```css
.page-hero {
  height: 100vh;  /* Toujours pleine hauteur */
}
```

### Mobile
```css
.page-hero {
  height: 100vh;  /* Toujours pleine hauteur */
}
```

**Note:** La hauteur reste à `100vh` sur tous les devices, comme le HeroSection.

---

## 🎨 Résultat Visuel

### Avant
```
┌─────────────────────────────────┐
│     NAVBAR (Opaque)             │ ← Toujours visible
├─────────────────────────────────┤
│                                 │
│     HERO (400px)                │ ← Commence sous la navbar
│                                 │
└─────────────────────────────────┘
```

### Après
```
┌─────────────────────────────────┐
│                                 │
│     HERO (100vh)                │ ← S'étend derrière
│                                 │
│  ┌───────────────────────────┐ │
│  │ NAVBAR (Transparent)      │ │ ← Flotte au-dessus
│  └───────────────────────────┘ │
│                                 │
│                                 │
└─────────────────────────────────┘

[Scroll vers le bas]
        ↓

┌─────────────────────────────────┐
│  ┌───────────────────────────┐ │
│  │ NAVBAR (Opaque)           │ │ ← Devient opaque
│  └───────────────────────────┘ │
├─────────────────────────────────┤
│     BREADCRUMB                  │
├─────────────────────────────────┤
│     CONTENT                     │
└─────────────────────────────────┘
```

---

## 🔄 Comportement de la Navbar

### Sur les Pages de Collections

**En haut de page (scrollY = 0):**
- Navbar: **Transparente** (comme sur la page d'accueil)
- Hero: **Visible derrière** la navbar
- Texte navbar: **Ivoire** (#F5F2EC)

**Après scroll (scrollY > 50):**
- Navbar: **Opaque** (#F5F2EC)
- Bordure: **Visible** (rgba(201, 164, 108, 0.2))
- Texte navbar: **Noir Profond** (#0B0B0B)

### Logique Actuelle

La navbar détecte si on est sur la page d'accueil:
```javascript
const isHomePage = computed(() => route.path === '/')
```

**Problème:** Les pages de collections ne sont pas détectées comme "hero pages".

---

## ⚠️ Ajustement Nécessaire

Pour que la navbar soit transparente sur les pages de collections, il faut modifier la logique:

### Option 1: Détecter les Pages avec Hero

```javascript
const hasHeroPage = computed(() => {
  const heroPages = ['/', '/men', '/women', '/babouches', '/lins']
  return heroPages.includes(route.path)
})

function handleScroll() {
  if (import.meta.client) {
    if (hasHeroPage.value) {
      isScrolled.value = window.scrollY > 50
    } else {
      isScrolled.value = true
    }
  }
}
```

### Option 2: Utiliser une Meta Route

Dans chaque page avec hero:
```javascript
definePageMeta({
  hasHero: true
})
```

Dans la Navbar:
```javascript
const hasHero = computed(() => route.meta.hasHero === true)
```

---

## 📋 Checklist de Validation

### ✅ Modifications Effectuées
- [x] PageHero.vue - height: 100vh
- [x] PageHero.vue - Suppression margin-top
- [x] men.vue - height: 100vh
- [x] women.vue - height: 100vh
- [x] babouches.vue - height: 100vh
- [x] lins.vue - height: 100vh
- [x] Suppression des hauteurs responsive

### ⏳ À Faire
- [ ] Modifier Navbar.vue pour détecter les pages avec hero
- [ ] Tester le comportement sur toutes les pages
- [ ] Vérifier le responsive (mobile, tablet, desktop)
- [ ] Valider les transitions navbar transparent → opaque

---

## 🚀 Prochaine Étape

**Modifier la Navbar** pour qu'elle soit transparente sur les pages de collections:

```javascript
// Dans Navbar.vue
const hasHeroPage = computed(() => {
  const heroPages = ['/', '/men', '/women', '/babouches', '/lins']
  return heroPages.includes(route.path)
})

function handleScroll() {
  if (import.meta.client) {
    if (hasHeroPage.value) {
      isScrolled.value = window.scrollY > 50
    } else {
      isScrolled.value = true
    }
  }
}
```

---

## 📊 Comparaison Avant/Après

| Aspect | Avant | Après |
|--------|-------|-------|
| **Hauteur Hero** | 400px | 100vh |
| **Margin Top** | 90px | 0 |
| **Navbar** | Toujours opaque | Transparent → Opaque |
| **Expérience** | Hero sous navbar | Hero derrière navbar |
| **Immersion** | Moyenne | Maximale |

---

## ✨ Avantages

1. **Expérience Immersive** - Le hero occupe tout l'écran
2. **Cohérence** - Même comportement que la page d'accueil
3. **Élégance** - Navbar transparente au-dessus du hero
4. **Impact Visuel** - Images plein écran plus impressionnantes

---

**Date:** 2025  
**Version:** 1.1  
**Statut:** ✅ Hero modifié, ⏳ Navbar à ajuster
