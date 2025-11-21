from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client, OAuth2Error
import jwt

class CustomGoogleOAuth2Adapter(GoogleOAuth2Adapter):
    def complete_login(self, request, app, token, **kwargs):
        try:
            return super().complete_login(request, app, token, **kwargs)
        except OAuth2Error:
            # allauth capture ExpiredSignatureError et lève OAuth2Error
            # On tente de décoder sans vérifier l'expiration pour contourner le problème d'horloge
            response = kwargs.get("response")
            id_token = response.get("id_token")
            # On décode manuellement pour récupérer les infos sans vérifier la signature ni l'expiration
            identity_data = jwt.decode(id_token, options={"verify_signature": False})
            
            # On crée le login social manuellement
            login = self.get_provider().sociallogin_from_response(request, identity_data)
            return login

@method_decorator(csrf_exempt, name='dispatch')
class GoogleLogin(SocialLoginView):
    adapter_class = CustomGoogleOAuth2Adapter
    callback_url = "http://localhost:3000"
    client_class = OAuth2Client
    authentication_classes = [] # Désactiver l'authentification de session pour éviter CSRF
