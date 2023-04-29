from django.contrib import admin
from .models import Profile, Community, Post, Feed, Message, Comment

class CommentInline(admin.TabularInline):
    model = Comment
    extra = 0

class PostAdmin(admin.ModelAdmin):
    inlines = [
        CommentInline,
    ]

admin.site.register(Profile)
admin.site.register(Community)
admin.site.register(Post, PostAdmin)
admin.site.register(Feed)
admin.site.register(Message)