# Roadmap E-commerce Simplifié - Vue d'ensemble

## 🛠️ Technologies à Utiliser

### Frontend
- **Framework**: Nuxt 4 (Vue 3)
- **CSS**: Bootstrap 5
- **State Management**: Pinia
- **HTTP**: Nuxt $fetch (intégré)
- **Images**: Nuxt Image (optimisation automatique)
- **Icons**: Bootstrap Icons

### Backend
- **Framework**: Django 5.x
- **API**: Django REST Framework (DRF)
- **Authentification**: JWT (djangorestframework-simplejwt)
- **Base de données**: PostgreSQL (prod) / SQLite (dev)
- **Upload Images**: Pillow + stockage local ou Cloudinary
- **Admin**: Django Admin (par défaut)
- **CORS**: django-cors-headers

### Outils & Déploiement

**Backend:**
- Gunicorn (serveur WSGI)
- Nginx (reverse proxy)
- VPS (DigitalOcean, AWS, Heroku)

**Frontend:**
- Vercel / Netlify (déploiement automatique)
- Ou VPS avec PM2

### Système de Commande
- **Pas de paiement en ligne**
- Validation via WhatsApp (redirection automatique avec récapitulatif)
- Gestion des commandes dans Django Admin

---

## 📁 Structure Backend Django

```
backend/
│
├── config/                          # Configuration principale
│   ├── settings.py                  # Paramètres Django
│   ├── urls.py                      # URLs principales
│   ├── wsgi.py
│   └── asgi.py
│
├── apps/                            # Applications Django
│   │
│   ├── accounts/                    # Gestion utilisateurs
│   │   ├── models.py                # User personnalisé (phone, whatsapp, address)
│   │   ├── serializers.py           # Sérialisation User
│   │   ├── views.py                 # Login, Register, Profile
│   │   ├── urls.py                  # Routes auth
│   │   └── admin.py                 # Admin users
│   │
│   ├── products/                    # Gestion produits
│   │   ├── models.py                # Category, Product, ProductImage, ProductVariant
│   │   ├── serializers.py           # Sérialisation produits
│   │   ├── views.py                 # Liste, détail, filtres
│   │   ├── urls.py                  # Routes produits
│   │   └── admin.py                 # Admin produits (inline images/variants)
│   │
│   ├── cart/                        # Panier (optionnel en DB)
│   │   ├── models.py                # Cart, CartItem (ou géré en frontend)
│   │   ├── serializers.py
│   │   ├── views.py                 # Add, Update, Remove
│   │   └── urls.py
│   │
│   └── orders/                      # Commandes
│       ├── models.py                # Order, OrderItem (avec statut, numéro unique)
│       ├── serializers.py           # Sérialisation commandes
│       ├── views.py                 # Créer commande, historique
│       ├── urls.py                  # Routes commandes
│       └── admin.py                 # Admin commandes (inline items)
│
├── media/                           # Fichiers uploadés
│   ├── products/                    # Images produits
│   ├── categories/                  # Images catégories
│   └── users/                       # Avatars (optionnel)
│
├── static/                          # Fichiers statiques collectés
│
├── requirements/                    # Dépendances Python
│   ├── base.txt                     # Dépendances communes
│   ├── dev.txt                      # Dépendances dev
│   └── prod.txt                     # Dépendances prod
│
├── .env                             # Variables d'environnement
├── .gitignore
├── manage.py
└── README.md
```

---

## 📊 Détail des Modèles Backend

### accounts/models.py
**User** (hérité AbstractUser) : 
- email
- phone
- whatsapp
- address
- city

### products/models.py
**Category** : 
- name
- slug
- image
- order

**Product** : 
- name
- slug
- description
- category
- price
- discount_price
- is_new
- stock

**ProductImage** : 
- product
- image
- is_primary
- order

**ProductVariant** : 
- product
- size
- color
- sku
- stock

### orders/models.py
**Order** : 
- order_number
- user
- status
- full_name
- phone
- whatsapp
- address
- city
- notes
- subtotal
- total
- whatsapp_sent
- created_at

