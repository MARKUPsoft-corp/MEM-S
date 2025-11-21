from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.products.models import Product, Category
from .models import Cart, CartItem

User = get_user_model()


class CartAPITestCase(TestCase):
    """Tests pour l'API du panier"""
    
    def setUp(self):
        """Configuration initiale pour les tests"""
        self.client = APIClient()
        
        # Créer un utilisateur de test
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        
        # Créer une catégorie et un produit de test
        self.category = Category.objects.create(
            name='Test Category',
            slug='test-category'
        )
        
        self.product = Product.objects.create(
            name='Test Product',
            slug='test-product',
            description='Test description',
            price=10000,
            category=self.category,
            stock=10
        )
    
    def test_add_item_to_cart(self):
        """Test ajout d'un article au panier"""
        self.client.force_authenticate(user=self.user)
        
        data = {
            'product_id': self.product.id,
            'quantity': 2
        }
        
        response = self.client.post('/api/cart/add-item/', data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_items'], 2)
        self.assertEqual(len(response.data['items']), 1)
        self.assertEqual(response.data['items'][0]['quantity'], 2)
    
    def test_add_existing_item_increases_quantity(self):
        """Test que l'ajout d'un article existant augmente la quantité"""
        self.client.force_authenticate(user=self.user)
        
        # Ajouter une première fois
        data = {'product_id': self.product.id, 'quantity': 2}
        self.client.post('/api/cart/add-item/', data)
        
        # Ajouter une deuxième fois
        response = self.client.post('/api/cart/add-item/', data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_items'], 4)
        self.assertEqual(len(response.data['items']), 1)
    
    def test_update_cart_item_quantity(self):
        """Test modification de la quantité d'un article"""
        self.client.force_authenticate(user=self.user)
        
        # Ajouter un article
        cart = Cart.objects.create(user=self.user)
        cart_item = CartItem.objects.create(
            cart=cart,
            product=self.product,
            quantity=2,
            price=self.product.price
        )
        
        # Modifier la quantité
        response = self.client.patch(
            f'/api/cart/items/{cart_item.id}/',
            {'quantity': 5}
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['quantity'], 5)
    
    def test_remove_cart_item(self):
        """Test suppression d'un article du panier"""
        self.client.force_authenticate(user=self.user)
        
        # Ajouter un article
        cart = Cart.objects.create(user=self.user)
        cart_item = CartItem.objects.create(
            cart=cart,
            product=self.product,
            quantity=2,
            price=self.product.price
        )
        
        # Supprimer l'article
        response = self.client.delete(f'/api/cart/items/{cart_item.id}/')
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(CartItem.objects.count(), 0)
    
    def test_clear_cart(self):
        """Test vidage du panier"""
        self.client.force_authenticate(user=self.user)
        
        # Ajouter des articles
        cart = Cart.objects.create(user=self.user)
        CartItem.objects.create(
            cart=cart,
            product=self.product,
            quantity=2,
            price=self.product.price
        )
        
        # Vider le panier
        response = self.client.delete('/api/cart/clear/')
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(CartItem.objects.count(), 0)
    
    def test_sync_cart(self):
        """Test synchronisation du panier localStorage"""
        self.client.force_authenticate(user=self.user)
        
        data = {
            'items': [
                {
                    'product_id': self.product.id,
                    'quantity': 3
                }
            ]
        }
        
        response = self.client.post('/api/cart/sync/', data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_items'], 3)
    
    def test_unauthenticated_access_denied(self):
        """Test que l'accès non authentifié est refusé"""
        response = self.client.post('/api/cart/add-item/', {'product_id': self.product.id, 'quantity': 1})
        # 403 Forbidden ou 401 Unauthorized sont tous deux acceptables
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])
