from channels.middleware import BaseMiddleware
from channels.sessions import SessionMiddleware
from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections
from rest_framework.authtoken.models import Token
from channels.db import database_sync_to_async

class TokenAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        close_old_connections()

        token = scope.get("query_string", None)
        if token:
            token = token.decode()
            token = token.split("=")
            if len(token) == 2 and token[0] == "token":
                # Use sync_to_async to call the synchronous function get_user asynchronously
                scope['user'] = await self.get_user(token[1])

        return await super().__call__(scope, receive, send)

    @database_sync_to_async
    def get_user(self, token_key):
        try:
            token_model = Token.objects.get(key=token_key)
            return token_model.user
        except Token.DoesNotExist:
            return AnonymousUser()


def TokenAuthMiddlewareStack(inner):
    return SessionMiddleware(TokenAuthMiddleware(inner))
