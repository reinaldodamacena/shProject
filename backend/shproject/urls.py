"""shproject URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path, include
from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings
from rest_framework.authtoken.views import obtain_auth_token
from backShProject.views import (profile, community, post, create_post, feed, chat, search, home, ProfileList, ProfileDetail, CommunityList, CommunityDetail, PostList, PostDetail, MessageList, MessageDetail, FeedUser, CustomAuthToken, LikePost)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',home),
    path('community/<int:community_id>/', community, name='community'),
    path('post/<int:post_id>/', post, name='post'),
    path('create_post/', create_post, name='create_post'),
    path('feed/', feed, name='feed'),
    path('chat/<str:username>/', chat, name='chat'),
    path('search/', search, name='search'),
    path('profiles/', ProfileList.as_view()),
    path('profile/', ProfileDetail.as_view(), name='profile-detail'),
    path('communities/', CommunityList.as_view()),
    path('communities/<int:pk>/', CommunityDetail.as_view()),
    path('posts/', PostList.as_view()),
    path('posts/<int:pk>/', PostDetail.as_view()),
    path('messages/', MessageList.as_view()),
    path('messages/<int:pk>/', MessageDetail.as_view()),
    path('FeedUser/', FeedUser.as_view(), name='feed-user-list'),
    path('api-token-auth/', CustomAuthToken.as_view()),
    path('__debug__/', include('debug_toolbar.urls', namespace='djdt')),
    path('posts/<int:post_id>/like/', LikePost.as_view(), name='like_post'),
    path('posts/<int:post_id>/check_like/', LikePost.as_view(), name='post-check-like'),
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)