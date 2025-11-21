from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Collection, Category, Product
from .serializers import (
    CollectionSerializer,
    CategorySerializer,
    ProductListSerializer,
    ProductDetailSerializer
)
from .filters import ProductFilter


class CollectionViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour les collections (lecture seule)"""
    
    queryset = Collection.objects.prefetch_related('categories').all()
    serializer_class = CollectionSerializer
    lookup_field = 'slug'
    
    @action(detail=True, methods=['get'])
    def categories(self, request, slug=None):
        """Retourne les catégories d'une collection spécifique"""
        collection = self.get_object()
        categories = collection.categories.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour les catégories (lecture seule)"""
    
    queryset = Category.objects.select_related('collection').all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'
    
    @action(detail=False, methods=['get'])
    def by_collection(self, request):
        """Retourne les catégories groupées par collection"""
        collections_data = {}
        collections = Collection.objects.prefetch_related('categories').all()
        
        for collection in collections:
            collections_data[collection.slug] = CategorySerializer(collection.categories.all(), many=True).data
        
        return Response(collections_data)


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour les produits (lecture seule)"""
    
    queryset = Product.objects.select_related('category').prefetch_related(
        'images', 'variants'
    ).all()
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at', 'name']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """Utilise un serializer différent pour la liste et le détail"""
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Retourne les produits en vedette"""
        featured_products = self.queryset.filter(is_featured=True)[:6]
        serializer = self.get_serializer(featured_products, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def new_arrivals(self, request):
        """Retourne les nouveaux produits"""
        new_products = self.queryset.filter(is_new=True)[:6]
        serializer = self.get_serializer(new_products, many=True)
        return Response(serializer.data)
