# it will take our model(Room) WHICH HAVE ALL PYTHON RELATED CODE AND TRANSLATE THIS 'ROOM' INTO JSON RESPONSE FOR THE FRONTEND
from rest_framework import serializers
from .models import Room

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        # model that we need to serialize (Room)
        model = Room
        # all the fields in that we want to include in the output/serialization
        # id -> primary key
        fields = ('id', 'code', 'host', 'guest_can_pause','votes_to_skip','created_at')


class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('guest_can_pause', 'votes_to_skip')


class UpdateRoomSerializer(serializers.ModelSerializer):
    code = serializers.CharField(validators=[])

    class Meta:
        model = Room
        fields = ('guest_can_pause', 'votes_to_skip', 'code')
# A serializer in Django REST Framework does two main jobs:

# Serialization: Converts Django model instances (or other Python objects) into JSON (or XML, etc.) — used when sending data to frontend or APIs.

# Deserialization: Takes user input (e.g., JSON from a POST request), validates it, and converts it into Django objects (like saving to the database).