from django.contrib.auth.models import User
from django.db import models
from datetime import datetime


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.CharField(max_length=200, blank=True)
    avatar = models.ImageField(upload_to='avatars/', default='default-avatar.png')
    connections = models.ManyToManyField('self', blank=True)
    background_image = models.ImageField(upload_to='backgrounds/', blank=True, null=True)

    def __str__(self):
        return f'{self.user.username}\'s profile'

class Community(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=200)
    members = models.ManyToManyField(User)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_communities', null=True)
    photo = models.ImageField(upload_to='community_photos/', null=True, blank=True)

    def __str__(self):
        return self.name

class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    file = models.FileField(upload_to='posts/', null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(User, blank=True, related_name='post_likes')
    group = models.ForeignKey(Community, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"{self.author.username} - {self.timestamp.strftime('%d/%m/%Y %H:%M:%S')}"

    @property
    def comments(self):
        return Comment.objects.filter(post=self)


class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='liked_posts')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} liked {self.post}"

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(User, blank=True, related_name='comment_likes')

    def __str__(self):
        return f"{self.author.username} - {self.timestamp.strftime('%d/%m/%Y %H:%M:%S')}"

class CommentLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='comment_likes')

    def __str__(self):
        return f"{self.user.username} likes {self.comment}"

class Feed(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    posts = models.ManyToManyField(Post)

    def __str__(self):
        return f'{self.user.username}\'s feed'

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField()
    created_at = models.DateTimeField(default=datetime.now)

    def __str__(self):
        return f'{self.sender.username} sent a message to {self.receiver.username}'