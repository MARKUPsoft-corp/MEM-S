from rest_framework import serializers
from .models import Category, Product, ProductImage, ProductVariant


class CategorySerializer(serializers.ModelSerializer):
    """Serializer pour les catégories"""
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'image', 'order', 'collection_type']


class ProductImageSerializer(serializers.ModelSerializer):
    """Serializer pour les images de produits"""
    
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_primary', 'order']


class ProductVariantSerializer(serializers.ModelSerializer):
    """Serializer pour les variantes de produits"""
    
    class Meta:
        model = ProductVariant
        fields = ['id', 'size', 'color', 'sku', 'stock']


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
