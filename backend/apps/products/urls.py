from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CollectionViewSet, CategoryViewSet, ProductViewSet

router = DefaultRouter()
router.register(r'collections', CollectionViewSet, basename='collection')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'products', ProductViewSet, basename='product')

urlpatterns = [
    path('', include(router.urls)),
]
