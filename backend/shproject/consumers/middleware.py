from channels.middleware import BaseMiddleware
from channels.sessions import CookieMiddleware, SessionMiddleware
from django.db import close_old_connections

class CookieAndSessionMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        close_old_connections()
        middleware_stack = CookieMiddleware(SessionMiddleware(super().__call__))
        return await middleware_stack(scope, receive, send)
