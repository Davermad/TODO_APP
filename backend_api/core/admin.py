"""
Module for administrating models of core app
"""
from django.contrib import admin

from .models import Todo

admin.site.register(Todo)


