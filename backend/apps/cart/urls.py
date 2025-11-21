from django.urls import path
from .views import CartViewSet, CartItemViewSet

urlpatterns = [
    # Récupérer le panier
    path('', CartViewSet.as_view({'get': 'retrieve'}), name='cart-detail'),
    
    # Actions personnalisées du panier
    path('add-item/', CartViewSet.as_view({'post': 'add_item'}), name='cart-add-item'),
    path('clear/', CartViewSet.as_view({'delete': 'clear'}), name='cart-clear'),
    path('sync/', CartViewSet.as_view({'post': 'sync'}), name='cart-sync'),
    
    # Items du panier (CRUD)
    path('items/<int:pk>/', CartItemViewSet.as_view({'patch': 'partial_update', 'delete': 'destroy'}), name='cart-item-detail'),
]
