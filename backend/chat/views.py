from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from orders.models import Order
from .models import OrderChat, ArchiveMessage


@api_view(['GET'])
def get_data_chat_or_create_chat(request,endpoint):
    if not request.user.is_authenticated:
        return Response(status=401)

    order=get_object_or_404(Order,id=endpoint)


    client=order.client
    objects_OrderDriver=order.order_drivers.all()
    drivers=[]
    for object_OrderDriver in objects_OrderDriver:
        drivers.append(object_OrderDriver.driver)
    if request.user != client and request.user not in drivers:
        return Response(status=403)
    chat, created_chat = OrderChat.objects.get_or_create(order=order)
    messages_order = chat.messages_chat.all()
    messages=[]

    if messages_order:
        for message in messages_order:
            messages.append({
                'message_id': message.id,
                'message_text': message.text,
                'message_user_role': message.user.role if message.user else None,
                'message_user_first_name': message.user.first_name if message.user else None,
                'message_user_last_name': message.user.last_name if message.user else None,
                'message_created': message.created
            })



    if request.user==client:
        respons_drivers=[]
        for driver in drivers:
            respons_drivers.append({
                'id': driver.id,
                'firstname_driver':driver.first_name,
                'lastname_driver':driver.last_name
            })
        return Response({
            "drivers":respons_drivers,
            'messages':messages
        })
    # проверяем если request.user-водитель , фильтруем водителей за исключением driver=request.user
    if request.user in drivers:
        data_drivers=[]
        for driver in drivers:
            if driver!=request.user:
                data_drivers.append({
                    'id': driver.id,
                    'firstname_driver': driver.first_name,
                    'lastname_driver': driver.last_name
                })
        return Response({
            'id_client': client.id,
            'firstname_client':client.first_name,
            'lastname_client':client.last_name,
            'drivers':data_drivers,
            'messages':messages

        })

@api_view(['POST'])
def message_save_in_archive(request,endpoint):
    if not request.user.is_authenticated:
        return Response(status=401)

    order=get_object_or_404(Order,id=endpoint)
    client=order.client
    objects_OrderDriver=order.order_drivers.all()
    drivers=[]
    for object_OrderDriver in objects_OrderDriver:
                drivers.append(object_OrderDriver.driver)

    #проверка участников
    if request.user!=client and request.user not in drivers:
        return Response(status=403)
    # если произошла ошибка чата (не создан ранее по кнопке), то нельзя отправить сообщение
    chat = get_object_or_404(OrderChat, order=order)
    print(request.data)
    message=ArchiveMessage.objects.create(
        orderChat=chat,
        user=request.user,
        text=request.data['message'])
    return Response({
        'request_user_id':request.user.id,
        'message_id': message.id,
        'message_user_id':message.user.id if message.user else None,
        'message_user_role': message.user.role if message.user else None,
        'message_user_first_name': message.user.first_name if message.user else None,
        'message_user_last_name': message.user.last_name if message.user else None,
        'message_text': message.text,
        'message_created': message.created
    }, status=201)




