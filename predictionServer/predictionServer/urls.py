"""
URL configuration for predictionServer project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import routers
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from prediction.views import BestsellerPredictionView, ProductViewSet, ProductSalesAnalyticsView, ProductSalesAnalyticsView

# Swagger schema view
schema_view = get_schema_view(
   openapi.Info(
      title="Smashminton API",
      default_version='v1',
      description="API documentation for Smashminton Prediction Server",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@smashminton.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
)

# API Router
router = routers.DefaultRouter()
#router.register(r'products', ProductViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),

    path('api/train-bestseller-model/', ProductSalesAnalyticsView.as_view(), name='train-bestseller-model '),
    
    path('api/predict-bestseller/', BestsellerPredictionView.as_view(), name='predict-bestseller'),

    path('', include('prediction.urls')),  # Thêm route cho trang chủ
    # Swagger URLs
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)