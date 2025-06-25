from django.db import models
from decimal import Decimal

class Product(models.Model):
    productid = models.AutoField(primary_key=True)
    productname = models.CharField(max_length=255, null=True)
    status = models.CharField(max_length=50, null=True)
    sellingprice = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    rentalprice = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    costprice = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    productimgurl = models.URLField(max_length=255, null=True)
    createdat = models.DateTimeField(auto_now_add=True)
    updatedat = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'products'
        managed = False  # Thêm dòng này để Django không quản lý schema của bảng
        
    def __str__(self):
        return self.productname or f"Product {self.productid}"

class OrderProduct(models.Model):
    orderid = models.IntegerField()
    productid = models.IntegerField()
    returndate = models.DateTimeField(null=True)
    quantity = models.IntegerField(null=True)

    class Meta:
        db_table = 'order_product'
        managed = False
        unique_together = (('orderid', 'productid'),)

class Orders(models.Model):
    orderid = models.AutoField(primary_key=True)
    ordertype = models.CharField(max_length=50, null=True)
    orderdate = models.DateTimeField(null=True)
    totalprice = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    status = models.CharField(max_length=50, null=True)
    employeeid = models.IntegerField(null=True)
    customerid = models.IntegerField(null=True)

    class Meta:
        db_table = 'orders'
        managed = False

class ProductAttributes(models.Model):
    productid = models.IntegerField()
    productfiltervalueid = models.IntegerField()

    class Meta:
        db_table = 'product_attributes'
        managed = False
        unique_together = (('productid', 'productfiltervalueid'),)

class ProductFilterValues(models.Model):
    productfiltervalueid = models.AutoField(primary_key=True)
    value = models.CharField(max_length=255, null=True)
    productfilterid = models.IntegerField(null=True)

    class Meta:
        db_table = 'product_filter_values'
        managed = False

class ProductFilter(models.Model):
    productfilterid = models.AutoField(primary_key=True)
    productfiltername = models.CharField(max_length=255, null=True)
    producttypeid = models.IntegerField(null=True)

    class Meta:
        db_table = 'product_filter'
        managed = False

# Create your models here.

class PredictionModel(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    model_file = models.FileField(upload_to='models/')
    
    def __str__(self):
        return self.name

class PredictionResult(models.Model):
    model = models.ForeignKey(PredictionModel, on_delete=models.CASCADE)
    input_data = models.JSONField()
    output_data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Prediction {self.id} using {self.model.name}"
