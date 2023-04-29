from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from .forms import PostForm
from .models import Profile, Community, Post, Feed, Message, Profile
from rest_framework import generics, permissions
from .serializers import ProfileSerializer, CommunitySerializer, PostSerializer, MessageSerializer


def home(request):
    return render(request, 'index.html')

@login_required
def profile(request):
    profile = get_object_or_404(Profile, user=request.user)
    return render(request, 'profile.html', {'profile': profile})

@login_required
def community(request, community_id):
    community = get_object_or_404(Community, id=community_id)
    posts = Post.objects.filter(community=community)
    return render(request, 'community.html', {'community': community, 'posts': posts})

@login_required
def post(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    return render(request, 'post.html', {'post': post})


@login_required
def create_post(request):
    if request.method == 'POST':
        form = PostForm(request.POST, request.FILES)
        if form.is_valid():
            post = form.save(commit=False)
            post.user = request.user
            post.save()
            form.save_m2m()
            return redirect('feed')
    else:
        form = PostForm()
    return render(request, 'create_post.html', {'form': form})


@login_required
def feed(request):
    feed = Feed.objects.filter(user=request.user.profile)
    return render(request, 'feed.html', {'feed': feed})


@login_required
def chat(request, username):
    if request.method == 'POST':
        sender = request.user.profile
        receiver = get_object_or_404(User, username=username).profile
        content = request.POST.get('content')
        message = Message.objects.create(sender=sender, receiver=receiver, content=content)
        return redirect('chat', username=username)
    sender = request.user.profile
    receiver = get_object_or_404(User, username=username).profile
    messages_sent = Message.objects.filter(sender=sender, receiver=receiver)
    messages_received = Message.objects.filter(sender=receiver, receiver=sender)
    messages = messages_sent.union(messages_received).order_by('timestamp')
    return render(request, 'chat.html', {'sender': sender, 'receiver': receiver, 'messages': messages})


@login_required
def search(request):
    query = request.GET.get('query')
    if not query:
        return HttpResponse('Empty query')
    communities = Community.objects.filter(name__icontains=query)
    return render(request, 'search.html', {'communities': communities})
#---------- MÉTODOS ACIMA UTILIZADOS NA MODELAGEM QUANDO AINDA NÃO HÁ FRONT, APENAS PARA TESTES, DEVERÃO SER DESCONSIDERADOS EM BREVE

class ProfileList(generics.ListCreateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer


class ProfileDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer


class CommunityList(generics.ListCreateAPIView):
    queryset = Community.objects.all()
    serializer_class = CommunitySerializer


class CommunityDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Community.objects.all()
    serializer_class = CommunitySerializer


class PostList(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer


class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

class MessageList(generics.ListCreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer


class MessageDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

class FeedUser(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        profile = get_object_or_404(Profile, user=user)
        connections = profile.connections.all()
        posts = Post.objects.filter(author__profile__in=connections).order_by('-timestamp')
        ordered_posts = Post.objects.exclude(pk__in=posts).exclude(author=user).order_by('-likes')

        post_ids = list(posts.values_list('id', flat=True))
        ordered_post_ids = list(ordered_posts.values_list('id', flat=True))

        post_ids += ordered_post_ids
        post_ids = list(set(post_ids))

        queryset = Post.objects.filter(id__in=post_ids).order_by('-timestamp')
        return queryset

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key})