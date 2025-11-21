from django.db import models
from django.conf import settings
from apps.products.models import Product, ProductVariant


class Cart(models.Model):
    """Panier d'achat d'un utilisateur"""
    
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='cart',
        verbose_name="Utilisateur"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Dernière modification")
    
    class Meta:
        verbose_name = "Panier"
        verbose_name_plural = "Paniers"
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"Panier de {self.user.email} ({self.total_items} articles)"
    
    @property
    def total_items(self):
        """Nombre total d'articles dans le panier"""
        return sum(item.quantity for item in self.items.all())
    
    @property
    def subtotal(self):
        """Sous-total du panier (somme des prix × quantités)"""
        return sum(item.total_price for item in self.items.all())
    
    @property
    def total(self):
        """Total du panier (peut inclure taxes, frais de livraison plus tard)"""
        return self.subtotal


class CartItem(models.Model):
    """Article dans un panier"""
    
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name="Panier"
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        verbose_name="Produit"
    )
    variant = models.ForeignKey(
        ProductVariant,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        verbose_name="Variante"
    )
    quantity = models.PositiveIntegerField(
        default=1,
        verbose_name="Quantité"
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Prix unitaire"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date d'ajout")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Dernière modification")
    
    class Meta:
        verbose_name = "Article du panier"
        verbose_name_plural = "Articles du panier"
        ordering = ['created_at']
        unique_together = ['cart', 'product', 'variant']
        indexes = [
            models.Index(fields=['cart']),
            models.Index(fields=['product']),
        ]
    
    def __str__(self):
        variant_str = f" ({self.variant})" if self.variant else ""
        return f"{self.product.name}{variant_str} x{self.quantity}"
    
    @property
    def total_price(self):
        """Prix total de cet article (prix × quantité)"""
        return self.price * self.quantity
    
    def save(self, *args, **kwargs):
        """Sauvegarder le prix au moment de l'ajout si non spécifié"""
        if not self.price:
            self.price = self.product.discount_price or self.product.price
        super().save(*args, **kwargs)
