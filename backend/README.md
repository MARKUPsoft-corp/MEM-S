# Backend Django - MEM'S

Backend API REST pour la plateforme e-commerce MEM'S.

## Configuration de l'environnement

### Prérequis
- Python 3.10+
- PostgreSQL (pour la production)

### Installation

1. Créer et activer l'environnement virtuel :
```bash
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows
```

2. Installer les dépendances :
```bash
pip install -r requirements.txt
```

3. Créer un fichier `.env` à la racine du dossier backend :
```env
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///db.sqlite3
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

4. Appliquer les migrations :
```bash
python manage.py migrate
```

5. Créer un superutilisateur :
```bash
python manage.py createsuperuser
```

6. Lancer le serveur de développement :
```bash
python manage.py runserver
```

## Structure du projet

```
backend/
├── config/              # Configuration Django
├── apps/                # Applications Django (à créer)
│   ├── accounts/        # Gestion utilisateurs
│   ├── products/        # Gestion produits
│   ├── orders/          # Gestion commandes
│   └── cart/            # Panier (optionnel)
├── media/               # Fichiers uploadés
├── static/              # Fichiers statiques
├── venv/                # Environnement virtuel
├── manage.py
└── requirements.txt
```

## Prochaines étapes

1. Créer les applications Django (accounts, products, orders)
2. Définir les modèles de données
3. Configurer l'authentification JWT
4. Créer les endpoints API
5. Configurer CORS pour le frontend
