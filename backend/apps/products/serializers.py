from rest_framework import serializers
# Force reload
from .models import Collection, Category, Product, ProductImage, ProductVariant, AttributeValue


class CollectionSerializer(serializers.ModelSerializer):
    """Serializer pour les collections"""
    
    class Meta:
        model = Collection
        fields = ['id', 'name', 'slug', 'description', 'image', 'order']


class CategorySerializer(serializers.ModelSerializer):
    """Serializer pour les catégories"""
    
    collection = CollectionSerializer(read_only=True)
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'image', 'order', 'collection']


class ProductImageSerializer(serializers.ModelSerializer):
    """Serializer pour les images de produits"""
    
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_primary', 'order']
    
    def get_image(self, obj):
        """Retourne l'URL de l'image (externe ou locale)"""
        image_url = obj.get_image_url
        
        # Si c'est une URL relative (commence par /), ajouter le domaine
        if image_url and image_url.startswith('/'):
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(image_url)
        
        return image_url


class AttributeValueSerializer(serializers.ModelSerializer):
    """Serializer pour les valeurs d'attributs"""
    
    name = serializers.CharField(source='attribute.name', read_only=True)
    slug = serializers.CharField(source='attribute.slug', read_only=True)
    
    class Meta:
        model = AttributeValue
        fields = ['name', 'slug', 'value']


class ProductVariantSerializer(serializers.ModelSerializer):
    """Serializer pour les variantes de produits"""
    
    attributes = AttributeValueSerializer(many=True, read_only=True)
    
    class Meta:
        model = ProductVariant
        fields = ['id', 'attributes', 'sku', 'stock']


class ProductListSerializer(serializers.ModelSerializer):
    """Serializer pour la liste des produits (optimisé)"""
    
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'category',
            'price', 'discount_price', 'is_new', 'is_featured',
            'stock', 'images', 'created_at'
        ]


class ProductDetailSerializer(serializers.ModelSerializer):
    """Serializer pour le détail d'un produit"""
    
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'category',
            'price', 'discount_price', 'is_new', 'is_featured',
            'stock', 'images', 'variants', 'created_at', 'updated_at'
        ]
