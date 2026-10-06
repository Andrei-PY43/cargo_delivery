from django.contrib import admin

from .models import Order, OrderDriver, CargoFoto


class OrderDriverInline(admin.TabularInline):
    model = OrderDriver
    extra = 0
    fields = ("driver", "delivery")
    readonly_fields = ("driver", "delivery")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "order_number",
        "client_info",
        "date_create",
        "date_loading_info",
        "address_load_info",
        "address_delivery_info",
        "status",
        "required_drivers_count",
        "drivers_count",
        "free_drivers",
        "drivers_list",
    )

    @admin.display(description="Заказ")
    def order_number(self, obj):
        return f"Заказ №{obj.id}"

    @admin.display(description="Клиент")
    def client_info(self, obj):
        return (
            f"ID {obj.client.id} — "
            f"{obj.client.first_name} "
            f"{obj.client.last_name}"
        )

    @admin.display(description="Дата создания")
    def date_create(self, obj):
        return obj.date_create_order

    @admin.display(description="Дата погрузки")
    def date_loading_info(self, obj):
        return obj.date_loading

    @admin.display(description="Адрес погрузки")
    def address_load_info(self, obj):
        return obj.address_load

    @admin.display(description="Адрес доставки")
    def address_delivery_info(self, obj):
        return obj.address_delivery

    @admin.display(description="Требуется водителей")
    def required_drivers_count(self, obj):
        return obj.required_drivers

    @admin.display(description="Водителей найдено")
    def drivers_count(self, obj):
        return obj.order_drivers.count()

    @admin.display(description="Свободных мест")
    def free_drivers(self, obj):
        return obj.required_drivers - obj.order_drivers.count()

    @admin.display(description="Водители")
    def drivers_list(self, obj):
        return ", ".join(
            f"ID {order_driver.driver.id} — "
            f"{order_driver.driver.first_name} "
            f"{order_driver.driver.last_name}"
            for order_driver in obj.order_drivers.all()
        )


@admin.register(OrderDriver)
class OrderDriverAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "order_number",
        "driver_info",
        "delivery_status",
    )

    list_filter = ("delivery",)

    search_fields = (
        "order__id",
        "driver__username",
        "driver__phone",
        "driver__first_name",
        "driver__last_name",
    )

    list_per_page = 25

    @admin.display(description="Заказ")
    def order_number(self, obj):
        return f"Заказ №{obj.order.id}"

    @admin.display(description="Водитель")
    def driver_info(self, obj):
        return (
            f"ID {obj.driver.id} — "
            f"{obj.driver.first_name} "
            f"{obj.driver.last_name}"
        )

    @admin.display(description="Доставлено")
    def delivery_status(self, obj):
        return "Да" if obj.delivery else "Нет"