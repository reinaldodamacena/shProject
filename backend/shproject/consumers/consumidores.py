from django.contrib.auth.models import User
from django.core.exceptions import PermissionDenied
from django.core.exceptions import ObjectDoesNotExist
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.http import HttpResponseForbidden
from asgiref.sync import sync_to_async
from .permissions import IsConnectedProfileParticipant
from backShProject.models import Message, Profile
from django.db.models import Q
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
        if user.is_authenticated:
            return user.profile
        else:
            return None

   
    @database_sync_to_async
    def create_message(self, sender, receiver, content):
        return Message.objects.create(sender=sender, receiver=receiver, content=content)
    
    
    @database_sync_to_async
    def get_user_instance(self, user):
        if user.is_authenticated:
            return User.objects.get(pk=user.pk)
        else:
            return None

    @database_sync_to_async
    def get_user_id_by_username(self, username):
        return User.objects.get(username=username).id

    
    

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Split room name into sender and receiver IDs
        sender_id, receiver_id = map(int, self.room_name.split('_'))

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        messages = await self.get_chat_messages({
            'sender_id': sender_id,
            'receiver_id': receiver_id,
        })

        await self.send(text_data=json.dumps({
            'command': 'messages',
            'messages': messages,
        }))


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
        sender = await self.get_user_instance(self.scope['user'])
        sender_profile = await self.get_profile(sender)

        def check_sender_profile():
            return sender_profile in connected_profile

        if await asyncio.to_thread(check_sender_profile):
            message = await self.save_message(sender, receiver, message)
            response = {
                'mensagem': 'Mensagem Envida',
                'content': message['content'],  # Altere isto
                'sender_id': sender.id,
                'sender_first_name' : sender.first_name,
                'sender_username': sender.username,  # incluir o nome do usuário aqui
                'receiver_id': receiver.id,
            }
            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message_with_username',
                    'content': message['content'],
                    'sender_id': sender.id,
                    'sender_first_name': sender.first_name,
                    'sender_username': sender.username,
                    'receiver_id': receiver.id,
                }
            )
            return

        # Save message to database
        message = await self.create_message(sender, receiver, message)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message_with_username',
                'content': message.content,
                'sender_id': sender.id,
                'sender_first_name' : sender.first_name,
                'sender_username': sender.username,  # incluir o nome do usuário aqui
                'receiver_id': receiver.id,
            }
        )



    async def chat_message(self, event):
        message = event['message']
        sender_id = event['sender_id']
        receiver_id = event['receiver_id']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'content': message,
            'sender_id': sender_id,
            'receiver_id': receiver_id,
        }))

    async def chat_message_with_username(self, event):
        message = event['content']
        sender_id = event['sender_id']
        sender_first_name = event['sender_first_name']
        sender_username = event['sender_username']
        receiver_id = event['receiver_id']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'content': message,
            'sender_id': sender_id,
            'sender_first_name': sender_first_name,
            'sender_username': sender_username,
            'receiver_id': receiver_id,
        }))

    def messages_to_json(self, messages):
        result = []
        for message in messages:
            msg_json = self.message_to_json(message)
            print(f"Message JSON: {msg_json}")  # log de depuração
            result.append(msg_json)
        return result

    def message_to_json(self, message):
        return {
            'sender_id': message.sender.id,
            'sender': message.sender.username,
            'receiver_id': message.receiver.id,
            'receiver': message.receiver.username,
            'content': message.content,
            'created_at': str(message.created_at),
            'sender_first_name': message.sender.first_name,  # incluir o nome do usuário aqui
        }

    @database_sync_to_async
    def get_chat_messages(self, event):
        sender_id = event['sender_id']
        receiver_id = event['receiver_id']

        messages = Message.objects.filter(
            (Q(sender_id=sender_id) & Q(receiver_id=receiver_id)) |  # Mensagens enviadas por você
            (Q(sender_id=receiver_id) & Q(receiver_id=sender_id))  # Mensagens enviadas pelo destinatário
        ).order_by('-created_at')[:10][::-1]

        return self.messages_to_json(messages)


    @database_sync_to_async
    def save_message(self, sender, receiver, content):
        try:
            message = Message.objects.create(sender=sender, receiver=receiver, content=content)
            # Retorne um dicionário que pode ser serializado para JSON
            return {
                'id': message.id,
                'content': message.content,
                'created_at': str(message.created_at),
                'sender_id': sender.id,
                'receiver_id': receiver.id,
            }
        except ObjectDoesNotExist:
            # Trate aqui o caso em que o objeto não existe
            return None
