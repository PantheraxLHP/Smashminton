from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class ProductSalesAnalyticsSerializer(serializers.Serializer):
    year = serializers.IntegerField()
    month = serializers.IntegerField()
    productfiltervalueid = serializers.IntegerField()
    salequantity = serializers.IntegerField()
    bestseller = serializers.BooleanField()

class BestsellerPredictionInputSerializer(serializers.Serializer):
    year = serializers.IntegerField()
    month = serializers.IntegerField()
    productfiltervalueid = serializers.IntegerField()
    salequantity = serializers.IntegerField()
    filter_type = serializers.ChoiceField(choices=['month', 'quarter'], required=True) 