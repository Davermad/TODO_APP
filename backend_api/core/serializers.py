"""
Module for serializers of core app
"""

from rest_framework import serializers
from .models import Todo

class TodoSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    class Meta:
        model = Todo
        fields = "__all__"