from django.contrib.auth.models import User
from channels.generic.websocket import AsyncWebsocketConsumer
from .permissions import IsConnectedProfileParticipant
from backShProject.models import Message
import json


class ChatConsumer(AsyncWebsocketConsumer):
    permission_classes = [IsConnectedProfileParticipant]

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

        # Check if sender and receiver are connected
        sender = self.scope['user']
        receiver = User.objects.get(pk=receiver_id)
        connected_profile = receiver.profile.connected_profile
        if connected_profile not in sender.profile.connections.all():
            # Raise a permission denied exception
            raise PermissionDenied

        # Save message to database
        message = Message.objects.create(sender=sender, receiver=receiver, content=message)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message.content,
                'sender_id': sender.id,
                'receiver_id': receiver_id,
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