**OrderItem** : 
- order
- product
- variant
- quantity
- price

---

## 🔌 API Endpoints Backend

### Authentication
```
POST   /api/auth/register/          # Inscription
POST   /api/auth/login/             # Connexion (retourne JWT)
POST   /api/auth/refresh/           # Refresh token
GET    /api/auth/profile/           # Profil utilisateur
PUT    /api/auth/profile/           # Modifier profil
```

### Products
```
GET    /api/products/               # Liste produits (avec filtres)
GET    /api/products/{slug}/        # Détail produit
GET    /api/categories/             # Liste catégories
```

### Cart (optionnel si géré en frontend)
```
GET    /api/cart/                   # Panier utilisateur
POST   /api/cart/add/               # Ajouter au panier
PUT    /api/cart/update/{id}/       # Modifier quantité
DELETE /api/cart/remove/{id}/       # Retirer du panier
```

### Orders
```
POST   /api/orders/                 # Créer commande
GET    /api/orders/                 # Historique commandes
GET    /api/orders/{id}/            # Détail commande
```

---

## 📁 Structure Frontend Nuxt 4

```
frontend/
│
├── assets/                          # Assets non compilés
│   └── css/
│       └── custom.css               # Styles Bootstrap personnalisés
│
├── components/                      # Composants Vue
│   │
│   ├── layout/                      # Composants layout
│   │   ├── Header.vue               # Navigation principale
│   │   ├── Footer.vue               # Pied de page
│   │   ├── Breadcrumb.vue           # Fil d'Ariane
│   │   └── SearchModal.vue          # Modal recherche
│   │
│   ├── product/                     # Composants produits
│   │   ├── ProductCard.vue          # Carte produit (grille)
│   │   ├── ProductGrid.vue          # Grille de produits
│   │   ├── ProductGallery.vue       # Galerie images détail
│   │   ├── ProductFilter.vue        # Filtres (catégorie, prix)
│   │   └── ProductVariantSelector.vue  # Sélecteur taille/couleur
│   │
│   ├── cart/                        # Composants panier
│   │   ├── CartItem.vue             # Ligne panier
│   │   ├── CartSummary.vue          # Récapitulatif panier
│   │   └── CartIcon.vue             # Icon panier (header)
│   │
│   └── ui/                          # Composants UI génériques
│       ├── Button.vue
│       ├── Modal.vue
│       └── Loading.vue
│
├── composables/                     # Logique réutilisable
│   ├── useAuth.ts                   # Gestion authentification
│   ├── useCart.ts                   # Logique panier
│   ├── useWhatsApp.ts               # Formatage message WhatsApp
│   └── useProducts.ts               # Logique produits/filtres
│
├── layouts/                         # Layouts
│   ├── default.vue                  # Layout principal (avec Header/Footer)
│   └── empty.vue                    # Layout vide (login/register)
│
├── middleware/                      # Middlewares
│   ├── auth.ts                      # Protection routes authentifiées
│   └── guest.ts                     # Redirection si déjà connecté
│
├── pages/                           # Pages/Routes
│   │
│   ├── index.vue                    # Accueil (hero + produits vedettes)
│   │
│   ├── products/                    # Produits
│   │   ├── index.vue                # Liste/grille produits
│   │   └── [slug].vue               # Détail produit
│   │
│   ├── cart.vue                     # Page panier
│   ├── checkout.vue                 # Page checkout (formulaire avant WhatsApp)
│   │
│   ├── auth/                        # Authentification
│   │   ├── login.vue                # Connexion
│   │   ├── register.vue             # Inscription
│   │   └── forgot-password.vue      # Mot de passe oublié
│   │
│   ├── account/                     # Espace client
│   │   ├── profile.vue              # Profil utilisateur
│   │   ├── orders.vue               # Historique commandes
│   │   └── orders/[id].vue          # Détail commande
│   │
│   ├── about.vue                    # À propos
│   └── contact.vue                  # Contact
│
├── stores/                          # Stores Pinia
│   ├── auth.ts                      # State authentification (user, token)
│   ├── cart.ts                      # State panier (items, total)
│   └── products.ts                  # State produits (cache, filtres)
│
├── types/                           # Types TypeScript
│   ├── auth.ts                      # Types User, Login, Register
│   ├── product.ts                   # Types Product, Category, Variant
│   ├── cart.ts                      # Types CartItem
│   └── order.ts                     # Types Order, OrderItem
│
├── utils/                           # Utilitaires
│   ├── api.ts                       # Configuration API client
│   ├── format.ts                    # Formatage prix, dates
│   └── validators.ts                # Validation formulaires
│
├── plugins/                         # Plugins Nuxt
│   └── bootstrap.client.ts          # Init Bootstrap JS (client-side)
│
├── public/                          # Fichiers publics
│   ├── favicon.ico
│   ├── logo.svg
│   └── images/
│
├── .env                             # Variables d'environnement
├── nuxt.config.ts                   # Configuration Nuxt
├── tsconfig.json                    # Configuration TypeScript
├── package.json
└── README.md
```

