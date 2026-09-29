from django.contrib import admin
from .models import Order, OrderDriver, CargoFoto


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "client",
        "date_create_order",
        "date_delivery",
        "address_load",
        "address_delivery",
        "status",
        "required_drivers",
    )

    list_filter = (
        "status",
        "porters",
        "date_create_order",
    )

    search_fields = (
        "id",
        "client__username",
        "client__phone",
        "contact_name",
        "contact_phone",
        "address_load",
        "address_delivery",
    )

    ordering = (
        "-date_create_order",
    )

    list_per_page = 25


@admin.register(OrderDriver)
class OrderDriverAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "order",
        "driver",
        "delivery",
    )

    list_filter = (
        "delivery",
    )

    search_fields = (
        "order__id",
        "driver__username",
        "driver__phone",
    )


@admin.register(CargoFoto)
class CargoFotoAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "order",
    )

    search_fields = (
        "order__id",
    )