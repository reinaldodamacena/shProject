from rest_framework import serializers
from .models import Profile, Community, Post, Message, Comment, CommentLike, Like
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name')

class ProfileSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = ['user', 'bio', 'avatar', 'connections', 'background_image']

class CommunitySerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Community
        fields = ('id', 'name', 'description', 'members', 'creator')

class LikeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Like
        fields = ('id','user','timestamp')

class CommentLikeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = CommentLike
        fields = ('id','user')

class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    likes = CommentLikeSerializer(many=True, read_only=True)

    class Meta:
        model = Comment
        fields = ('id', 'author', 'content', 'timestamp', 'likes')

class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    profile = ProfileSerializer(source='author.profile', read_only=True)  # Modificação feita aqui
    likes = LikeSerializer(many=True, read_only=True)
    comments = CommentSerializer(allow_empty=True, many=True, read_only=True)

    class Meta:
        model = Post
        fields = ('id', 'user', 'profile', 'content', 'image', 'timestamp', 'likes', 'comments')


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'
