from rest_framework import serializers

from .models import Order


class OrderSerializer(serializers.ModelSerializer):

    class Meta:
        model = Order
        fields = [
            'address_load',
            'address_delivery',
            'date_loading',
            'cargo_description',
            'cargo_weight_tons',
            'cargo_volume_m3',
            'contact_name',
            'contact_phone',
            'porters',
        ]