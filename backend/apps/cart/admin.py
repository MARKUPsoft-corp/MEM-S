from django.contrib import admin
from .models import Cart, CartItem


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ['price', 'total_price', 'created_at', 'updated_at']
    fields = ['product', 'variant', 'quantity', 'price', 'total_price']
    
    def total_price(self, obj):
        return f"{obj.total_price} FCFA"
    total_price.short_description = "Total"


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'total_items', 'subtotal_display', 'updated_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['user__email', 'user__username']
    readonly_fields = ['created_at', 'updated_at', 'total_items', 'subtotal_display']
    inlines = [CartItemInline]
    
    def total_items(self, obj):
        return obj.total_items
    total_items.short_description = "Nombre d'articles"
    
    def subtotal_display(self, obj):
        return f"{obj.subtotal} FCFA"
    subtotal_display.short_description = "Sous-total"


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['cart', 'product', 'variant', 'quantity', 'price', 'total_price_display', 'created_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['cart__user__email', 'product__name']
    readonly_fields = ['price', 'created_at', 'updated_at']
    
    def total_price_display(self, obj):
        return f"{obj.total_price} FCFA"
    total_price_display.short_description = "Total"
