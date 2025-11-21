from django.urls import path
from dj_rest_auth.views import UserDetailsView
from .views import GoogleLogin

urlpatterns = [
    path('user/', UserDetailsView.as_view(), name='user-details'),
    path('google/', GoogleLogin.as_view(), name='google_login'),
]
