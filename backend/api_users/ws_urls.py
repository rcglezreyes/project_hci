# api_zoho/routing.py
from django.urls import path
from .consumers import (
    UserRoleConsumer,
    UserConsumer
)

websocket_urlpatterns = [
    path('api/user/ws/user-roles/', UserRoleConsumer.as_asgi(), name='ws_user_roles'),
    path('api/user/ws/users/', UserConsumer.as_asgi(), name='ws_users'),
]
