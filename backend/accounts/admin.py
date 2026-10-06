from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User, DriverProfile


@admin.register(User)
class UserAdmin(BaseUserAdmin):

    list_display = (
        "id",
        "username",
        "phone",
        "role",
        "first_name",
        "last_name",
        "email",
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

    fieldsets = BaseUserAdmin.fieldsets + (
        ("Дополнительная информация", {
            "fields": (
                "phone",
                "role",
            ),
        }),
    )

    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ("Дополнительная информация", {
            "fields": (
                "phone",
                "role",
                "first_name",
                "last_name",
                "email",
            ),
        }),
    )


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

    ordering = ("-date_created",)

    list_per_page = 25