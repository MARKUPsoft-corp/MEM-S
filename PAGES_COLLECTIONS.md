# Pages Collections - MEM'S

## 📄 Pages Créées

Quatre pages de collections ont été créées avec une structure homogène et cohérente avec le reste du site.

### 1. **men.vue** - Collection Hommes
- **Route:** `/men`
- **Titre:** Collection Hommes
- **Sous-titre:** Élégance et tradition africaine
- **Image Hero:** Boubou traditionnel
- **Description SEO:** Boubous, gandouras, costumes, chemises et pantalons d'inspiration africaine

### 2. **women.vue** - Collection Femmes
- **Route:** `/women`
- **Titre:** Collection Femmes
- **Sous-titre:** Élégance et raffinement
- **Image Hero:** Robe africaine
- **Description SEO:** Robes africaines, ensembles élégants et sacs d'inspiration africaine

### 3. **babouches.vue** - Collection Babouches
- **Route:** `/babouches`
- **Titre:** Collection Babouches
- **Sous-titre:** Élégance traditionnelle
- **Image Hero:** Babouches en cuir
- **Description SEO:** Babouches artisanales en cuir, élégance traditionnelle et confort moderne

### 4. **lins.vue** - Collection Lins
- **Route:** `/lins`
- **Titre:** Collection Lins
- **Sous-titre:** Naturel & Élégant
- **Image Hero:** Vêtements en lin
- **Description SEO:** Vêtements en lin naturel pour hommes et femmes

---

## 🎨 Structure Commune

Toutes les pages partagent la même structure pour garantir une expérience utilisateur cohérente:

### 1. **Hero Banner**
- Image plein écran (400px desktop, 300px mobile)
- Overlay sombre pour la lisibilité
- Titre en majuscules (Montserrat, 3.5rem)
- Sous-titre en Or Brossé (#C9A46C)
- Margin-top pour compenser la navbar fixe

### 2. **Breadcrumb**
- Navigation fil d'Ariane
- Fond Ivoire (#F5F2EC)
- Lien Accueil → Page actuelle
- Hover effect sur les liens

### 3. **Content Wrapper**
- Layout en grille: Sidebar (280px) + Main content
- Fond Ivoire (#F5F2EC)
- Padding responsive

### 4. **Filters Sidebar**
- Fond blanc
- Position sticky (desktop)
- Placeholder "Filtres à venir"
- Prêt pour intégration des composants de filtres

### 5. **Products Main**
- Fond blanc
- Placeholder "Grille de produits à venir"
- Prêt pour intégration de la grille de produits

---

## 🎨 Charte Graphique Respectée

### Couleurs Utilisées
- **Noir Profond** (#0B0B0B) - Overlays
- **Or Brossé** (#C9A46C) - Sous-titres, hover effects
- **Ivoire** (#F5F2EC) - Backgrounds, textes sur fond sombre
- **Vert Ébène** (#0E3A34) - Breadcrumb actif
- **Gris Anthracite** (#2A2A2A) - Textes secondaires

### Typographie
- **Font:** Montserrat (Google Fonts)
- **Hero Title:** 3.5rem, font-weight 600, uppercase, letter-spacing 2px
- **Hero Subtitle:** 1.25rem, font-weight 400, letter-spacing 1px
- **Breadcrumb:** 0.875rem, font-weight 400/500

### Espacements
- **Hero Height:** 400px (desktop), 300px (mobile)
- **Breadcrumb Padding:** 1.5rem vertical
- **Content Padding:** 3rem vertical (desktop), 2rem (mobile)
- **Grid Gap:** 3rem (desktop), 1.5rem (mobile)

---

## 📱 Responsive Design

### Desktop (> 1024px)
- Hero: 400px height
- Grid: 280px sidebar + 1fr main
- Sidebar: sticky position
- Gap: 3rem

### Tablet (768px - 1024px)
- Hero: 350px height
- Grid: 240px sidebar + 1fr main
- Gap: 2rem

### Mobile (< 768px)
- Hero: 300px height
- Grid: 1 column (stack vertical)
- Sidebar: position static
- Gap: 1.5rem
- Padding réduit

---

## 🔄 Prochaines Étapes

### Phase 1 - Composants de Filtres
Créer les composants pour la sidebar:
- [ ] **FilterCategory.vue** - Filtres par sous-catégorie
- [ ] **FilterPrice.vue** - Filtres par prix (range slider)
- [ ] **FilterSize.vue** - Filtres par taille
- [ ] **FilterColor.vue** - Filtres par couleur
- [ ] **FilterSort.vue** - Tri (prix, popularité, nouveauté)

### Phase 2 - Grille de Produits
Créer les composants pour la zone principale:
- [ ] **ProductsGrid.vue** - Grille responsive de produits
- [ ] **ProductsHeader.vue** - Titre + nombre de résultats + vue (grille/liste)
- [ ] **ProductsPagination.vue** - Pagination ou infinite scroll
- [ ] **ProductsEmpty.vue** - État vide (aucun résultat)

### Phase 3 - Intégration API
- [ ] Connecter au store Pinia
- [ ] Fetch produits par catégorie
- [ ] Appliquer les filtres
- [ ] Loading states
- [ ] Error handling

### Phase 4 - Sous-catégories
Créer les pages de sous-catégories:
- [ ] `/men/boubou`
- [ ] `/men/gandoura`
- [ ] `/men/costumes`
- [ ] `/men/chemise`
- [ ] `/men/pantalon`
- [ ] `/women/vetements`
- [ ] `/women/sacs`

---

## 📝 Notes Techniques

### SEO
- Chaque page a un `useHead()` avec title et meta description
- Breadcrumb pour la navigation
- Structure sémantique HTML5 (section, nav, aside, main)

### Accessibilité
- Navigation au clavier
- Liens avec hover states
- Contraste WCAG AA compliant
- Structure sémantique

### Performance
- Images optimisées (Unsplash temporaires)
- CSS scoped pour éviter les conflits
- Sticky sidebar pour UX améliorée
- Transitions fluides

---

## 🎯 Cohérence avec le Site

Ces pages sont **100% homogènes** avec le reste du site:
- ✅ Même palette de couleurs
- ✅ Même typographie (Montserrat)
- ✅ Même structure de layout
- ✅ Même style de breadcrumb
- ✅ Même responsive breakpoints
- ✅ Même transitions et animations
- ✅ Même espacement et padding

---

**Dernière mise à jour:** 2025  
**Version:** 1.0  
**Statut:** Pages de base créées, prêtes pour l'intégration des composants
