#!/bin/bash

# Script pour appliquer les migrations et repeupler la base de données

echo "🔧 Activation de l'environnement virtuel..."
source venv/bin/activate

echo "📝 Création de la migration pour le champ image_url..."
python manage.py makemigrations products

echo "✅ Application de la migration..."
python manage.py migrate

echo "🗑️  Suppression des anciennes données (optionnel)..."
python manage.py shell << EOF
from apps.products.models import ProductVariant, ProductImage, Product
ProductVariant.objects.all().delete()
ProductImage.objects.all().delete()
Product.objects.all().delete()
print("✓ Anciennes données supprimées")
exit()
EOF

echo "📦 Repeuplement de la base de données avec les nouvelles images..."
python manage.py populate_products

echo "✅ Terminé ! Redémarrez le serveur Django si nécessaire."
