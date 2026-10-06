from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import OrderSerializer
from accounts.models import User
from .models import Order, OrderDriver, CargoFoto
from django.shortcuts import get_object_or_404
from django.db import transaction

@api_view(['GET'])
def for_drive_status_search_orders(request):
    if not request.user.is_authenticated:
        return Response(status=401)

    if request.user.role != User.Role.DRIVER:
        return Response(status=403)

    order_driver=OrderDriver.objects.filter(driver=request.user)
    orders_search = Order.objects.filter( status=Order.Status.SEARCHING )

    orders=[]

    for object_order_search in orders_search:
        flag=False
        for object_order_driver in order_driver:

            if object_order_driver.order == object_order_search:
                flag=True
                break
        if not flag:
            orders.append(object_order_search)


    data=[]

    for activ_order in orders:

        data.append({
            'order_id':activ_order.id,
            'date_loading':activ_order.date_loading,
            'address_load':activ_order.address_load,
            'address_delivery':activ_order.address_delivery,
            'free_car': ( activ_order.required_drivers - activ_order.order_drivers.count())

        })
    return Response(data)

@api_view(['GET'])
def for_drive_orders_endpoint(request,endpoint):
    if not request.user.is_authenticated:
        return Response( status=401 )

    if request.user.role != User.Role.DRIVER:
        return Response( status=403 )

    order_endpoint = get_object_or_404(Order, id=endpoint)
    if order_endpoint.status!=Order.Status.SEARCHING:
        return Response(status=400)
    if order_endpoint.order_drivers.filter(driver=request.user).exists():
        return Response(status=400)
    order_photo=order_endpoint.cargo_photo.all()
    photo_list=[]
    for photo in order_photo:
        photo_list.append(photo.photo.url)

    return Response({
        'order_id': order_endpoint.id,
        'date_loading': order_endpoint.date_loading,
        'address_load': order_endpoint.address_load,
        'address_delivery': order_endpoint.address_delivery,
        'cargo_weight_tons':order_endpoint.cargo_weight_tons,
        'cargo_volume_m3':order_endpoint.cargo_volume_m3,
        'cargo_description':order_endpoint.cargo_description,
        'porters': order_endpoint.porters,
        'free_car': (order_endpoint.required_drivers - order_endpoint.order_drivers.count()),
        'photos':photo_list

    })

@api_view(['POST'])
def for_driver_take_order(request,endpoint):
    if not request.user.is_authenticated:
        return Response(status=401)

    if request.user.role != User.Role.DRIVER:
        return Response(status=403)

    with transaction.atomic():
        found_order = get_object_or_404(Order.objects.select_for_update(), id=endpoint)
        if found_order.order_drivers.filter(driver=request.user).exists():
            return Response({
                "message": "Заказ уже получен"
            }, status=400)
        if found_order.required_drivers > found_order.order_drivers.count():
            OrderDriver.objects.create(
                order=found_order,
                driver=request.user,
                delivery=False,
            )
            if found_order.order_drivers.count() == found_order.required_drivers:
                found_order.status = Order.Status.IN_PROGRESS
                found_order.save()
            return Response({
                "message": "Заказ успешно взят"
            })
        else:
            return Response({
                "message": "Свободных мест нет"
            })



@api_view(['POST'])
def for_driver_status_delivery(request,endpoint):
    if not request.user.is_authenticated:
        return Response(status=401)

    if request.user.role != User.Role.DRIVER:
        return Response(status=403)

    found_order=get_object_or_404(Order, id=endpoint)
    found_driver=get_object_or_404(
        OrderDriver,
        order=found_order,
        driver=request.user
    )
    found_driver.delivery=True
    found_driver.save()
    return  Response(
        {"message":"груз доставлен"}
    )

@api_view(['GET'])
def for_client_my_orders(request):
    if not request.user.is_authenticated:
        return Response(status=401)

    if request.user.role != User.Role.CLIENT:
        return Response(status=403)

    my_orders=Order.objects.filter(client=request.user)
    data=[]
    for my_order in my_orders:

        objects_OrderDriver=my_order.order_drivers.all()
        data_drivers=[]
        for object_OrderDriver in objects_OrderDriver:
            data_drivers.append({
                'driver_id':object_OrderDriver.driver.id,
                'first_name': object_OrderDriver.driver.first_name,
                'last_name': object_OrderDriver.driver.last_name,
                'phone': object_OrderDriver.driver.phone,
                'vehicle_model': object_OrderDriver.driver.driver_profile.vehicle_model,
                'vehicle_number': object_OrderDriver.driver.driver_profile.vehicle_number,
                'vehicle_photo': object_OrderDriver.driver.driver_profile.vehicle_photo.url,
            })

        order_photos=my_order.cargo_photo.all()
        data_photo=[]
        for my_photo in order_photos:
            data_photo.append(my_photo.photo.url)

        data.append({
            'order_id': my_order.id,
            'date_loading': my_order.date_loading,
            'address_load': my_order.address_load,
            'address_delivery': my_order.address_delivery,
            'cargo_weight_tons': my_order.cargo_weight_tons,
            'cargo_volume_m3': my_order.cargo_volume_m3,
            'cargo_description': my_order.cargo_description,
            'porters': my_order.porters,
            'status': my_order.status,
            'drivers': data_drivers,
            'photos': data_photo,
    })
    return Response(data)



@api_view(['GET'])
def for_driver_my_orders(request):
    if not request.user.is_authenticated:
        return Response(status=401)

    if request.user.role != User.Role.DRIVER:
        return Response(status=403)

    my_driver_order=OrderDriver.objects.filter(driver=request.user)
    data_orders=[]
    for object_DriverOder in my_driver_order:
        my_order=object_DriverOder.order
        data_orders.append({
            'order_id': my_order.id,
            'date_loading': my_order.date_loading,
            'address_load': my_order.address_load,
            'address_delivery': my_order.address_delivery,
            'contact_phone': my_order.contact_phone,
            'delivery': object_DriverOder.delivery
        })
    return Response (data_orders)

@api_view(['GET'])
def for_driver_my_orders_detail(request, endpoint):
    if not request.user.is_authenticated:
        return Response(status=401)

    if request.user.role != User.Role.DRIVER:
        return Response(status=403)

    my_driver_order = OrderDriver.objects.filter(driver=request.user, order_id=endpoint ).first()

    if not my_driver_order:
        return Response(status=404)

    my_order = my_driver_order.order

    return Response({
        'order_id': my_order.id,
        'date_loading': my_order.date_loading,
        'address_load': my_order.address_load,
        'address_delivery': my_order.address_delivery,
        'cargo_description': my_order.cargo_description,
        'cargo_weight_tons': my_order.cargo_weight_tons,
        'cargo_volume_m3': my_order.cargo_volume_m3,
        'contact_name': my_order.contact_name,
        'contact_phone': my_order.contact_phone,
        'porters': my_order.porters,

    })

@api_view(['POST'])
def for_client_create_order(request):

    if not request.user.is_authenticated:
        return Response(status=401)

    if request.user.role != User.Role.CLIENT:
        return Response(status=403)

    serializer = OrderSerializer(data=request.data)

    if serializer.is_valid():
        order = serializer.save(client=request.user)

        for photo in request.FILES.getlist('cargo_photo'):
            CargoFoto.objects.create(
                order=order,
                photo=photo
            )

        return Response({
            'order_id': order.id,
            'message': 'Заказ успешно создан'
        }, status=201)

    return Response(serializer.errors, status=400)
