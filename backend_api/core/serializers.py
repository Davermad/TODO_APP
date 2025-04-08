"""
Module for serializers of core app
"""

from rest_framework import serializers
from .models import Todo

class TodoSerializer(serializers.ModelSerializer):
    """Fields for diaplay status and priority."""
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    
    class Meta:
        model = Todo
        fields = "__all__"