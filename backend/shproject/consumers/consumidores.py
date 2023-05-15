from django.contrib.auth.models import User
from django.core.exceptions import PermissionDenied
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.http import HttpResponseForbidden
from asgiref.sync import sync_to_async
from .permissions import IsConnectedProfileParticipant
from backShProject.models import Message, Profile
import json
import asyncio






class ChatConsumer(AsyncWebsocketConsumer):
    permission_classes = [IsConnectedProfileParticipant]

   
    @database_sync_to_async
    def get_connected_profile(self, user):
        return Profile.objects.get(user=user).connections.all()
        
    
    @database_sync_to_async
    def get_user(self, user_id):
        return User.objects.get(pk=user_id)

    @database_sync_to_async
    def get_profile(self, user):
        return user.profile

   
    @database_sync_to_async
    def create_message(self, sender, receiver, content):
        return Message.objects.create(sender=sender, receiver=receiver, content=content)
    
    @database_sync_to_async
    def save_message(self, sender, receiver, content):
        try:
            message = Message.objects.create(sender=sender, receiver=receiver, content=content)
            return message
        except ObjectDoesNotExist:
            # Trate aqui o caso em que o objeto não existe
            return None

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        receiver_id = text_data_json['receiver_id']

        receiver = await self.get_user(receiver_id)
        connected_profile = await self.get_connected_profile(receiver)

        sender = self.scope['user']
        sender_profile = await self.get_profile(sender)

        def check_sender_profile():
            return sender_profile in connected_profile

        if await asyncio.to_thread(check_sender_profile):
            await self.save_message(sender, receiver, message)
            # Enviar mensagem de erro para o cliente
            error_message = {
                'error': 'Permission denied'
            }
            await self.send(json.dumps(error_message))
            return

        # Save message to database
        message = await self.create_message(sender, receiver, message)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message.content,
                'sender_id': sender.id,
                'receiver_id': receiver.id,
            }
        )


    async def chat_message(self, event):
        message = event['message']
        sender_id = event['sender_id']
        receiver_id = event['receiver_id']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'sender_id': sender_id,
            'receiver_id': receiver_id,
        }))

    async def get_chat_messages(self, event):
        sender_id = event['sender_id']
        receiver_id = event['receiver_id']

        messages = Message.objects.filter(sender_id=sender_id, receiver_id=receiver_id).order_by('-created_at')[:10]

        content = {
            'command': 'messages',
            'messages': self.messages_to_json(messages),
        }

        await self.send(text_data=json.dumps(content))

    def messages_to_json(self, messages):
        result = []
        for message in messages:
            result.append(self.message_to_json(message))
        return result

    def message_to_json(self, message):
        return {
            'sender': message.sender.username,
            'receiver': message.receiver.username,
            'content': message.content,
            'created_at': str(message.created_at),
        }
