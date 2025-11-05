# MEM'S - Frontend

Frontend de l'application e-commerce MEM'S construit avec Nuxt 4.

## Technologies

- **Nuxt 4** - Framework Vue.js
- **Bootstrap 5** - Framework CSS
- **Pinia** - State Management
- **TypeScript** - Typage statique

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:3000`

## Build Production

```bash
npm run build
npm run preview
```

## Structure du projet

```
frontend/
├── app/
│   ├── layouts/          # Layouts (default, empty)
│   └── pages/            # Pages de l'application
├── assets/
│   └── css/              # Styles personnalisés
├── components/           # Composants Vue réutilisables
├── composables/          # Composables (logique réutilisable)
├── stores/               # Stores Pinia
├── types/                # Types TypeScript
├── utils/                # Utilitaires
└── plugins/              # Plugins Nuxt
```

## Variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
NUXT_PUBLIC_API_BASE=http://localhost:8000/api
NUXT_PUBLIC_WHATSAPP_NUMBER=237XXXXXXXXX
```

## Fonctionnalités

- ✅ Authentification JWT
- ✅ Gestion du panier (localStorage)
- ✅ Catalogue de produits
- ✅ Commande via WhatsApp
- ✅ Espace client
- ✅ Responsive design

## Commandes utiles

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour la production
npm run build

# Prévisualiser le build de production
npm run preview

# Générer le site statique
npm run generate
```
