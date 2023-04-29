from rest_framework import serializers
from .models import Profile, Community, Post, Message, Comment, CommentLike, Like
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = ('user', 'bio', 'avatar', 'connections')

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
    user = UserSerializer(read_only=True)
    likes = CommentLikeSerializer(many=True, read_only=True)

    class Meta:
        model = Comment
        fields = ('id', 'user', 'content', 'timestamp', 'likes')

class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    likes = LikeSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = ('id', 'user', 'content', 'image', 'timestamp', 'likes', 'comments')


class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ('id','sender', 'receiver', 'content', 'created_at')