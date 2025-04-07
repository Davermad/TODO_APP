"""
Module for urls configuration of core app
"""

from django.urls import path    

from .views import home, todos_list


urlpatterns = [
    path('', home, name="home"),
    path('todos', todos_list, name="todos_list")
]