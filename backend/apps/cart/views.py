from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db import transaction

from .models import Cart, CartItem
from .serializers import (
    CartSerializer,
    CartItemSerializer,
    AddToCartSerializer,
    UpdateCartItemSerializer,
    SyncCartSerializer
)
from apps.products.models import Product, ProductVariant


class CartViewSet(viewsets.ViewSet):
    """ViewSet pour gérer le panier"""
    
    permission_classes = [IsAuthenticated]
    
    def retrieve(self, request):
        """GET /api/cart/ - Récupérer le panier de l'utilisateur"""
        cart, created = Cart.objects.prefetch_related(
            'items__product__images',
            'items__product__category',
            'items__variant__attributes'
        ).get_or_create(user=request.user)
        
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def add_item(self, request):
        """POST /api/cart/add-item/ - Ajouter un article au panier"""
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        product_id = serializer.validated_data['product_id']
        variant_id = serializer.validated_data.get('variant_id')
        quantity = serializer.validated_data['quantity']
        
        # Vérifier que le produit existe
        product = get_object_or_404(Product, id=product_id)
        
        # Vérifier la variante si spécifiée
        variant = None
        if variant_id:
            variant = get_object_or_404(ProductVariant, id=variant_id, product=product)
        
        # Récupérer ou créer le panier
        cart, _ = Cart.objects.get_or_create(user=request.user)
        
        # Vérifier la limite de 50 articles
        if cart.items.count() >= 50:
            return Response(
                {'error': 'Votre panier est plein (50 articles maximum)', 'code': 'CART_FULL'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Vérifier si l'article existe déjà
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            variant=variant,
            defaults={'quantity': quantity}
        )
        
        if not created:
            # Article existe déjà, additionner les quantités
            cart_item.quantity += quantity
            cart_item.save()
        
        # Recharger le panier avec toutes les relations
        cart = Cart.objects.prefetch_related(
            'items__product__images',
            'items__product__category',
            'items__variant__attributes'
        ).get(id=cart.id)
        
        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['delete'])
    def clear(self, request):
        """DELETE /api/cart/clear/ - Vider le panier"""
        try:
            cart = Cart.objects.get(user=request.user)
            cart.items.all().delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Cart.DoesNotExist:
            return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=['post'])
    def sync(self, request):
        """POST /api/cart/sync/ - Synchroniser le panier localStorage"""
        serializer = SyncCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        items_data = serializer.validated_data['items']
        
        # Récupérer ou créer le panier
        cart, _ = Cart.objects.get_or_create(user=request.user)
        
        with transaction.atomic():
            for item_data in items_data:
                product_id = item_data['product_id']
                variant_id = item_data.get('variant_id')
                quantity = item_data['quantity']
                
                try:
                    product = Product.objects.get(id=product_id)
                except Product.DoesNotExist:
                    continue  # Ignorer les produits qui n'existent plus
                
                variant = None
                if variant_id:
                    try:
                        variant = ProductVariant.objects.get(id=variant_id, product=product)
                    except ProductVariant.DoesNotExist:
                        continue  # Ignorer les variantes invalides
                
                # Créer ou mettre à jour l'article
                cart_item, created = CartItem.objects.get_or_create(
                    cart=cart,
                    product=product,
                    variant=variant,
                    defaults={'quantity': quantity}
                )
                
                if not created:
                    # Article existe déjà, additionner les quantités
                    cart_item.quantity += quantity
                    cart_item.save()
        
        # Recharger le panier avec toutes les relations
        cart = Cart.objects.prefetch_related(
            'items__product__images',
            'items__product__category',
            'items__variant__attributes'
        ).get(id=cart.id)
        
        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CartItemViewSet(viewsets.ModelViewSet):
    """ViewSet pour gérer les articles du panier"""
    
    permission_classes = [IsAuthenticated]
    serializer_class = CartItemSerializer
    http_method_names = ['patch', 'delete']  # Seulement PATCH et DELETE
    
    def get_queryset(self):
        """Filtrer les items par utilisateur"""
        return CartItem.objects.filter(cart__user=self.request.user).select_related(
            'product', 'variant', 'cart'
        ).prefetch_related('product__images', 'variant__attributes')
    
    def partial_update(self, request, *args, **kwargs):
        """PATCH /api/cart/items/{id}/ - Modifier la quantité"""
        serializer = UpdateCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        cart_item = self.get_object()
        cart_item.quantity = serializer.validated_data['quantity']
        cart_item.save()
        
        response_serializer = CartItemSerializer(cart_item)
        return Response(response_serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        """DELETE /api/cart/items/{id}/ - Supprimer un article"""
        cart_item = self.get_object()
        cart_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
