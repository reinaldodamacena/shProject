from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from .forms import PostForm
from rest_framework import viewsets
from .models import Profile, Community, Post, Feed, Message, Profile, Like
from rest_framework import generics, permissions, status
from .serializers import ProfileSerializer, CommunitySerializer, PostSerializer, MessageSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly, BasePermission
from rest_framework.decorators import action





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
    permission_classes = [AllowAny]

class ConnectedProfileList(generics.ListCreateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return user.profile.connections.all()

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(user=user)

class ProfileDetail(generics.RetrieveUpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.profile


class CommunityList(generics.ListCreateAPIView):
    queryset = Community.objects.all()
    serializer_class = CommunitySerializer

class IsMember(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user in obj.members.all()

class CommunityDetail(generics.RetrieveUpdateAPIView):
    queryset = Community.objects.all()
    serializer_class = CommunitySerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsMember]

class PostList(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

class IsPostCreator(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user == obj.creator

class PostDetail(generics.RetrieveUpdateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsPostCreator]

class MessageList(generics.ListCreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

class IsParticipant(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user in obj.participants.all()


class IsConnectedProfileParticipant(BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        connected_profile = obj.connected_profile
        return connected_profile in user.profile.connections.all()


class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated, IsConnectedProfileParticipant]

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(models.Q(sender=user) | models.Q(receiver=user))

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

    @action(detail=True, methods=['get'])
    def chat_history(self, request, pk=None):
        other_user_id = request.GET.get('user_id')
        messages = Message.objects.filter(
            models.Q(sender_id=request.user.id, receiver_id=other_user_id) |
            models.Q(sender_id=other_user_id, receiver_id=request.user.id)
        ).order_by('created_at')
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)


class FeedUser(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        profile = get_object_or_404(Profile, user=user)
        connections = profile.connections.all()
        profiles_to_include = list(connections)  # Converta as conexões para uma lista
        profiles_to_include.append(profile)
        posts = Post.objects.filter(author__profile__in=profiles_to_include).order_by('-timestamp')
        ordered_posts = Post.objects.exclude(pk__in=posts).exclude(author=user).order_by('-likes')

        post_ids = list(posts.values_list('id', flat=True))
        ordered_post_ids = list(ordered_posts.values_list('id', flat=True))

        post_ids += ordered_post_ids
        post_ids = list(set(post_ids))

        queryset = Post.objects.filter(id__in=post_ids).order_by('-timestamp')
        return queryset.select_related('author__profile')

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = request.user
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key})

class LikePost(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        post = self.get_object()
        user = request.user

        if user.is_authenticated:
            liked = post.likes.filter(id=user.id).exists()
            return Response({'liked': liked})
        else:
            return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)

    def get_object(self):
        post_id = self.kwargs.get('post_id')
        post = get_object_or_404(Post, id=post_id)
        return post

@csrf_exempt
def create_user(request):
    if request.method == 'POST':
        # Obtenha os dados do corpo da requisição
        username = request.POST.get('username')
        password = request.POST.get('password')
        email = request.POST.get('email')
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')

        # Verifique se o usuário já existe
        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username already exists'})

        # Crie um novo usuário
        user = User.objects.create_user(username=username, password=password, email=email, first_name=first_name, last_name=last_name)

        # Retorne a resposta adequada, por exemplo, um JSON com os dados do usuário criado
        return JsonResponse({'message': 'User created successfully', 'user': {'username': user.username, 'email': user.email, 'first_name': user.first_name, 'last_name': user.last_name}})
    else:
        return JsonResponse({'error': 'Invalid request method'})
