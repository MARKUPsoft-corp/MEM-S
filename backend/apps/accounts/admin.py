from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin pour le modèle User personnalisé"""
    
    # Champs affichés dans la liste
    list_display = ('email', 'username', 'first_name', 'last_name', 'phone', 'city', 'is_staff')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'city')
    search_fields = ('email', 'username', 'first_name', 'last_name', 'phone', 'whatsapp')
    
    # Ajouter les champs personnalisés dans les fieldsets
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Informations supplémentaires', {
            'fields': ('phone', 'whatsapp', 'address', 'city')
        }),
    )
    
    # Champs pour la création d'un nouvel utilisateur
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Informations supplémentaires', {
            'fields': ('email', 'phone', 'whatsapp', 'address', 'city')
        }),
    )
