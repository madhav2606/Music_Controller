from django.urls import path
from .views import index

# for redirect from spotify
app_name = 'frontend'

urlpatterns = [
    path('', index, name=''),
    path('join', index),
    path('create', index),
    path('room/<str:roomCode>', index)
]