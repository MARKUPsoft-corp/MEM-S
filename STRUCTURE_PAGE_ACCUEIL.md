# Structure de la Page d'Accueil - MEM'S

## 🏠 Sections Recommandées

Basé sur les menus (Hommes, Femmes, Babouches, Lins) et les sous-catégories disponibles.

---

## 1. Hero Section ✅ (Déjà implémenté)

**Description :** Carousel plein écran avec images de produits phares

**Contenu :**
- 3 slides avec images de mannequins
- Titre du produit (ex: ALKEBU-LAN)
- Prix (ex: 2100 FCFA)
- Bouton "Acheter Maintenant"
- Navigation par flèches et dots

**État :** ✅ Complété

---

## 2. Catégories Principales (Shop by Category) ✅

**Description :** Grille de 4 cartes cliquables pour naviguer vers les collections principales

**Contenu :**
- **Hommes** → `/men`
  - Image représentative (boubou ou gandoura)
  - Titre "Hommes"
  
- **Femmes** → `/women`
  - Image représentative (vêtements féminins)
  - Titre "Femmes"
  
- **Babouches** → `/babouches`
  - Image de babouches
  - Titre "Babouches"
  
- **Lins** → `/lins`
  - Image de vêtements en lin
  - Titre "Lins"

**Layout :** Grille 2x2 sur mobile, 4 colonnes sur desktop

**État :** ✅ Complété - Composant `CategoriesSection.vue`

---

## 3. Carte Produit (Composant Réutilisable) 🔄

**Description :** Composant de base pour afficher un produit

**Contenu :**
- Image du produit avec galerie (plusieurs images)
- Onglets de sélection de couleur/variante (ex: Ivory White, Black, Navy Blue)
- Nom du produit
- Prix
- Navigation entre images (flèches ou dots)
- Effet hover élégant
- Responsive

**Basé sur :** Image de référence fournie (design avec onglets de couleur)

**État :** 🔄 En cours de création - Composant `ProductCard.vue`

---

## 4. Nouveautés (New Arrivals) ✅

**Description :** Mise en avant des derniers produits ajoutés

**Contenu :**
- Titre de section "Nouveautés"
- Sous-titre "Découvrez nos dernières créations"
- Onglets de filtrage par catégorie (All Products, Suits, Coat and Jacket, Kaftan, Agbada)
- Grille de 6 produits récents
- Badge "NEW" sur chaque carte produit
- Utilise le composant **ProductCard.vue**
- Bouton "Voir Plus" (optionnel)

**Layout :** Grille responsive (2 cols mobile, 3 cols tablet, 4 cols desktop, 6 cols large desktop)

**État :** ✅ Complété - Composant `NewArrivalsSection.vue`

---

## 5. Collection Hommes (Men's Collection)

**Description :** Showcase des sous-catégories hommes avec produits vedettes

**Contenu :**
- Titre de section "Collection Hommes"
- Sous-sections avec 2-3 produits chacune :
  - **Boubou** → `/men/boubou`
  - **Gandoura** → `/men/gandoura`
  - **Costumes** → `/men/costumes`
  - **Chemise** → `/men/chemise`
  - **Pantalon** → `/men/pantalon`

**Présentation :**
- Onglets ou carousel pour naviguer entre sous-catégories
- 2-3 produits par sous-catégorie
- Bouton "Voir la collection complète"

**État :** ⏳ À créer

---

## 6. Babouches en Vedette

**Description :** Section dédiée aux babouches, produit signature

**Contenu :**
- Titre de section "Babouches"
- Sous-titre "Élégance traditionnelle"
- Grille de 4-6 modèles de babouches
- Différentes couleurs et styles
- Bouton "Découvrir la collection" → `/babouches`

**Layout :** Grille responsive avec images carrées

**État :** ⏳ À créer

---

## 7. Collection Femmes (Women's Collection)

**Description :** Showcase des produits féminins

**Contenu :**
- Titre de section "Collection Femmes"
- Deux sous-sections :
  - **Vêtements** → `/women/vetements`
    - 3-4 produits vedettes
  - **Sacs** → `/women/sacs`
    - 3-4 modèles de sacs

