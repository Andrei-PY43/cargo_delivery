from django.contrib import admin
from .models import User, DriverProfile


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "username",
        "phone",
        "email",
        "first_name",
        "last_name",
        "role",
        "is_active",
    )

    list_filter = (
        "role",
        "is_active",
    )

    search_fields = (
        "username",
        "phone",
        "email",
        "first_name",
        "last_name",
    )

    ordering = (
        "username",
    )

    list_per_page = 25


@admin.register(DriverProfile)
class DriverProfileAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "vehicle_model",
        "vehicle_number",
        "capacity_tons",
        "volume_m3",
        "date_created",
    )

    search_fields = (
        "user__username",
        "user__phone",
        "vehicle_model",
        "vehicle_number",
        "license_number",
    )

    ordering = (
        "-date_created",
    )

    list_per_page = 25