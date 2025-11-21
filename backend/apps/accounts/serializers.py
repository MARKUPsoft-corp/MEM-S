from rest_framework import serializers
from dj_rest_auth.registration.serializers import RegisterSerializer
from .models import User


class UserSerializer(serializers.ModelSerializer):
    """Serializer pour le modèle User"""
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 
                  'phone', 'whatsapp', 'address', 'city')
        read_only_fields = ('id',)


class CustomRegisterSerializer(RegisterSerializer):
    """Serializer personnalisé pour l'inscription"""
    
    phone = serializers.CharField(required=False, allow_blank=True)
    whatsapp = serializers.CharField(required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)
    city = serializers.CharField(required=False, allow_blank=True)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    
    def custom_signup(self, request, user):
        """Enregistrer les champs personnalisés lors de l'inscription"""
        user.phone = self.validated_data.get('phone', '')
        user.whatsapp = self.validated_data.get('whatsapp', '')
        user.address = self.validated_data.get('address', '')
        user.city = self.validated_data.get('city', '')
        user.first_name = self.validated_data.get('first_name', '')
        user.last_name = self.validated_data.get('last_name', '')
        user.save()