**Présentation :**
- Split layout (50/50) ou grille
- Images grandes et élégantes
- Bouton "Voir la collection"

**État :** ⏳ À créer

---

## 8. Collection Lins

**Description :** Mise en avant des produits en lin naturel

**Contenu :**
- Titre de section "Collection Lins"
- Sous-titre "Naturel & Élégant"
- Grille de 4-6 produits en lin
- Mix hommes/femmes
- Bouton "Découvrir" → `/lins`

**Style :** Tons naturels, photos lumineuses

**État :** ⏳ À créer

---

## 9. Produits Vedettes (Featured Products)

**Description :** Sélection manuelle des best-sellers

**Contenu :**
- Titre de section "Nos Coups de Cœur"
- 4-6 produits sélectionnés
- Mix de toutes les catégories
- Mise en avant visuelle (badge "Coup de cœur" en Or Brossé)

**Layout :** Grille responsive

**État :** ⏳ À créer

---

## 10. À Propos / Notre Histoire (About Us)

**Description :** Section informative sur la marque MEM'S

**Contenu :**
- Titre "Notre Histoire"
- Texte court (2-3 paragraphes) :
  - "MEM'S est votre destination pour des vêtements alliant élégance intemporelle et inspiration africaine."
  - Valeurs de la marque
  - Engagement qualité
- Image ou vidéo de la marque
- Bouton "En savoir plus" → `/about`

**Style :** Fond Ivoire ou Vert Ébène, typographie élégante

**État :** ⏳ À créer

---

## 11. Témoignages Clients (Optionnel)

**Description :** Avis et retours clients

**Contenu :**
- Titre "Ce Que Disent Nos Clients"
- 2-3 cartes de témoignages :
  - Photo du client (optionnel)
  - Nom du client
  - Note (étoiles)
  - Commentaire
- Carousel sur mobile

**État :** 🔵 Optionnel

---

## 12. Instagram Feed (Optionnel)

**Description :** Galerie de photos Instagram

**Contenu :**
- Titre "Suivez-nous sur Instagram"
- Grille de 6-8 photos Instagram
- Lien vers le compte @mems
- Hashtag #MemsStyle

**Layout :** Grille 3x2 ou 4x2

**État :** 🔵 Optionnel

---

## 13. Newsletter (Optionnel)

**Description :** Inscription à la newsletter

**Contenu :**
- Titre "Restez Informé"
- Sous-titre "Recevez nos nouveautés et offres exclusives"
- Input email
- Bouton "S'inscrire"
- Checkbox RGPD

**Style :** Fond Vert Ébène, texte Ivoire

**État :** 🔵 Optionnel

---

## 14. Footer ✅ (Déjà implémenté)

**Contenu :**
- Informations MEM'S
- Liens rapides (Hommes, Femmes, À Propos, Contact)
- Réseaux sociaux
- Contact (email, téléphone)
- Copyright

**État :** ✅ Complété

---

## 📐 Structure Recommandée (Ordre d'Affichage)

```
┌─────────────────────────────────────┐
│  1. Hero Section (Carousel)         │ ✅
├─────────────────────────────────────┤
│  2. Catégories Principales          │ ⏳
│     (4 cartes: Hommes, Femmes,      │
│      Babouches, Lins)               │
├─────────────────────────────────────┤
│  3. Nouveautés                      │ ⏳
│     (Grille de produits récents)    │
├─────────────────────────────────────┤
│  4. Collection Hommes               │ ⏳
│     (Boubou, Gandoura, Costumes,    │
│      Chemise, Pantalon)             │
├─────────────────────────────────────┤
│  5. Babouches en Vedette            │ ⏳
│     (Grille de babouches)           │
├─────────────────────────────────────┤
│  6. Collection Femmes               │ ⏳
│     (Vêtements, Sacs)               │
├─────────────────────────────────────┤
│  7. Collection Lins                 │ ⏳
│     (Produits en lin)               │
├─────────────────────────────────────┤
│  8. Produits Vedettes               │ ⏳
│     (Best-sellers)                  │
├─────────────────────────────────────┤
│  9. À Propos                        │ ⏳
│     (Histoire de la marque)         │
├─────────────────────────────────────┤
│  10. Newsletter (Optionnel)         │ 🔵
├─────────────────────────────────────┤
│  11. Footer                         │ ✅
└─────────────────────────────────────┘
```

