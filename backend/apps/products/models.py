from django.db import models
from django.utils.text import slugify


class Collection(models.Model):
    """Collection de produits (Hommes, Femmes, Babouches, Lins)"""
    
    name = models.CharField(max_length=100, verbose_name="Nom")
    slug = models.SlugField(max_length=100, unique=True, verbose_name="Slug")
    description = models.TextField(blank=True, verbose_name="Description")
    image = models.ImageField(
        upload_to='collections/',
        blank=True,
        null=True,
        verbose_name="Image"
    )
    order = models.IntegerField(default=0, verbose_name="Ordre d'affichage")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Collection"
        verbose_name_plural = "Collections"
        ordering = ['order', 'name']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['order']),
        ]
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Category(models.Model):
    """Catégorie de produits"""
    
    name = models.CharField(max_length=100, verbose_name="Nom")
    slug = models.SlugField(max_length=100, unique=True, verbose_name="Slug")
    image = models.ImageField(
        upload_to='categories/',
        blank=True,
        null=True,
        verbose_name="Image"
    )
    order = models.IntegerField(default=0, verbose_name="Ordre d'affichage")
    collection = models.ForeignKey(
        Collection,
        on_delete=models.CASCADE,
        related_name='categories',
        verbose_name="Collection",
        null=True,  # Temporairement nullable pour la migration
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Catégorie"
        verbose_name_plural = "Catégories"
        ordering = ['collection__order', 'order', 'name']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['collection']),
        ]
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Product(models.Model):
    """Produit"""
    
    name = models.CharField(max_length=200, verbose_name="Nom")
    slug = models.SlugField(max_length=200, unique=True, verbose_name="Slug")
    description = models.TextField(verbose_name="Description")
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='products',
        verbose_name="Catégorie"
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Prix"
    )
    discount_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        verbose_name="Prix promotionnel"
    )
    is_new = models.BooleanField(default=False, verbose_name="Nouveau")
    is_featured = models.BooleanField(default=False, verbose_name="En vedette")
    stock = models.IntegerField(default=0, verbose_name="Stock")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Produit"
        verbose_name_plural = "Produits"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['category']),
            models.Index(fields=['is_new']),
            models.Index(fields=['is_featured']),
            models.Index(fields=['-created_at']),
        ]
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    @property
    def primary_image(self):
        """Retourne l'image primaire du produit"""
        return self.images.filter(is_primary=True).first()


class ProductImage(models.Model):
    """Image de produit"""
    
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='images',
        verbose_name="Produit"
    )
    image = models.ImageField(
        upload_to='products/',
        verbose_name="Image"
    )
    is_primary = models.BooleanField(default=False, verbose_name="Image principale")
    order = models.IntegerField(default=0, verbose_name="Ordre")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Image de produit"
        verbose_name_plural = "Images de produits"
        ordering = ['order', 'id']
        indexes = [
            models.Index(fields=['product', 'order']),
        ]
    
    def __str__(self):
        return f"Image {self.order} - {self.product.name}"
    
    def save(self, *args, **kwargs):
        # Si c'est la première image, la définir comme primaire
        if not self.pk and not self.product.images.exists():
            self.is_primary = True
        
        # Si cette image est définie comme primaire, retirer le statut des autres
        if self.is_primary:
            ProductImage.objects.filter(
                product=self.product,
                is_primary=True
            ).exclude(pk=self.pk).update(is_primary=False)
        
        super().save(*args, **kwargs)


class ProductVariant(models.Model):
    """Variante de produit (taille, couleur)"""
    
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='variants',
        verbose_name="Produit"
    )
    size = models.CharField(max_length=20, verbose_name="Taille")
    color = models.CharField(max_length=50, verbose_name="Couleur")
    sku = models.CharField(
        max_length=50,
        unique=True,
        verbose_name="SKU"
    )
    stock = models.IntegerField(default=0, verbose_name="Stock")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Variante de produit"
        verbose_name_plural = "Variantes de produits"
        ordering = ['size', 'color']
        indexes = [
            models.Index(fields=['sku']),
            models.Index(fields=['product']),
        ]
    
    def __str__(self):
        return f"{self.product.name} - {self.size} - {self.color}"
