"""
Module for urls configuration of core app
"""

from django.urls import path    

from .views import home


urlpatterns = [
    path('', home, name="home")
]