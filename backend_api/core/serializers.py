"""
Module for serializers of core app
"""

from rest_framework import serializers
from .models import Todo

class TodoSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Todo
        fields = "__all__"