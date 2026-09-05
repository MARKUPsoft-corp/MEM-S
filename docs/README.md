# MEM'S - E-commerce Platform

![MEM'S Logo](https://img.shields.io/badge/MEM'S-E--commerce-C9A46C?style=for-the-badge)
![Nuxt 4](https://img.shields.io/badge/Nuxt-4.x-00DC82?style=for-the-badge&logo=nuxt.js)
![Django](https://img.shields.io/badge/Django-5.x-092E20?style=for-the-badge&logo=django)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

Plateforme e-commerce moderne pour vêtements d'inspiration africaine, alliant élégance intemporelle et authenticité culturelle.

## 🌟 Aperçu du Projet

MEM'S est une boutique en ligne spécialisée dans les vêtements traditionnels africains et contemporains :
- **Boubous** et **Gandouras** pour hommes
- **Robes africaines** et **Sacs** pour femmes
- **Babouches** artisanales
- Collection **Lin** naturel

### Caractéristiques Principales

✨ **Design Élégant** - Interface moderne avec palette de couleurs inspirée de l'Afrique  
🛒 **Panier Intelligent** - Gestion du panier avec localStorage  
📱 **Mobile First** - Expérience optimisée pour tous les appareils  
💬 **Commande WhatsApp** - Validation des commandes via WhatsApp Business  
🎨 **Charte Graphique** - Identité visuelle cohérente et professionnelle  

## 🏗️ Architecture

```
MEM-S/
├── frontend/          # Application Nuxt 4 (Vue 3)
│   ├── app/
│   │   ├── components/    # Composants Vue réutilisables
│   │   ├── layouts/       # Layouts de page
│   │   └── pages/         # Pages de l'application
│   ├── stores/            # Stores Pinia (state management)
│   ├── types/             # Types TypeScript
│   └── assets/            # Assets (CSS, images)
│
├── backend/           # API Django REST Framework (à développer)
│   └── backend.txt        # Structure planifiée
│
└── PROJECT_OVERVIEW.md    # Documentation détaillée
```

## 🚀 Installation

### Prérequis

- **Node.js** 18.x ou supérieur
- **npm** ou **yarn**
- **Python** 3.10+ (pour le backend)
- **PostgreSQL** (pour la production)

### Frontend (Nuxt 4)

```bash
# Naviguer vers le dossier frontend
cd frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour la production
npm run build

# Prévisualiser le build
npm run preview
```

L'application sera disponible sur `http://localhost:3000`

### Backend (Django - À venir)

```bash
# Naviguer vers le dossier backend
cd backend

# Créer un environnement virtuel
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows

# Installer les dépendances
pip install -r requirements.txt

# Lancer les migrations
python manage.py migrate

# Créer un superutilisateur
python manage.py createsuperuser

# Lancer le serveur
python manage.py runserver
```

## 🎨 Palette de Couleurs

La charte graphique MEM'S utilise des couleurs inspirées de l'Afrique :

| Couleur | Hex | Usage |
|---------|-----|-------|
| **Noir Profond** | `#0B0B0B` | Couleur primaire, textes |
| **Or Brossé** | `#C9A46C` | Accents luxe, boutons CTA |
| **Ivoire** | `#F5F2EC` | Backgrounds clairs |
| **Vert Ébène** | `#0E3A34` | Accent Afrique, menu |
| **Terracotta** | `#A14E36` | Accent terreux, promotions |
| **Gris Anthracite** | `#2A2A2A` | Textes secondaires |

Voir [CHARTE_GRAPHIQUE.md](frontend/CHARTE_GRAPHIQUE.md) pour plus de détails.

## 📱 Fonctionnalités

### Frontend Implémenté

- ✅ **Hero Section** - Carousel avec produits vedettes
- ✅ **Categories Section** - Navigation par collections
- ✅ **New Arrivals** - Nouveautés avec filtres par catégorie
- ✅ **Product Card** - Cartes produits avec galerie d'images
- ✅ **Sidebar Mobile** - Menu latéral responsive avec recherche
- ✅ **Navbar** - Navigation principale avec panier
- ✅ **State Management** - Pinia stores (auth, cart, products)
- ✅ **TypeScript** - Typage complet de l'application

### Backend (Planifié)

- ⏳ Authentification JWT
- ⏳ API REST (produits, catégories, commandes)
- ⏳ Gestion des utilisateurs
- ⏳ Upload d'images
- ⏳ Django Admin personnalisé
- ⏳ Intégration WhatsApp Business

## 🛠️ Technologies Utilisées

### Frontend
- **Nuxt 4** - Framework Vue.js avec SSR
- **Vue 3** - Framework JavaScript progressif
- **Pinia** - State management moderne
- **TypeScript** - Typage statique
- **Bootstrap 5** - Framework CSS
- **Bootstrap Icons** - Bibliothèque d'icônes

### Backend (Planifié)
- **Django 5.x** - Framework Python
- **Django REST Framework** - API REST
- **PostgreSQL** - Base de données
- **JWT** - Authentification
- **Pillow** - Traitement d'images

## 📖 Documentation

- [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) - Vue d'ensemble complète du projet
- [CHARTE_GRAPHIQUE.md](frontend/CHARTE_GRAPHIQUE.md) - Guide de la charte graphique
- [STRUCTURE_PAGE_ACCUEIL.md](frontend/STRUCTURE_PAGE_ACCUEIL.md) - Structure de la page d'accueil
- [GUIDE_IMAGES.md](frontend/GUIDE_IMAGES.md) - Guide d'utilisation des images
- [HARMONISATION_COULEURS.md](frontend/HARMONISATION_COULEURS.md) - Harmonisation des couleurs

## 🔄 Workflow de Commande

```
1. Client parcourt les produits
   ↓
2. Ajoute au panier (avec variantes)
   ↓
3. Vérifie le panier
   ↓
4. Remplit le formulaire de livraison
   ↓
5. Clique "Commander via WhatsApp"
   ↓
6. Redirection automatique vers WhatsApp Business
   ↓
7. Confirmation manuelle par le vendeur
```

## 🌐 Variables d'Environnement

### Frontend (.env)

```env
NUXT_PUBLIC_API_BASE=http://localhost:8000/api
NUXT_PUBLIC_WHATSAPP_NUMBER=237XXXXXXXXX
```

### Backend (.env)

```env
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:password@localhost:5432/mems_db
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

## 🚢 Déploiement

### Frontend (Vercel/Netlify)

```bash
# Build
npm run build

# Déployer sur Vercel
vercel --prod

# Ou sur Netlify
netlify deploy --prod
```

### Backend (VPS/Heroku)

```bash
# Collecter les fichiers statiques
python manage.py collectstatic

# Lancer avec Gunicorn
gunicorn config.wsgi:application
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Roadmap

### Phase 1 - MVP (En cours)
- [x] Setup Frontend Nuxt 4
- [x] Design System & Charte Graphique
- [x] Composants de base
- [x] State Management
- [ ] Intégration API Backend

### Phase 2 - Backend
- [ ] Setup Django + DRF
- [ ] Authentification JWT
- [ ] API Produits & Catégories
- [ ] Gestion des commandes
- [ ] Django Admin

### Phase 3 - Fonctionnalités Avancées
- [ ] Recherche avancée
- [ ] Filtres produits
- [ ] Wishlist
- [ ] Historique des commandes
- [ ] Notifications

### Phase 4 - Production
- [ ] Tests unitaires & E2E
- [ ] Optimisation performances
- [ ] SEO
- [ ] Déploiement
- [ ] Monitoring

## 📄 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 Équipe

**MARKUPsoft Corp** - Développement et Design

## 📞 Contact

- **Email**: contact@markupsoft.com
- **WhatsApp Business**: +237 XXX XXX XXX
- **GitHub**: [@MARKUPsoft-corp](https://github.com/MARKUPsoft-corp)

---

<div align="center">
  <p>Fait avec ❤️ par MARKUPsoft Corp</p>
  <p>© 2025 MEM'S - Tous droits réservés</p>
</div>
