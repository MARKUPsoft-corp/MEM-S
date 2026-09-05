# Guide de Test du Panier

## Problème Actuel

Le frontend reçoit des erreurs 403 Forbidden lors de l'accès à l'API du panier. Cela se produit parce que :

1. Un token expiré ou invalide existe dans le localStorage
2. Le frontend pense que l'utilisateur est authentifié (`isAuthenticated = true`)
3. Il tente d'appeler l'API avec ce token invalide
4. Le backend rejette la requête avec 403 Forbidden

## Solution Rapide

### Étape 1 : Nettoyer le localStorage

Ouvrez la console du navigateur (F12) et exécutez :

```javascript
localStorage.clear()
location.reload()
```

Cela supprimera tous les tokens expirés et rechargera la page.

### Étape 2 : Tester en tant qu'utilisateur non authentifié

1. Rechargez la page `/cart`
2. Le panier devrait se charger depuis localStorage
3. Aucune erreur 403 ne devrait apparaître
4. Vous devriez voir vos articles (s'il y en a dans localStorage)

### Étape 3 : Tester la connexion et la synchronisation

1. Ajoutez quelques articles au panier en tant que guest
2. Connectez-vous avec un compte valide
3. Le panier devrait se synchroniser automatiquement
4. Vous devriez voir un badge "Synchronisé" sur la page panier

## Tests à Effectuer

### Test 1 : Utilisateur Non Authentifié
- [ ] Ajouter des articles au panier
- [ ] Vérifier que les articles sont sauvegardés dans localStorage
- [ ] Recharger la page et vérifier que les articles sont toujours là
- [ ] Aucune erreur 403 ne devrait apparaître

### Test 2 : Connexion avec Panier Existant
- [ ] Ajouter 2-3 articles en tant que guest
- [ ] Se connecter
- [ ] Vérifier que les articles sont synchronisés avec le backend
- [ ] Le badge "Synchronisé" devrait apparaître
- [ ] Le localStorage devrait être vidé après la sync

### Test 3 : Utilisateur Authentifié
- [ ] Se connecter
- [ ] Ajouter des articles au panier
- [ ] Les articles devraient être sauvegardés directement dans le backend
- [ ] Recharger la page
- [ ] Les articles devraient être chargés depuis le backend

### Test 4 : Déconnexion
- [ ] Se déconnecter
- [ ] Le panier devrait être vidé
- [ ] Retour au mode localStorage

## Commandes Utiles

### Vérifier le localStorage
```javascript
// Voir le contenu du panier
console.log(JSON.parse(localStorage.getItem('cart') || '[]'))

// Voir le token
console.log(localStorage.getItem('token'))

// Voir l'utilisateur
console.log(JSON.parse(localStorage.getItem('user') || 'null'))
```

### Nettoyer sélectivement
```javascript
// Supprimer seulement le token
localStorage.removeItem('token')
localStorage.removeItem('refreshToken')
localStorage.removeItem('user')

// Garder le panier
// (ne pas supprimer 'cart')
```

## Vérification Backend

### Tester l'API manuellement

```bash
# Créer un utilisateur de test
cd backend
python manage.py shell

from apps.accounts.models import User
user = User.objects.create_user(
    username='testcart',
    email='testcart@example.com',
    password='testpass123'
)
print(f"User created: {user.id}")
exit()

# Obtenir un token
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"testcart@example.com","password":"testpass123"}'

# Utiliser le token pour accéder au panier
# Remplacez YOUR_TOKEN par le token obtenu
curl -X GET http://localhost:8000/api/cart/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Logs à Surveiller

### Frontend (Console Navigateur)
- ✅ Pas d'erreur 403
- ✅ "Synchronisation en cours..." lors de la connexion
- ✅ Pas d'erreur "Error fetching cart" ou "Error syncing cart"

### Backend (Terminal Django)
- ✅ Pas de "Forbidden: /api/cart/"
- ✅ Status 200 pour les requêtes authentifiées
- ✅ Status 403 seulement pour les requêtes sans token valide

## Problèmes Connus et Solutions

### Problème : Erreur 403 au chargement de la page
**Cause** : Token expiré dans localStorage  
**Solution** : `localStorage.clear()` puis recharger

### Problème : Le panier ne se synchronise pas lors de la connexion
**Cause** : Le watcher du composable ne se déclenche pas  
**Solution** : Vérifier que le authStore change bien de `false` à `true`

### Problème : Les articles disparaissent après la connexion
**Cause** : La synchronisation échoue mais le localStorage est vidé  
**Solution** : Vérifier les logs backend pour voir l'erreur

### Problème : Le badge "Synchronisé" n'apparaît pas
**Cause** : L'utilisateur n'est pas authentifié  
**Solution** : Vérifier `authStore.isAuthenticated` dans la console

## Prochaines Améliorations

1. **Validation du token** : Vérifier si le token est expiré avant d'appeler l'API
2. **Refresh token** : Implémenter le rafraîchissement automatique du token
3. **Notifications** : Ajouter des toasts pour informer l'utilisateur
4. **Retry logic** : Réessayer automatiquement en cas d'erreur réseau
5. **Offline mode** : Gérer le mode hors ligne avec queue de synchronisation

---

**Note** : Après avoir nettoyé le localStorage, le système devrait fonctionner correctement. Les erreurs 403 ne devraient apparaître que si vous tentez d'accéder à l'API sans être authentifié, ce qui ne devrait plus arriver avec les corrections apportées.
