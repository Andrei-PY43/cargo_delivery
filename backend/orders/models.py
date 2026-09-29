from accounts.models import User
from django.db import models
from django.db.models import PROTECT
class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Ожидает обработки"
        SEARCHING = "searching", "Ищем водителя"
        IN_PROGRESS = "in_progress", "На выполнении"
        DONE = "done", "Заказ выполнен"
        CANCELLED = "cancelled", "Заказ отменён"

    date_create_order = models.DateTimeField(auto_now_add=True)
    address_load = models.CharField(max_length=200)
    address_delivery = models.CharField(max_length=200)
    date_delivery = models.DateTimeField(null=True, blank=True)
    cargo_description = models.TextField(blank=True, null=True,)
    cargo_weight_tons = models.FloatField(null=True, blank=True)
    cargo_volume_m3 = models.FloatField(null=True, blank=True)
    contact_name = models.CharField(max_length=60)
    contact_phone = models.CharField(max_length=12)
    porters = models.BooleanField(default=False)

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING, )

    client = models.ForeignKey(User, related_name='client_orders', on_delete=models.PROTECT)
    required_drivers = models.PositiveIntegerField(default=1)

    def __str__(self):
        return (
            f'Заказ: Дата создания: {self.date_create_order}, '
            f'Адрес загрузки: {self.address_load}, '
            f'Адрес доставки: {self.address_delivery}, '
            f'Дата доставки: {self.date_delivery}'
        )


class OrderDriver(models.Model):
    driver = models.ForeignKey(User, related_name='driver_orders', on_delete=PROTECT)
    order = models.ForeignKey(Order, related_name='order_drivers', on_delete=models.CASCADE)
    delivery = models.BooleanField(default=False)


class CargoFoto(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='cargo_photo')
    photo = models.ImageField(upload_to='cargo/%Y/%m/%d/')

    def __str__(self):
        return f'Фото заказа №{self.order.id}'