---

## 🎨 Priorités d'Implémentation

### Phase 1 - Essentiel (MVP)
**Objectif :** Site fonctionnel avec contenu de base

1. ✅ Hero Section (Complété)
2. ✅ Catégories Principales (Complété)
3. 🔄 Carte Produit (En cours)
4. ⏳ Nouveautés
5. ✅ Footer (Complété)

**Durée estimée :** 2-3 jours

---

### Phase 2 - Important (Contenu Riche)
**Objectif :** Showcase complet des collections

5. ⏳ Collection Hommes
6. ⏳ Collection Femmes
7. ⏳ Babouches en Vedette
8. ⏳ Produits Vedettes

**Durée estimée :** 3-4 jours

---

### Phase 3 - Optionnel (Engagement)
**Objectif :** Améliorer l'engagement et la conversion

9. ⏳ Collection Lins
10. ⏳ À Propos
11. 🔵 Témoignages Clients
12. 🔵 Instagram Feed
13. 🔵 Newsletter

**Durée estimée :** 2-3 jours

---

## 🎯 Composants à Créer

### Composants Réutilisables

1. **ProductCard.vue**
   - Image produit
   - Nom
   - Prix
   - Badge (Nouveau, Coup de cœur)
   - Hover effects

2. **ProductGrid.vue**
   - Grille responsive de ProductCard
   - Filtres (optionnel)
   - Pagination (optionnel)

3. **CategoryCard.vue**
   - Image de catégorie
   - Titre
   - Lien vers la collection
   - Hover effects

4. **SectionTitle.vue**
   - Titre de section
   - Sous-titre (optionnel)
   - Ligne décorative

5. **NewsletterForm.vue**
   - Input email
   - Bouton submit
   - Validation
   - Message de confirmation

---

## 📱 Considérations Responsive

### Mobile (< 768px)
- 1 colonne pour les grilles
- Carousel pour les collections
- Sections empilées verticalement
- Images pleine largeur

### Tablet (768px - 1024px)
- 2 colonnes pour les grilles
- Mix de grilles et carousels
- Espacement optimisé

### Desktop (> 1024px)
- 4 colonnes pour les grilles
- Grilles complètes visibles
- Hover effects élaborés
- Espacement généreux

---

## 🎨 Cohérence Visuelle

### Couleurs à Utiliser
- **Fond sections alternées :** Blanc `#FFFFFF` / Ivoire `#F5F2EC`
- **Titres :** Noir Profond `#0B0B0B`
- **Boutons CTA :** Or Brossé `#C9A46C`
- **Badges :** Vert Ébène `#0E3A34` / Terracotta `#A14E36`
- **Textes secondaires :** Gris Anthracite `#2A2A2A`

### Typographie
- **Titres sections :** Montserrat, 2-2.5rem, font-weight 600-700
- **Sous-titres :** Montserrat, 1-1.25rem, font-weight 400
- **Textes :** Montserrat, 0.875-1rem, font-weight 400
- **Boutons :** Montserrat, 0.875rem, font-weight 600, uppercase

### Espacements
- **Entre sections :** 5-8rem (desktop), 3-4rem (mobile)
- **Padding sections :** 3-4rem (desktop), 2rem (mobile)
- **Gap grilles :** 2rem (desktop), 1.5rem (mobile)

---

## 📝 Notes d'Implémentation

### Images
- Format : JPG ou WebP
- Dimensions produits : 800x1000px (ratio 4:5)
- Dimensions catégories : 600x600px (carré)
- Optimisation : < 200KB par image
- Alt text obligatoire pour SEO

### Performance
- Lazy loading pour les images
- Préchargement des images hero
- Pagination ou infinite scroll pour les grilles
- Cache des données produits

### SEO
- Balises meta appropriées
- Schema.org pour les produits
- URLs propres et descriptives
- Sitemap XML

---

**Dernière mise à jour :** 2025  
**Version :** 1.0  
**Statut :** En cours de développement
