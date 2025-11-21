# Système de Notifications et Modales

## 📦 Composants Créés

### 1. Notification.vue
Composant pour afficher des notifications toast élégantes.

**Types disponibles** :
- `success` : Vert avec icône check
- `error` : Rouge avec icône exclamation
- `warning` : Doré avec icône triangle
- `info` : Bleu avec icône info

### 2. ConfirmModal.vue
Modale de confirmation stylisée avec le thème du site.

**Types disponibles** :
- `danger` : Pour les actions destructives
- `warning` : Pour les actions nécessitant confirmation
- `info` : Pour les informations

### 3. NotificationContainer.vue
Conteneur global pour afficher toutes les notifications.

### 4. ConfirmModalContainer.vue
Conteneur global pour la modale de confirmation.

## 🎯 Composables

### useNotification()
Gère l'affichage des notifications.

```typescript
const { success, error, warning, info } = useNotification()

// Exemples d'utilisation
success('Produit ajouté au panier !')
error('Une erreur est survenue')
warning('Attention, stock limité')
info('Nouvelle fonctionnalité disponible')
```

### useConfirm()
Gère les modales de confirmation.

```typescript
const { confirm } = useConfirm()

// Exemple d'utilisation
const confirmed = await confirm({
  title: 'Supprimer l'article',
  message: 'Êtes-vous sûr de vouloir supprimer cet article ?',
  confirmText: 'Supprimer',
  cancelText: 'Annuler',
  type: 'danger'
})

if (confirmed) {
  // Action confirmée
}
```

## 🚀 Utilisation

### Dans un composant Vue

```vue
<script setup lang="ts">
import { useNotification } from '~/composables/useNotification'
import { useConfirm } from '~/composables/useConfirm'

const { success, error } = useNotification()
const { confirm } = useConfirm()

const handleDelete = async () => {
  const confirmed = await confirm({
    title: 'Confirmation',
    message: 'Voulez-vous vraiment supprimer cet élément ?',
    type: 'danger'
  })
  
  if (confirmed) {
    try {
      // Logique de suppression
      success('Élément supprimé avec succès')
    } catch (err) {
      error('Erreur lors de la suppression')
    }
  }
}
</script>
```

## 🎨 Style

Les composants utilisent la charte graphique du site :
- **Couleur principale** : #0E3A34 (vert foncé)
- **Couleur accent** : #C9A46C (doré)
- **Couleur erreur** : #A14E36 (rouge brique)
- **Background** : #F5F2EC (beige clair)
- **Police** : Montserrat

## 📱 Responsive

Les notifications et modales sont entièrement responsives :
- **Desktop** : Notifications en haut à droite
- **Mobile** : Notifications pleine largeur, modales adaptées

## ✅ Intégration

Les composants sont déjà intégrés dans le layout `default.vue` :
- `NotificationContainer` : Affiche toutes les notifications
- `ConfirmModalContainer` : Affiche la modale de confirmation

## 🔄 Remplacement des alerts

### Avant (avec alert)
```javascript
alert('Produit ajouté au panier !')
if (confirm('Voulez-vous continuer ?')) {
  // Action
}
```

### Après (avec le nouveau système)
```javascript
const { success } = useNotification()
const { confirm } = useConfirm()

success('Produit ajouté au panier !')

const confirmed = await confirm({
  message: 'Voulez-vous continuer ?'
})
if (confirmed) {
  // Action
}
```

## 📋 Implémentation Complète

Tous les `alert()` et `confirm()` ont été remplacés dans le projet :

1. **Page produit** (`pages/products/[slug].vue`) :
   - ✅ Remplacé `alert()` pour l'ajout au panier → Notification success
   - ✅ Remplacé `alert()` pour les erreurs → Notification error
   - ✅ Remplacé `confirm()` pour la connexion requise → Modale de confirmation

2. **Page panier** (`pages/cart.vue`) :
   - ✅ Remplacé `confirm()` pour la suppression d'article → Modale de confirmation danger
   - ✅ Remplacé `confirm()` pour l'accès au panier → Modale de confirmation info
   - ✅ Notification success après suppression

3. **Navbar** (`components/Navbar.vue`) :
   - ✅ Remplacé `confirm()` pour l'accès au panier → Modale de confirmation info

4. **Sidebar** (`components/sidebar/SidebarFooter.vue`) :
   - ✅ Remplacé `confirm()` pour l'accès au panier → Modale de confirmation info

## 🎯 Avantages

- ✅ Design cohérent avec le site
- ✅ Animations fluides
- ✅ Responsive
- ✅ Accessible
- ✅ Type-safe (TypeScript)
- ✅ Facile à utiliser
- ✅ Personnalisable

---

**Date de création** : 21 novembre 2025  
**Version** : 1.0
