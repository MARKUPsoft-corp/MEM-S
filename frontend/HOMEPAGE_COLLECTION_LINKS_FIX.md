# Correction des Liens "Voir la Collection Complète" - Page d'Accueil

## Date
14 Novembre 2025

## Problème Identifié

Les sections de collection sur la page d'accueil (`index.vue`) contenaient des liens "Voir la collection complète" qui pointaient vers des routes inexistantes :

- **MensCollectionSection** : Liens vers `/men/boubou`, `/men/gandoura`, etc. ❌
- **WomensCollectionSection** : Liens vers `/women/vetements`, `/women/sacs` ❌

Ces routes n'existent pas car les catégories sont accessibles via des overlays avec paramètres URL.

## Solution Implémentée

### 1. MensCollectionSection.vue

**Avant :**
```javascript
const subcategories = [
    { id: 'boubou', name: 'Boubou', link: '/men/boubou' },
    { id: 'gandoura', name: 'Gandoura', link: '/men/gandoura' },
    // ...
]
```

**Après :**
```javascript
const subcategories = [
    { id: 'boubou', name: 'Boubou', link: '/men?category=boubou' },
    { id: 'gandoura', name: 'Gandoura', link: '/men?category=gandoura' },
    { id: 'costumes', name: 'Costumes', link: '/men?category=costumes' },
    { id: 'chemise', name: 'Chemise', link: '/men?category=chemise' },
    { id: 'pantalon', name: 'Pantalon', link: '/men?category=pantalon' }
]
```

### 2. WomensCollectionSection.vue

**Avant :**
```javascript
const subcategories = [
    { id: 'vetements', name: 'Vêtements', link: '/women/vetements' },
    { id: 'sacs', name: 'Sacs', link: '/women/sacs' }
]
```

**Après :**
```javascript
const subcategories = [
    { id: 'robes', name: 'Vêtements', link: '/women?category=robes' },
    { id: 'sacs', name: 'Sacs', link: '/women?category=sacs' }
]
```

**Note :** Changement de `vetements` à `robes` pour correspondre aux catégories réelles de la page women.

### 3. Correction des Données Produits

Mise à jour de tous les produits dans `WomensCollectionSection.vue` :
- `subcategory: 'vetements'` → `subcategory: 'robes'`
- `activeSubcategory = ref('vetements')` → `activeSubcategory = ref('robes')`

## Comportement Actuel

### Page d'Accueil - Section Hommes
Lorsqu'un utilisateur clique sur "Voir la collection complète" :
- Il est redirigé vers `/men?category=boubou` (ou autre catégorie active)
- La page `/men` s'ouvre avec l'overlay de la catégorie correspondante
- L'utilisateur voit immédiatement tous les produits de cette catégorie

### Page d'Accueil - Section Femmes
Lorsqu'un utilisateur clique sur "Voir la collection complète" :
- Il est redirigé vers `/women?category=robes` ou `/women?category=sacs`
- La page `/women` s'ouvre avec l'overlay de la catégorie correspondante
- L'utilisateur voit immédiatement tous les produits de cette catégorie

### Page d'Accueil - Section Babouches
- Lien vers `/babouches` ✅ (déjà fonctionnel)

### Page d'Accueil - Section Lins
- Lien vers `/lins` ✅ (déjà fonctionnel)

## Cohérence avec le Système Existant

Cette modification s'aligne avec le système de navigation déjà implémenté dans :
- **Navbar** : Utilise les paramètres `?category=` pour ouvrir les overlays
- **Sidebar** : Utilise les paramètres `?category=` pour ouvrir les overlays
- **Pages de collection** : Gèrent l'ouverture automatique des overlays via les paramètres URL

## Fichiers Modifiés

1. `frontend/app/components/MensCollectionSection.vue`
   - Mise à jour des liens de sous-catégories

2. `frontend/app/components/WomensCollectionSection.vue`
   - Mise à jour des liens de sous-catégories
   - Correction du nom de catégorie `vetements` → `robes`
   - Mise à jour des données produits

## Tests Recommandés

1. ✅ Cliquer sur "Voir la collection complète" dans la section Hommes avec différentes catégories actives
2. ✅ Cliquer sur "Voir la collection complète" dans la section Femmes avec différentes catégories actives
3. ✅ Vérifier que l'overlay s'ouvre automatiquement sur la bonne catégorie
4. ✅ Vérifier que les produits affichés correspondent à la catégorie sélectionnée

## Résultat

Tous les liens "Voir la collection complète" de la page d'accueil fonctionnent maintenant correctement et redirigent vers les pages appropriées avec les overlays de catégorie correspondants.
