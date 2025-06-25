from django.urls import path
from .views import BestsellerPredictionView, home, PredictBestsellerByTimeView

urlpatterns = [
    path('', home, name='home'),
    path('api/predict-bestseller/', BestsellerPredictionView.as_view(), name='predict-bestseller'),
    path('api/predict-bestseller-by-time/', PredictBestsellerByTimeView.as_view(), name='predict-bestseller-by-time'),
] 