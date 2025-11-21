from django.contrib import admin
from .models import Collection, Category, Product, ProductImage, ProductVariant


@admin.register(Collection)
class CollectionAdmin(admin.ModelAdmin):
    """Admin pour les collections"""
    
    list_display = ['name', 'slug', 'order', 'created_at']
    search_fields = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['order', 'name']


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Admin pour les catégories"""
    
    list_display = ['name', 'slug', 'collection', 'order', 'created_at']
    list_filter = ['collection']
    search_fields = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['collection__order', 'order', 'name']


class ProductImageInline(admin.TabularInline):
    """Inline pour les images de produits"""
    
    model = ProductImage
    extra = 1
    fields = ['image', 'is_primary', 'order']


class ProductVariantInline(admin.TabularInline):
    """Inline pour les variantes de produits"""
    
    model = ProductVariant
    extra = 1
    fields = ['size', 'color', 'sku', 'stock']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """Admin pour les produits"""
    
    list_display = [
        'name', 'category', 'price', 'discount_price',
        'is_new', 'is_featured', 'stock', 'created_at'
    ]
    list_filter = ['category', 'is_new', 'is_featured', 'created_at']
    search_fields = ['name', 'slug', 'description']
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductImageInline, ProductVariantInline]
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Informations générales', {
            'fields': ('name', 'slug', 'description', 'category')
        }),
        ('Prix et stock', {
            'fields': ('price', 'discount_price', 'stock')
        }),
        ('Options', {
            'fields': ('is_new', 'is_featured')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
