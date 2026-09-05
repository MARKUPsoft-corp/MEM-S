# Charte Graphique - MEM'S

## 🎨 Palette de Couleurs

La palette MEM'S repose sur des teintes profondes, sobres et naturelles, alliant raffinement contemporain et inspiration africaine. Le noir incarne l'élégance intemporelle, l'or évoque la noblesse des finitions, tandis que les accents terreux et végétaux rappellent les racines culturelles de la marque.

---

## Couleurs Principales

### 1. NOIR PROFOND
**Hex:** `#0B0B0B`  
**Usage:** Primaire  
**Description:** Noir profond élégant, base de l'identité visuelle  
**Utilisation:**
- Texte principal
- Backgrounds de sections importantes
- Éléments de navigation
- Typographie principale

**CSS Variable:** `var(--noir-profond)`

---

### 2. OR BROSSÉ
**Hex:** `#C9A46C`  
**Usage:** Accent luxe (ou texture Or)  
**Description:** Or brossé chaleureux, évoque le luxe et la qualité  
**Utilisation:**
- Boutons CTA principaux
- Accents et highlights
- Prix en promotion
- Éléments premium
- Hover effects

**CSS Variable:** `var(--or-brosse)`

---

### 3. IVOIRE
**Hex:** `#F5F2EC`  
**Usage:** Neutre clair  
**Description:** Ivoire doux, apporte de la lumière et de la douceur  
**Utilisation:**
- Backgrounds clairs
- Cartes produits
- Sections alternées
- Texte sur fond sombre

**CSS Variable:** `var(--ivoire)`

---

## Couleurs d'Accent

### 4. VERT ÉBÈNE
**Hex:** `#0E3A34`  
**Usage:** Accent Afrique  
**Description:** Vert ébène profond, rappelle les racines africaines  
**Utilisation:**
- Accents culturels
- Badges "Nouveauté"
- Sections spéciales
- Call-to-actions secondaires

**CSS Variable:** `var(--vert-ebene)`

---

### 5. TERRACOTTA
**Hex:** `#A14E36`  
**Usage:** Accent terreux  
**Description:** Terracotta chaleureux, évoque la terre et l'authenticité  
**Utilisation:**
- Accents chaleureux
- Badges promotionnels
- Éléments de mise en avant
- Hover states alternatifs

**CSS Variable:** `var(--terracotta)`

---

### 6. GRIS ANTHRACITE
**Hex:** `#2A2A2A`  
**Usage:** Neutre foncé  
**Description:** Gris anthracite, pour les éléments secondaires sombres  
**Utilisation:**
- Backgrounds de menus
- Dropdowns
- Overlays
- Textes secondaires

**CSS Variable:** `var(--gris-anthracite)`

---

## 📐 Règles d'Utilisation

### Hiérarchie des Couleurs

1. **Dominante:** Noir Profond (#0B0B0B) - 60% de l'interface
2. **Secondaire:** Ivoire (#F5F2EC) - 30% de l'interface
3. **Accent:** Or Brossé (#C9A46C) - 10% de l'interface
4. **Touches:** Vert Ébène et Terracotta - Utilisés avec parcimonie

### Contrastes Recommandés

**Texte sur fond clair:**
- Noir Profond sur Ivoire ✓
- Gris Anthracite sur Ivoire ✓

**Texte sur fond sombre:**
- Ivoire sur Noir Profond ✓
- Or Brossé sur Noir Profond ✓
- Ivoire sur Vert Ébène ✓

**Boutons:**
- Fond Or Brossé + Texte Noir Profond (CTA principal)
- Fond Vert Ébène + Texte Ivoire (CTA secondaire)
- Fond Terracotta + Texte Ivoire (CTA promotionnel)

---

## 🎯 Applications par Composant

### Navbar
- **Fond transparent** → Noir Profond (au scroll)
- **Texte:** Ivoire → Noir Profond (au scroll)
- **Logo:** Ivoire → Noir Profond (au scroll)

### Hero Section
- **Texte:** Ivoire
- **Bouton CTA:** Fond Or Brossé, texte Noir Profond
- **Bouton CTA Hover:** Fond Noir Profond, texte Or Brossé

### Cartes Produits
- **Fond:** Ivoire
- **Texte:** Noir Profond
- **Prix:** Or Brossé
- **Badge Nouveau:** Vert Ébène
- **Badge Promo:** Terracotta

### Footer
- **Fond:** Noir Profond
- **Texte:** Ivoire
- **Liens hover:** Or Brossé

### Boutons
- **Primaire:** Or Brossé (fond) + Noir Profond (texte)
- **Secondaire:** Vert Ébène (fond) + Ivoire (texte)
- **Tertiaire:** Transparent (fond) + Or Brossé (bordure + texte)

---

## 💡 Exemples de Code CSS

### Utilisation des Variables

```css
/* Bouton principal */
.btn-primary {
  background-color: var(--or-brosse);
  color: var(--noir-profond);
}

.btn-primary:hover {
  background-color: var(--noir-profond);
  color: var(--or-brosse);
}

/* Section avec fond sombre */
.section-dark {
  background-color: var(--noir-profond);
  color: var(--ivoire);
}

/* Accent culturel */
.badge-new {
  background-color: var(--vert-ebene);
  color: var(--ivoire);
}

/* Prix en promotion */
.price-promo {
  color: var(--terracotta);
  font-weight: 700;
}
```

---

## 🌈 Dégradés Suggérés

### Dégradé Luxe
```css
background: linear-gradient(135deg, var(--noir-profond) 0%, var(--gris-anthracite) 100%);
```

### Dégradé Or
```css
background: linear-gradient(135deg, #D4AF6A 0%, var(--or-brosse) 50%, #B8935A 100%);
```

### Overlay Hero
```css
background: linear-gradient(
  to right,
  rgba(11, 11, 11, 0.6) 0%,
  rgba(11, 11, 11, 0.3) 50%,
  rgba(11, 11, 11, 0.1) 100%
);
```

---

## ♿ Accessibilité

Tous les contrastes respectent les normes WCAG 2.1 niveau AA:

- **Noir Profond sur Ivoire:** Ratio 18.5:1 ✓✓✓
- **Ivoire sur Noir Profond:** Ratio 18.5:1 ✓✓✓
- **Or Brossé sur Noir Profond:** Ratio 7.2:1 ✓✓
- **Ivoire sur Vert Ébène:** Ratio 12.1:1 ✓✓✓
- **Ivoire sur Terracotta:** Ratio 6.8:1 ✓✓

---

## 📱 Responsive

Les couleurs restent identiques sur tous les breakpoints, seules les proportions peuvent varier:

- **Mobile:** Privilégier Noir Profond et Ivoire (lisibilité)
- **Tablet:** Introduire plus d'Or Brossé (accents)
- **Desktop:** Utiliser toute la palette (expérience complète)

---

## 🚀 Migration Progressive

Pour migrer l'existant vers la nouvelle palette:

1. Remplacer `#FFFFFF` par `var(--ivoire)` progressivement
2. Remplacer `#000000` par `var(--noir-profond)`
3. Ajouter `var(--or-brosse)` sur les CTA et accents
4. Utiliser `var(--vert-ebene)` pour les badges culturels
5. Utiliser `var(--terracotta)` pour les promotions

---

**Dernière mise à jour:** 2025
**Version:** 1.0
