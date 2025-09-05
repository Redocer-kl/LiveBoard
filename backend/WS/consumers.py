import json
from channels.generic.websocket import AsyncWebsocketConsumer


class RoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.group_name = f"room_{self.room_name}"


        # Join group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name,
        )
        await self.accept()


    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name,
        )


    async def receive(self, text_data):
        data = json.loads(text_data)
        if data.get("type") == "stroke_broadcast":
            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "broadcast_json",
                    "message": data,
                },
            )


    async def broadcast_json(self, event):
        await self.send(text_data=json.dumps(event["message"]))