---

## 🗄️ Stores Pinia

### stores/auth.ts
**State** : 
- user
- token
- isAuthenticated

**Actions** : 
- login()
- register()
- logout()
- fetchProfile()

### stores/cart.ts
**State** : 
- items[]
- subtotal
- total
- totalItems

**Actions** : 
- addItem()
- updateQuantity()
- removeItem()
- clear()

**Persistance** : localStorage

### stores/products.ts
**State** : 
- products[]
- categories[]
- filters

**Actions** : 
- fetchProducts()
- fetchCategories()
- filterProducts()

---

## 📄 Pages Principales

### Pages publiques
- `/` : Accueil (hero + produits vedettes + catégories)
- `/products` : Liste produits (grille + filtres)
- `/products/[slug]` : Détail produit (galerie + variantes + add to cart)
- `/cart` : Panier (liste items + récapitulatif)
- `/checkout` : Checkout (formulaire livraison → redirection WhatsApp)

### Pages authentification
- `/auth/login` : Connexion
- `/auth/register` : Inscription
- `/auth/forgot-password` : Réinitialisation

### Pages privées (middleware auth)
- `/account/profile` : Profil utilisateur
- `/account/orders` : Historique commandes
- `/account/orders/[id]` : Détail commande

---

## 🔄 Flow Utilisateur (Commande via WhatsApp)

```
1. Utilisateur parcourt les produits
   ↓
2. Ajoute produits au panier (avec variantes si applicable)
   ↓
3. Va sur /cart → vérifie son panier
   ↓
4. Clique "Passer commande" → redirigé vers /checkout
   ↓
5. Remplit formulaire livraison (nom, téléphone, WhatsApp, adresse, ville, notes)
   ↓
6. Clique "Commander via WhatsApp"
   ↓
7. Backend crée la commande (statut: pending)
   ↓
8. Frontend génère message WhatsApp formaté avec:
   - N° commande
   - Liste articles (nom, variante, quantité, prix)
   - Total
   - Infos client
   - Adresse livraison
   ↓
9. Redirection automatique vers WhatsApp Business (wa.me/237XXXXXXXXX)
   ↓
10. Client envoie le message → Vous recevez la commande sur WhatsApp
    ↓
11. Vous confirmez la commande manuellement
    ↓
12. Mise à jour statut dans Django Admin (confirmed → processing → shipped → delivered)
```

---

## 📊 Modèle de Données Simplifié

