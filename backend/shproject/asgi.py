"""
ASGI config for shproject project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from .consumers.routing import websocket_urlpatterns
from .consumers.tokenAuthMiddleware import TokenAuthMiddlewareStack
from .consumers.middleware import CookieAndSessionMiddleware

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shproject.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": CookieAndSessionMiddleware(
        TokenAuthMiddlewareStack(
            URLRouter(
                websocket_urlpatterns
            )
        )
    ),
})




