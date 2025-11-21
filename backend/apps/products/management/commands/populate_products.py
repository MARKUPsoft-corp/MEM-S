from django.core.management.base import BaseCommand
from apps.products.models import Category, Product, ProductImage, ProductVariant


class Command(BaseCommand):
    help = 'Peuple la base de données avec les produits MEM\'S'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Supprime toutes les données existantes avant de peupler',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('Suppression des données existantes...')
            ProductVariant.objects.all().delete()
            ProductImage.objects.all().delete()
            Product.objects.all().delete()
            Category.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('✓ Données supprimées'))

        self.stdout.write('Création des catégories...')
        self.create_categories()
        self.stdout.write(self.style.SUCCESS('✓ 12 catégories créées'))

        self.stdout.write('Création des produits...')
        self.create_products()
        self.stdout.write(self.style.SUCCESS('✓ 93 produits créés avec images et variantes'))

        self.stdout.write(self.style.SUCCESS('\n✅ Peuplement terminé avec succès!'))

    def create_categories(self):
        """Crée les 12 catégories"""
        categories_data = [
            {'name': 'Boubous', 'slug': 'boubous', 'order': 1, 'collection_type': 'men'},
            {'name': 'Gandouras', 'slug': 'gandouras', 'order': 2, 'collection_type': 'men'},
            {'name': 'Costumes', 'slug': 'costumes', 'order': 3, 'collection_type': 'men'},
            {'name': 'Chemises', 'slug': 'chemises', 'order': 4, 'collection_type': 'men'},
            {'name': 'Pantalons', 'slug': 'pantalons', 'order': 5, 'collection_type': 'men'},
            {'name': 'Robes', 'slug': 'robes', 'order': 6, 'collection_type': 'women'},
            {'name': 'Ensembles', 'slug': 'ensembles', 'order': 7, 'collection_type': 'women'},
            {'name': 'Sacs', 'slug': 'sacs', 'order': 8, 'collection_type': 'women'},
            {'name': 'Chemises Lin', 'slug': 'chemises-lin', 'order': 9, 'collection_type': 'lins'},
            {'name': 'Pantalons Lin', 'slug': 'pantalons-lin', 'order': 10, 'collection_type': 'lins'},
            {'name': 'Babouches Cuir', 'slug': 'babouches-cuir', 'order': 11, 'collection_type': 'babouches'},
            {'name': 'Babouches Brodées', 'slug': 'babouches-brodees', 'order': 12, 'collection_type': 'babouches'},
        ]

        for cat_data in categories_data:
            Category.objects.create(**cat_data)

    def create_products(self):
        """Crée tous les produits avec images et variantes"""
        
        # Récupérer les catégories
        boubous = Category.objects.get(slug='boubous')
        gandouras = Category.objects.get(slug='gandouras')
        costumes = Category.objects.get(slug='costumes')
        chemises = Category.objects.get(slug='chemises')
        pantalons = Category.objects.get(slug='pantalons')
        robes = Category.objects.get(slug='robes')
        ensembles = Category.objects.get(slug='ensembles')
        sacs = Category.objects.get(slug='sacs')
        chemises_lin = Category.objects.get(slug='chemises-lin')
        pantalons_lin = Category.objects.get(slug='pantalons-lin')
        babouches_cuir = Category.objects.get(slug='babouches-cuir')
        babouches_brodees = Category.objects.get(slug='babouches-brodees')

        # Boubous (12 produits)
        for i in range(1, 13):
            product = Product.objects.create(
                name=f'Boubou Traditionnel {i}',
                slug=f'boubou-traditionnel-{i}',
                description=f'Magnifique boubou traditionnel africain {i}, confectionné avec des tissus de haute qualité. Parfait pour les occasions spéciales.',
                category=boubous,
                price=45000 + (i * 5000),
                discount_price=40000 + (i * 4000) if i % 3 == 0 else None,
                is_new=i <= 6,
                is_featured=i <= 2,
                stock=10
            )
            # Images
            ProductImage.objects.create(product=product, image=f'https://images.unsplash.com/photo-{1617127365659 + i}?w=800&h=1000&fit=crop&q=80', is_primary=True, order=1)
            ProductImage.objects.create(product=product, image=f'https://images.unsplash.com/photo-{1622445275463 + i}?w=800&h=1000&fit=crop&q=80', is_primary=False, order=2)
            # Variantes
            ProductVariant.objects.create(product=product, size='M', color='Noir', sku=f'BOU-{i}-M', stock=5)
            ProductVariant.objects.create(product=product, size='L', color='Noir', sku=f'BOU-{i}-L', stock=3)
            ProductVariant.objects.create(product=product, size='XL', color='Noir', sku=f'BOU-{i}-XL', stock=2)

        # Gandouras (8 produits)
        for i in range(1, 9):
            product = Product.objects.create(
                name=f'Gandoura Élégante {i}',
                slug=f'gandoura-elegante-{i}',
                description=f'Gandoura élégante {i} pour homme, style moderne et traditionnel. Confort et élégance garantis.',
                category=gandouras,
                price=35000 + (i * 3000),
                discount_price=30000 + (i * 2500) if i % 2 == 0 else None,
                is_new=i <= 4,
                is_featured=i == 1 or i == 4,
                stock=8
            )
            ProductImage.objects.create(product=product, image=f'https://images.unsplash.com/photo-{1617127365659 + i + 12}?w=800&h=1000&fit=crop&q=80', is_primary=True, order=1)
            ProductVariant.objects.create(product=product, size='M', color='Beige', sku=f'GAN-{i}-M', stock=4)
            ProductVariant.objects.create(product=product, size='L', color='Beige', sku=f'GAN-{i}-L', stock=4)

        # Costumes (6 produits)
        for i in range(1, 7):
            product = Product.objects.create(
                name=f'Costume Moderne {i}',
                slug=f'costume-moderne-{i}',
                description=f'Costume moderne {i} pour homme d\'affaires. Coupe impeccable et finitions soignées.',
                category=costumes,
                price=95000 + (i * 8000),
                discount_price=85000 + (i * 7000) if i % 2 == 0 else None,
                is_new=i <= 3,
                is_featured=i == 2,
                stock=5
            )
            ProductImage.objects.create(product=product, image=f'https://images.unsplash.com/photo-{1617127365659 + i + 20}?w=800&h=1000&fit=crop&q=80', is_primary=True, order=1)
            ProductVariant.objects.create(product=product, size='M', color='Noir', sku=f'COS-{i}-M', stock=2)
            ProductVariant.objects.create(product=product, size='L', color='Noir', sku=f'COS-{i}-L', stock=3)

        # Chemises Hommes (8 produits)
        for i in range(1, 9):
            product = Product.objects.create(
                name=f'Chemise Africaine {i}',
                slug=f'chemise-africaine-{i}',
                description=f'Chemise africaine {i} pour homme. Motifs traditionnels et coupe moderne.',
                category=chemises,
                price=25000 + (i * 2000),
                discount_price=22000 + (i * 1500) if i % 3 == 0 else None,
                is_new=i <= 4,
                is_featured=i == 3,
                stock=12
            )
            ProductImage.objects.create(product=product, image=f'https://images.unsplash.com/photo-{1617127365659 + i + 26}?w=800&h=1000&fit=crop&q=80', is_primary=True, order=1)
            ProductVariant.objects.create(product=product, size='M', color='Blanc', sku=f'CHE-{i}-M', stock=6)
            ProductVariant.objects.create(product=product, size='L', color='Blanc', sku=f'CHE-{i}-L', stock=6)

        # Pantalons Hommes (6 produits)
        for i in range(1, 7):
            product = Product.objects.create(
                name=f'Pantalon Traditionnel {i}',
                slug=f'pantalon-traditionnel-{i}',
                description=f'Pantalon traditionnel {i} pour homme. Confortable et élégant.',
                category=pantalons,
                price=30000 + (i * 3000),
                discount_price=27000 + (i * 2500) if i % 2 == 0 else None,
                is_new=i <= 3,
                is_featured=False,
                stock=10
            )
            ProductImage.objects.create(product=product, image=f'https://images.unsplash.com/photo-{1617127365659 + i + 34}?w=800&h=1000&fit=crop&q=80', is_primary=True, order=1)
            ProductVariant.objects.create(product=product, size='M', color='Noir', sku=f'PAN-{i}-M', stock=5)
            ProductVariant.objects.create(product=product, size='L', color='Noir', sku=f'PAN-{i}-L', stock=5)

        # Robes (10 produits)
        for i in range(1, 11):
            product = Product.objects.create(
                name=f'Robe Africaine {i}',
                slug=f'robe-africaine-{i}',
                description=f'Robe africaine {i} pour femme. Design authentique et moderne.',
                category=robes,
                price=55000 + (i * 4000),
                discount_price=50000 + (i * 3500) if i % 3 == 0 else None,
                is_new=i <= 5,
                is_featured=i == 1 or i == 5,
                stock=8
            )
            ProductImage.objects.create(product=product, image=f'https://images.unsplash.com/photo-{1617127365659 + i + 40}?w=800&h=1000&fit=crop&q=80', is_primary=True, order=1)
            ProductVariant.objects.create(product=product, size='S', color='Rouge', sku=f'ROB-{i}-S', stock=4)
            ProductVariant.objects.create(product=product, size='M', color='Rouge', sku=f'ROB-{i}-M', stock=4)

        # Ensembles (8 produits)
        for i in range(1, 9):
            product = Product.objects.create(
                name=f'Ensemble Élégant {i}',
                slug=f'ensemble-elegant-{i}',
                description=f'Ensemble élégant {i} pour femme. Coordination parfaite.',
                category=ensembles,
                price=75000 + (i * 5000),
                discount_price=68000 + (i * 4500) if i % 2 == 0 else None,
                is_new=i <= 4,
                is_featured=i == 2,
                stock=6
            )
            ProductImage.objects.create(product=product, image=f'https://images.unsplash.com/photo-{1617127365659 + i + 50}?w=800&h=1000&fit=crop&q=80', is_primary=True, order=1)
            ProductVariant.objects.create(product=product, size='M', color='Bleu', sku=f'ENS-{i}-M', stock=3)
            ProductVariant.objects.create(product=product, size='L', color='Bleu', sku=f'ENS-{i}-L', stock=3)

        # Sacs & Accessoires (6 produits)
        for i in range(1, 7):
            product = Product.objects.create(
                name=f'Sac Traditionnel {i}',
                slug=f'sac-traditionnel-{i}',
                description=f'Sac traditionnel {i} fait main. Artisanat de qualité.',
                category=sacs,
                price=15000 + (i * 2000),
                discount_price=12000 + (i * 1500) if i % 3 == 0 else None,
                is_new=i <= 3,
                is_featured=i == 3,
                stock=15
            )
            ProductImage.objects.create(product=product, image=f'https://images.unsplash.com/photo-{1617127365659 + i + 58}?w=800&h=1000&fit=crop&q=80', is_primary=True, order=1)

        # Chemises en Lin (8 produits)
        for i in range(1, 9):
            product = Product.objects.create(
                name=f'Chemise Lin {i}',
                slug=f'chemise-lin-{i}',
                description=f'Chemise en lin {i} naturel et respirant. Parfait pour l\'été.',
                category=chemises_lin,
                price=35000 + (i * 3000),
                discount_price=32000 + (i * 2500) if i % 2 == 0 else None,
                is_new=i <= 4,
                is_featured=i == 1 or i == 4,
                stock=10
            )
            ProductImage.objects.create(product=product, image=f'https://images.unsplash.com/photo-{1617127365659 + i + 64}?w=800&h=1000&fit=crop&q=80', is_primary=True, order=1)
            ProductVariant.objects.create(product=product, size='M', color='Beige', sku=f'LIN-CHE-{i}-M', stock=5)
            ProductVariant.objects.create(product=product, size='L', color='Beige', sku=f'LIN-CHE-{i}-L', stock=5)

        # Pantalons en Lin (6 produits)
        for i in range(1, 7):
            product = Product.objects.create(
                name=f'Pantalon Lin {i}',
                slug=f'pantalon-lin-{i}',
                description=f'Pantalon en lin {i} confortable et élégant.',
                category=pantalons_lin,
                price=40000 + (i * 4000),
                discount_price=36000 + (i * 3500) if i % 3 == 0 else None,
                is_new=i <= 3,
                is_featured=i == 2,
                stock=8
            )
            ProductImage.objects.create(product=product, image=f'https://images.unsplash.com/photo-{1617127365659 + i + 72}?w=800&h=1000&fit=crop&q=80', is_primary=True, order=1)
            ProductVariant.objects.create(product=product, size='M', color='Blanc', sku=f'LIN-PAN-{i}-M', stock=4)
            ProductVariant.objects.create(product=product, size='L', color='Blanc', sku=f'LIN-PAN-{i}-L', stock=4)

        # Babouches en Cuir (8 produits)
        for i in range(1, 9):
            product = Product.objects.create(
                name=f'Babouche Cuir {i}',
                slug=f'babouche-cuir-{i}',
                description=f'Babouche en cuir {i} artisanale. Confort et style.',
                category=babouches_cuir,
                price=25000 + (i * 2000),
                discount_price=22000 + (i * 1500) if i % 2 == 0 else None,
                is_new=i <= 4,
                is_featured=i == 1 or i == 3,
                stock=12
            )
            ProductImage.objects.create(product=product, image=f'https://images.unsplash.com/photo-{1617127365659 + i + 78}?w=800&h=1000&fit=crop&q=80', is_primary=True, order=1)
            ProductVariant.objects.create(product=product, size='40', color='Marron', sku=f'BAB-CUI-{i}-40', stock=6)
            ProductVariant.objects.create(product=product, size='42', color='Marron', sku=f'BAB-CUI-{i}-42', stock=6)

        # Babouches Brodées (6 produits)
        for i in range(1, 7):
            product = Product.objects.create(
                name=f'Babouche Brodée {i}',
                slug=f'babouche-brodee-{i}',
                description=f'Babouche brodée {i} fait main. Élégance artisanale.',
                category=babouches_brodees,
                price=30000 + (i * 3000),
                discount_price=27000 + (i * 2500) if i % 3 == 0 else None,
                is_new=i <= 3,
                is_featured=i == 2,
                stock=10
            )
            ProductImage.objects.create(product=product, image=f'https://images.unsplash.com/photo-{1617127365659 + i + 86}?w=800&h=1000&fit=crop&q=80', is_primary=True, order=1)
            ProductVariant.objects.create(product=product, size='39', color='Or', sku=f'BAB-BRO-{i}-39', stock=5)
            ProductVariant.objects.create(product=product, size='41', color='Or', sku=f'BAB-BRO-{i}-41', stock=5)
