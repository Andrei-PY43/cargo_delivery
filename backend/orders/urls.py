
from .views import for_client_order_status_done,for_driver_done_order,for_driver_my_orders_detail,for_client_create_order,for_driver_my_orders, for_drive_status_search_orders,for_drive_orders_endpoint,for_driver_take_order,for_driver_status_delivery,for_client_my_orders
from django.urls import path
urlpatterns = [
    path('driver/orders/search/', for_drive_status_search_orders),
    path('driver/orders/<int:endpoint>/', for_drive_orders_endpoint),
    path('driver/orders/<int:endpoint>/take/', for_driver_take_order),
    path('driver/orders/<int:endpoint>/delivery/', for_driver_status_delivery),
    path('driver/my_orders/', for_driver_my_orders),
    path('client/orders/', for_client_my_orders),
    path('client/order/create/', for_client_create_order),
    path('driver/my_orders/<int:endpoint>/',for_driver_my_orders_detail),
    path('driver/orders/done/',for_driver_done_order),
    path('client/orders/done/',for_client_order_status_done)
]