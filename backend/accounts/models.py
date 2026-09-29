from django.contrib.auth.models import AbstractUser
from django.db import models



class User(AbstractUser):

    class Role(models.TextChoices):
        CLIENT = "client", "Клиент"
        DRIVER = "driver", "Водитель"

    phone = models.CharField(max_length=12, unique=True)

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.CLIENT,
    )


class DriverProfile(models.Model):
    vehicle_model = models.CharField(max_length=60)
    vehicle_number = models.CharField(max_length=9)
    vehicle_photo = models.ImageField(upload_to='drivers/vehicle/')
    capacity_tons = models.FloatField()
    volume_m3 = models.FloatField()
    license_number = models.CharField(max_length=60)
    license_photo = models.ImageField(upload_to='drivers/licenses/')
    date_created = models.DateField(auto_now_add=True)
    user = models.OneToOneField( User,related_name='driver_profile',on_delete=models.CASCADE)

    def __str__(self):
        return f'Автомобиль: {self.vehicle_model}, номер: {self.vehicle_number}'

