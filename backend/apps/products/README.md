# Products API - MEM'S

API REST pour la gestion des produits de la plateforme e-commerce MEM'S.

## 📋 Vue d'ensemble

Cette API permet de gérer un catalogue de 93 produits répartis en 12 catégories organisées en 4 collections principales :
- **Hommes** : Boubous, Gandouras, Costumes, Chemises, Pantalons
- **Femmes** : Robes, Ensembles, Sacs
- **Babouches** : Babouches Cuir, Babouches Brodées
- **Lins** : Chemises Lin, Pantalons Lin

## 🚀 Endpoints Disponibles

### Catégories

#### Liste des catégories
```http
GET /api/categories/
```

**Réponse:**
```json
[
  {
    "id": 1,
    "name": "Boubous",
    "slug": "boubous",
    "image": null,
    "order": 1,
    "collection_type": "men"
  }
]
```

#### Catégories groupées par collection
```http
GET /api/categories/by_collection/
```

**Réponse:**
```json
{
  "men": [...],
  "women": [...],
  "babouches": [...],
  "lins": [...]
}
```

#### Détail d'une catégorie
```http
GET /api/categories/{slug}/
```

### Produits

#### Liste des produits (paginée)
```http
GET /api/products/
```

**Paramètres de requête:**
- `category` : Filtrer par slug de catégorie (ex: `boubous`)
- `collection` : Filtrer par type de collection (ex: `men`)
- `min_price` : Prix minimum
- `max_price` : Prix maximum
- `is_new` : Nouveaux produits uniquement (`true`/`false`)
- `is_featured` : Produits en vedette uniquement (`true`/`false`)
- `search` : Recherche dans nom et description
- `ordering` : Tri (`price`, `-price`, `created_at`, `-created_at`, `name`, `-name`)
- `page` : Numéro de page (pagination)

**Exemples:**
```http
GET /api/products/?category=boubous
GET /api/products/?collection=men&is_new=true
GET /api/products/?min_price=30000&max_price=50000
GET /api/products/?search=boubou&ordering=-created_at
```

**Réponse:**
```json
{
  "count": 93,
  "next": "http://localhost:8000/api/products/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Boubou Traditionnel 1",
      "slug": "boubou-traditionnel-1",
      "description": "Magnifique boubou traditionnel africain...",
      "category": {
        "id": 1,
        "name": "Boubous",
        "slug": "boubous",
        "order": 1,
        "collection_type": "men"
      },
      "price": "45000.00",
      "discount_price": null,
      "is_new": true,
      "is_featured": true,
      "stock": 10,
      "images": [
        {
          "id": 1,
          "image": "https://images.unsplash.com/photo-...",
          "is_primary": true,
          "order": 1
        }
      ],
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

#### Détail d'un produit
```http
GET /api/products/{slug}/
```

**Réponse:**
```json
{
  "id": 1,
  "name": "Boubou Traditionnel 1",
  "slug": "boubou-traditionnel-1",
  "description": "Magnifique boubou traditionnel africain...",
  "category": {...},
  "price": "45000.00",
  "discount_price": null,
  "is_new": true,
  "is_featured": true,
  "stock": 10,
  "images": [...],
  "variants": [
    {
      "id": 1,
      "size": "M",
      "color": "Noir",
      "sku": "BOU-1-M",
      "stock": 5
    }
  ],
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

#### Produits en vedette
```http
GET /api/products/featured/
```

Retourne les 6 produits marqués comme `is_featured=True`.

#### Nouveaux produits
```http
GET /api/products/new_arrivals/
```

Retourne les 6 produits marqués comme `is_new=True`.

## 📊 Structure des Données

### Modèles

#### Category
- `id` : Identifiant unique
- `name` : Nom de la catégorie
- `slug` : Slug URL-friendly (unique)
- `image` : Image de la catégorie (optionnel)
- `order` : Ordre d'affichage
- `collection_type` : Type de collection (`men`, `women`, `babouches`, `lins`)

#### Product
- `id` : Identifiant unique
- `name` : Nom du produit
- `slug` : Slug URL-friendly (unique)
- `description` : Description détaillée
- `category` : Relation vers Category
- `price` : Prix en FCFA
- `discount_price` : Prix promotionnel (optionnel)
- `is_new` : Nouveau produit (boolean)
- `is_featured` : Produit en vedette (boolean)
- `stock` : Stock disponible
- `created_at` : Date de création
- `updated_at` : Date de mise à jour

#### ProductImage
- `id` : Identifiant unique
- `product` : Relation vers Product
- `image` : URL de l'image
- `is_primary` : Image principale (boolean)
- `order` : Ordre d'affichage

#### ProductVariant
- `id` : Identifiant unique
- `product` : Relation vers Product
- `size` : Taille (M, L, XL, etc.)
- `color` : Couleur
- `sku` : Code SKU (unique)
- `stock` : Stock de la variante

## 🔧 Commandes de Gestion

### Peupler la base de données
```bash
python manage.py populate_products --clear
```

Options:
- `--clear` : Supprime toutes les données existantes avant de peupler

### Créer un superutilisateur
```bash
python manage.py createsuperuser
```

### Accéder à l'admin Django
```
http://localhost:8000/admin/
```

## 📈 Statistiques

- **12 catégories** organisées en 4 collections
- **93 produits** au total :
  - 40 produits Hommes (Boubous: 12, Gandouras: 8, Costumes: 6, Chemises: 8, Pantalons: 6)
  - 24 produits Femmes (Robes: 10, Ensembles: 8, Sacs: 6)
  - 14 produits Babouches (Cuir: 8, Brodées: 6)
  - 14 produits Lins (Chemises: 8, Pantalons: 6)
- **6 produits en vedette**
- **Images multiples** par produit
- **Variantes** (tailles, couleurs) pour la plupart des produits

## 🎯 Optimisations

- **select_related** pour les relations ForeignKey (category)
- **prefetch_related** pour les relations reverse (images, variants)
- **Index** sur les champs fréquemment filtrés
- **Pagination** (20 produits par page)
- **Filtres avancés** avec django-filter

## 🔐 Permissions

- **Lecture** : Publique (tous les endpoints GET)
- **Écriture** : Réservée aux administrateurs (via Django Admin)

## 📝 Notes

- Les images utilisent des URLs Unsplash comme placeholder
- Les prix sont en FCFA (Franc CFA)
- Les slugs sont générés automatiquement à partir des noms
- Les SKU sont uniques pour chaque variante
