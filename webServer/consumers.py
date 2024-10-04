# consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from asgiref.sync import sync_to_async

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f"chat_{self.room_name}"

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

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))


class setStatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    # Fetch the user asynchronously
    @sync_to_async
    def get_user(self, username):
        try:
            return User.objects.get(username=username)
        except ObjectDoesNotExist:
            return None

    # Save the user's profile asynchronously
    @sync_to_async
    def set_user_online_status(self, user, status):
        user.profile.online_status = status
        user.profile.save()

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        username = text_data_json.get('user')
        status = text_data_json.get('status')
        status_bool = True if status == 'online' else False

        if username:
            # Fetch user asynchronously
            user = await self.get_user(username)
            if user:
                print(user)  # This will print the user if found
                # Update the user's profile status asynchronously
                await self.set_user_online_status(user, status_bool)
            else:
                print(f"User with username '{username}' does not exist.")
        else:
            print("No username provided.")

    async def disconnect(self, close_code):
        self.close()