# myapp/consumers.py
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist



@database_sync_to_async
def get_username_by_id(user_id):
    User = get_user_model()
    try:
        return User.objects.get(pk=user_id).username
    except ObjectDoesNotExist:
        return None

class RoomConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        # room_name comes from the websocket URL pattern (see routing.py below)
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.group_name = f"whiteboard_{self.room_name}"
        print(self.room_name)
        print(self.group_name)
        # add this connection's channel to the group
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # remove from group
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive_json(self, content, **kwargs):
        """
        content is expected to be a dict that includes:
          - type: "stroke_update"
          - clientId, strokeId, color, points (list), finished (bool)
        """
        msg_type = content.get("type")
        if msg_type == "stroke_update":
            # Broadcast to the group. Include sender_channel so recipients
            # can detect & skip the origin (avoids echo).
            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "stroke.broadcast",   # calls stroke_broadcast on consumers
                    "sender_channel": self.channel_name,
                    "userId": content.get("userId"),
                    "strokeId": content.get("strokeId"),
                    "color": content.get("color"),
                    "points": content.get("points"),
                    "finished": content.get("finished", False),
                },
                
            )

        elif msg_type == "cursor_update":
            user_id = content.get("userId")
            # Try to avoid a DB hit if this socket is authenticated and the id matches.
            username = None
            if user_id is not None:
                # user_id might be string from JSON, cast safely
                try:
                    uid_int = int(user_id)
                except (TypeError, ValueError):
                    uid_int = None

                if (
                    uid_int is not None
                    and self.scope.get("user")
                    and getattr(self.scope["user"], "is_authenticated", False)
                    and getattr(self.scope["user"], "id", None) == uid_int
                ):
                    username = self.scope["user"].username
                else:
                    username = await get_username_by_id(uid_int)



            # broadcast to others in the group (they will get username too)
            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "cursor_update",   # will call cursor_update on other consumers
                    "sender_channel": self.channel_name,
                    "userId": user_id,
                    "username": username,
                    "color": content.get("color"),
                    "posx": content.get("posx"),
                    "posy": content.get("posy"),
                },
            ) 


    async def stroke_broadcast(self, event):
        """
        Handler for group messages. Runs on every consumer in the group.
        We'll skip sending to the origin by checking sender_channel.
        """
        # Skip origin (prevent echo back to the client that sent it)
        if event.get("sender_channel") == self.channel_name:
            return

        # Send JSON to the connected WebSocket client
        await self.send_json(
            {
                "type": "stroke_broadcast",
                "clientId": event.get("clientId"),
                "strokeId": event.get("strokeId"),
                "color": event.get("color"),
                "points": event.get("points"),
                "finished": event.get("finished", False),
            }
        )

    async def cursor_update(self, event):
        """
        Handler for group messages. Runs on every consumer in the group.
        We'll skip sending to the origin by checking sender_channel.
        """
        # Skip origin (prevent echo back to the client that sent it)
        if event.get("sender_channel") == self.channel_name:
            return

        # Send JSON to the connected WebSocket client
        await self.send_json(
            {
                "type": "cursor_update",
                "userId": event.get("userId"),
                "username": event.get("username"),
                "color": event.get("color"),
                "posx": event.get("posx"),
                "posy": event.get("posy"),
            }
        )

