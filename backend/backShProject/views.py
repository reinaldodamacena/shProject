from django.shortcuts import render

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Message
from .messageSerializer import MessageSerializer
from django.shortcuts import render

def chat(request):
    return render(request, 'chat.html')



class MessageListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """
        Retorna todas as mensagens enviadas e recebidas pelo usuário autenticado.
        """
        user = self.request.user
        return Message.objects.filter(sender=user) | Message.objects.filter(receiver=user)

    def perform_create(self, serializer):
        """
        Define o usuário que enviou a mensagem como sendo o usuário autenticado.
        """
        serializer.save(sender=self.request.user)

class MessageDetailAPIView(generics.RetrieveAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = (IsAuthenticated,)