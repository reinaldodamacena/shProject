from channels.middleware import BaseMiddleware
from channels.sessions import CookieMiddleware, SessionMiddleware
from django.db import close_old_connections

class CookieAndSessionMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        close_old_connections()
        scope, receive, send = await CookieMiddleware(
            SessionMiddleware(super().__call__)
        )(scope, receive, send)
        return await super().__call__(scope, receive, send)
