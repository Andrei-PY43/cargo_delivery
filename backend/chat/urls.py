from django.urls import path
from .views import get_data_chat_or_create_chat,message_save_in_archive
urlpatterns=[
    path('chat/<int:endpoint>/create/',get_data_chat_or_create_chat),
    path('chat/<int:endpoint>/save/',message_save_in_archive)
]