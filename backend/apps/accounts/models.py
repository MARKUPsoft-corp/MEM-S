from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Modèle utilisateur personnalisé pour MEM'S
    Ajoute les champs phone, whatsapp, address, city
    """
    phone = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        verbose_name="Téléphone"
    )
    whatsapp = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        verbose_name="WhatsApp"
    )
    address = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name="Adresse"
    )
    city = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name="Ville"
    )

    class Meta:
        verbose_name = "Utilisateur"
        verbose_name_plural = "Utilisateurs"

    def __str__(self):
        return self.email or self.username
