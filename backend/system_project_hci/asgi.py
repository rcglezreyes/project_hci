# system_project_hci/asgi.py
import os
import django
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application

from api_project_hci.ws_urls import websocket_urlpatterns as project_websocket_urlpatterns
from api_users.ws_urls       import websocket_urlpatterns as user_websocket_urlpatterns

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'system_project_hci.settings')
django.setup()

urlpatterns = project_websocket_urlpatterns + user_websocket_urlpatterns

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AllowedHostsOriginValidator(     
        AuthMiddlewareStack(
            URLRouter(urlpatterns)
        )
    ),
})
