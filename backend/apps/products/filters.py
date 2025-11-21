import django_filters
from django.db import models
from .models import Product


class ProductFilter(django_filters.FilterSet):
    """Filtres pour les produits"""
    
    category = django_filters.CharFilter(field_name='category__slug')
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    is_new = django_filters.BooleanFilter(field_name='is_new')
    is_featured = django_filters.BooleanFilter(field_name='is_featured')
    search = django_filters.CharFilter(method='filter_search')
    collection = django_filters.CharFilter(field_name='category__collection__slug')
    
    class Meta:
        model = Product
        fields = ['category', 'min_price', 'max_price', 'is_new', 'is_featured', 'search', 'collection']
    
    def filter_search(self, queryset, name, value):
        """Recherche dans le nom et la description"""
        return queryset.filter(
            models.Q(name__icontains=value) |
            models.Q(description__icontains=value)
        )
