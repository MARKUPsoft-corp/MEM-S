from rest_framework import serializers
from .models import Cart, CartItem
from apps.products.serializers import ProductListSerializer, ProductVariantSerializer


class CartItemSerializer(serializers.ModelSerializer):
    """Serializer pour les articles du panier"""
    
    product = ProductListSerializer(read_only=True)
    variant = ProductVariantSerializer(read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'variant', 'quantity', 'price', 'total_price', 'created_at', 'updated_at']
        read_only_fields = ['price', 'created_at', 'updated_at']


class CartSerializer(serializers.ModelSerializer):
    """Serializer pour le panier complet"""
    
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.IntegerField(read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'total_items', 'subtotal', 'total', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']


class AddToCartSerializer(serializers.Serializer):
    """Serializer pour ajouter un article au panier"""
    
    product_id = serializers.IntegerField()
    variant_id = serializers.IntegerField(required=False, allow_null=True)
    quantity = serializers.IntegerField(min_value=1, default=1)


class UpdateCartItemSerializer(serializers.Serializer):
    """Serializer pour modifier la quantité d'un article"""
    
    quantity = serializers.IntegerField(min_value=1)


class SyncCartSerializer(serializers.Serializer):
    """Serializer pour synchroniser le panier localStorage"""
    
    items = serializers.ListField(
        child=serializers.DictField(),
        allow_empty=True
    )
    
    def validate_items(self, value):
        """Valider la structure des items"""
        for item in value:
            if 'product_id' not in item:
                raise serializers.ValidationError("Chaque item doit avoir un product_id")
            if 'quantity' not in item:
                raise serializers.ValidationError("Chaque item doit avoir une quantity")
            if item['quantity'] < 1:
                raise serializers.ValidationError("La quantité doit être supérieure à 0")
        return value