```
User (Django Auth)
├── id
├── email (unique)
├── password (hashed)
├── phone
├── whatsapp
├── address
└── city

Category
├── id
├── name
├── slug (unique)
├── image
└── order

Product
├── id
├── name
├── slug (unique)
├── description
├── category_id (FK)
├── price
├── discount_price
├── is_new (boolean)
├── stock
└── created_at

ProductImage
├── id
├── product_id (FK)
├── image
├── is_primary (boolean)
└── order

ProductVariant
├── id
├── product_id (FK)
├── size (XS, S, M, L, XL, XXL)
├── color
├── sku (unique)
└── stock

Order
├── id
├── order_number (unique, ex: ORD-A3B5C7D9)
├── user_id (FK)
├── status (pending, confirmed, processing, shipped, delivered, cancelled)
├── full_name
├── phone
├── whatsapp
├── address
├── city
├── notes
├── subtotal
├── total
├── whatsapp_sent (boolean)
├── whatsapp_sent_at
├── created_at
└── updated_at

OrderItem
├── id
├── order_id (FK)
├── product_id (FK)
├── variant_id (FK, nullable)
├── quantity
└── price
```

---

## 🎯 Fonctionnalités par Phase

### Phase 1 (Semaine 1-2) : Setup & Configuration
✅ Installation Django + DRF + JWT  
✅ Installation Nuxt 4 + Bootstrap 5 + Pinia  
✅ Configuration CORS  
✅ Structure des dossiers  
✅ Base de données PostgreSQL

### Phase 2 (Semaine 3-4) : Authentification & Produits
✅ Système authentification (register, login, profile)  
✅ CRUD produits (backend)  
✅ CRUD catégories (backend)  
✅ Pages produits (frontend)  
✅ Système de filtres (catégorie, prix)  
✅ Page détail produit  
✅ Upload images multiples

### Phase 3 (Semaine 5) : Panier & WhatsApp
✅ Store Pinia panier (localStorage)  
✅ Add to cart (avec variantes)  
✅ Page panier  
✅ Composable WhatsApp (formatage message)  
✅ Page checkout (formulaire livraison)  
✅ Création commande + redirection WhatsApp

### Phase 4 (Semaine 6) : Admin & Finitions
✅ Django Admin personnalisé (produits, commandes)  
✅ Gestion des commandes (changement statut)  
✅ Historique commandes utilisateur  
✅ Responsive design (mobile-first)  
✅ Optimisation images  
✅ Tests basiques

### Phase 5 (Semaine 7) : Déploiement
✅ Backend sur VPS (Gunicorn + Nginx)  
✅ Frontend sur Vercel/Netlify  
✅ Configuration domaine  
✅ SSL (Let's Encrypt)  
✅ Variables d'environnement production

---

## 🚀 Récapitulatif Final

### Backend Django
**Rôle** : API REST pour gérer les données  
**Apps** : accounts, products, orders, cart (optionnel)  
**Features** :
- Authentification JWT
- CRUD produits/catégories
- Gestion commandes
- Django Admin pour gestion contenu

### Frontend Nuxt 4
**Rôle** : Interface utilisateur  
**Features** :
- Bootstrap 5 (design simple et pro)
- Panier géré avec Pinia (localStorage)
- Formulaire checkout
- Redirection WhatsApp automatique
- Espace client (profil, historique)

### Processus Commande
**Simplifié** : Pas de paiement en ligne  
**Flow** : Panier → Checkout → WhatsApp Business  
**Confirmation** : Manuelle via WhatsApp  
**Gestion** : Statuts dans Django Admin

---

## 📝 Packages Essentiels

### Backend (requirements.txt)
```txt
Django==5.0.1
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.1
django-cors-headers==4.3.1
Pillow==10.2.0
python-decouple==3.8
psycopg2-binary==2.9.9  # PostgreSQL
gunicorn==21.2.0        # Production
```

### Frontend (package.json)
```json
{
  "dependencies": {
    "nuxt": "^4.0.0",
    "vue": "^3.4.0",
    "bootstrap": "^5.3.0",
    "bootstrap-vue-next": "^0.15.0",
    "@pinia/nuxt": "^0.5.1",
    "pinia": "^2.1.7"
  }
}
```

---

## ⏱️ Timeline

- **Total** : 7 semaines pour un MVP fonctionnel
- **Complexité** : Moyenne (projet bien cadré)
- **Maintenance** : Facile (technologies standards)
