from django.urls import re_path

from . import consumidores

websocket_urlpatterns = [
     re_path(r'ws/chat/(?P<room_name>\w+)/$', consumidores.ChatConsumer.as_asgi()),
    re_path(r'ws/chat/(?P<sender_id>\w+)/(?P<receiver_id>\w+)/$', consumidores.ChatConsumer.as_asgi()),
]