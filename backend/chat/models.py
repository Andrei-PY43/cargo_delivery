from django.db import models
from accounts.models import User
from orders.models import Order


class OrderChat(models.Model):


    order=models.OneToOneField(Order,on_delete=models.CASCADE,related_name="order_chat")


class ArchiveMessage(models.Model):
    orderChat=models.ForeignKey(OrderChat,on_delete=models.CASCADE,related_name="messages_chat")
    user = models.ForeignKey( User, on_delete=models.SET_NULL,null=True,related_name="chat_messages" )
    text=models.TextField()
    created=models.DateTimeField(auto_now_add=True)
