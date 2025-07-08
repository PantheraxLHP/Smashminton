from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import PredictionModel, PredictionResult, Product, ProductFilterValues
from .serializers import ProductSerializer, ProductSalesAnalyticsSerializer, BestsellerPredictionInputSerializer
import json
from django.db import connection
import pandas as pd
from .ml_models import train_bestseller_model, predict_bestseller
import datetime
import os
from rest_framework import status

def home(request):
    return render(request, 'prediction/home.html', {
        'title': 'Smashminton Prediction Server',
        'description': 'Welcome to the prediction service for Smashminton sports club.'
    })

class ProductViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing products
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    @swagger_auto_schema(
        operation_summary="List all products",
        operation_description="Returns a list of all products in the system",
        responses={
            200: ProductSerializer(many=True),
            400: 'Bad Request',
            500: 'Internal Server Error'
        }
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

class ProductSalesAnalyticsView(APIView):
    permission_classes = [permissions.AllowAny]

    @swagger_auto_schema(
        operation_summary="Product sales analytics",
        operation_description="Group by year, month (12 tháng) hoặc year, quarter (4 quý), productfiltervalueid (chỉ filterid=1,2), trả về salequantity. Luôn trả về cả 2 model (3 năm, 5 năm).",
        manual_parameters=[],
        responses={200: ProductSalesAnalyticsSerializer(many=True)}
    )
    def get(self, request):
        current_year = datetime.datetime.now().year
        years_3 = [current_year - i - 1 for i in range(3)]
        years_5 = [current_year - i - 1 for i in range(5)]
        years_3 = sorted(list(set(years_3)), reverse=True)
        years_5 = sorted(list(set(years_5)), reverse=True)

        year_filter_month = f" AND EXTRACT(YEAR FROM o.orderdate) IN ({','.join(['%s']*len(years_3))})"
        params_month = years_3.copy()

        year_filter_quarter = f" AND EXTRACT(YEAR FROM o.orderdate) IN ({','.join(['%s']*len(years_5))})"
        params_quarter = years_5.copy()

        # Lấy dữ liệu group theo tháng
        with connection.cursor() as cursor:
            cursor.execute(f'''
                SELECT 
                    EXTRACT(YEAR FROM o.orderdate) AS year,
                    EXTRACT(MONTH FROM o.orderdate) AS month,
                    pfv.productfiltervalueid,
                    SUM(op.quantity) AS salequantity
                FROM order_product op
                JOIN orders o ON op.orderid = o.orderid
                JOIN product_attributes pa ON op.productid = pa.productid
                JOIN product_filter_values pfv ON pa.productfiltervalueid = pfv.productfiltervalueid
                WHERE pfv.productfilterid IN (1,2)
                {year_filter_month}
                GROUP BY year, month, pfv.productfiltervalueid
                ORDER BY year, month, pfv.productfiltervalueid
            ''', params_month)
            rows_month = cursor.fetchall()
            result_month = [
                {
                    'year': int(row[0]),
                    'month': int(row[1]),
                    'productfiltervalueid': row[2],
                    'salequantity': int(row[3])
                }
                for row in rows_month
            ]

        # Lấy dữ liệu group theo quý
        with connection.cursor() as cursor:
            cursor.execute(f'''
                SELECT 
                    EXTRACT(YEAR FROM o.orderdate) AS year,
                    FLOOR((EXTRACT(MONTH FROM o.orderdate)-1)/3)+1 AS quarter,
                    pfv.productfiltervalueid,
                    SUM(op.quantity) AS salequantity
                FROM order_product op
                JOIN orders o ON op.orderid = o.orderid
                JOIN product_attributes pa ON op.productid = pa.productid
                JOIN product_filter_values pfv ON pa.productfiltervalueid = pfv.productfiltervalueid
                WHERE pfv.productfilterid IN (1,2)
                {year_filter_quarter}
                GROUP BY year, quarter, pfv.productfiltervalueid
                ORDER BY year, quarter, pfv.productfiltervalueid
            ''', params_quarter)
            rows_quarter = cursor.fetchall()
            result_quarter = [
                {
                    'year': int(row[0]),
                    'quarter': int(row[1]),
                    'productfiltervalueid': row[2],
                    'salequantity': int(row[3])
                }
                for row in rows_quarter
            ]

        # Convert to DataFrame for model training
        df_month = pd.DataFrame(result_month)
        df_quarter = pd.DataFrame(result_quarter)

        model_info_month = None
        model_info_quarter = None
        try:
            if not df_month.empty:
                model_info_month = train_bestseller_model(df_month, model_filename='bestseller_month_model.joblib', time_col='month')
        except Exception as e:
            model_info_month = {'error': f'Error training 3-year month model: {str(e)}'}
        try:
            if not df_quarter.empty:
                model_info_quarter = train_bestseller_model(df_quarter, model_filename='bestseller_quarter_model.joblib', time_col='quarter')
        except Exception as e:
            model_info_quarter = {'error': f'Error training 5-year quarter model: {str(e)}'}

        response_data = {
            'data_month': result_month,
            'data_quarter': result_quarter,
            'model_info_month': model_info_month,
            'model_info_quarter': model_info_quarter
        }
        return Response(response_data)

@csrf_exempt
def predict(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            model_id = data.get('model_id')
            input_data = data.get('input_data')
            
            if not model_id or not input_data:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Missing required fields: model_id or input_data'
                }, status=400)
            
            try:
                model = PredictionModel.objects.get(id=model_id)
            except PredictionModel.DoesNotExist:
                return JsonResponse({
                    'status': 'error',
                    'message': f'Model with id {model_id} not found'
                }, status=404)
            
            # Here you would implement your actual prediction logic
            # This is just a placeholder
            prediction_result = {'prediction': 'placeholder'}
            
            # Save the prediction result
            result = PredictionResult.objects.create(
                model=model,
                input_data=input_data,
                output_data=prediction_result
            )
            
            return JsonResponse({
                'status': 'success',
                'prediction': prediction_result,
                'result_id': result.id
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'status': 'error',
                'message': 'Invalid JSON format in request body'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=500)
            
    return JsonResponse({
        'status': 'error',
        'message': 'Only POST requests are allowed'
    }, status=405)

class BestsellerPredictionView(APIView):
    permission_classes = [permissions.AllowAny]

    @swagger_auto_schema(
        operation_summary="Predict if a product is a bestseller",
        operation_description="Predict if a product is a bestseller based on its sales data",
        request_body=BestsellerPredictionInputSerializer,
        responses={
            200: openapi.Response(
                description="Prediction result",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'bestseller': openapi.Schema(type=openapi.TYPE_INTEGER),
                        'probability': openapi.Schema(type=openapi.TYPE_NUMBER),
                    }
                )
            ),
            400: "Bad Request",
            500: "Internal Server Error"
        }
    )
    def post(self, request):
        serializer = BestsellerPredictionInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        try:
            features = dict(serializer.validated_data)
            filter_type = features.pop('filter_type')  # loại bỏ filter_type khỏi features

            if filter_type == 'quarter':
                # Đổi key 'month' thành 'quarter'
                features['quarter'] = features.pop('month')
                model_path = 'prediction/models/bestseller_quarter_model.joblib'
                # Chỉ giữ đúng các cột model quý cần
                feature_df = pd.DataFrame([{
                    'year': features['year'],
                    'quarter': features['quarter'],
                    'productfiltervalueid': features['productfiltervalueid'],
                    'salequantity': features['salequantity']
                }])
            else:
                model_path = 'prediction/models/bestseller_month_model.joblib'
                # Chỉ giữ đúng các cột model tháng cần
                feature_df = pd.DataFrame([{
                    'year': features['year'],
                    'month': features['month'],
                    'productfiltervalueid': features['productfiltervalueid'],
                    'salequantity': features['salequantity']
                }])

            prediction = predict_bestseller(feature_df, model_path=model_path)
            
            return Response(prediction)
        except FileNotFoundError:
            return Response(
                {'error': 'Model not found. Please train the model first.'},
                status=404
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=500
            )

class PredictBestsellerByTimeView(APIView):
    permission_classes = [permissions.AllowAny]

    @swagger_auto_schema(
        operation_summary="Predict bestseller by time",
        operation_description="Dự đoán bestseller theo tháng hoặc quý cho từng productfiltervalueid. Truyền filter_type ('month' hoặc 'quarter'), value (giá trị tháng 1-12 hoặc quý 1-4).",
        manual_parameters=[
            openapi.Parameter('filter_type', openapi.IN_QUERY, description="'month' hoặc 'quarter'", type=openapi.TYPE_STRING, required=True),
            openapi.Parameter('value', openapi.IN_QUERY, description="Giá trị tháng (1-12) hoặc quý (1-4)", type=openapi.TYPE_INTEGER, required=True),
        ],
        responses={200: openapi.Response(
            description="Prediction result",
            schema=openapi.Schema(
                type=openapi.TYPE_ARRAY,
                items=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'productfiltervalueid': openapi.Schema(type=openapi.TYPE_INTEGER),
                        'bestseller': openapi.Schema(type=openapi.TYPE_INTEGER),
                        'probability': openapi.Schema(type=openapi.TYPE_NUMBER),
                        'salequantity': openapi.Schema(type=openapi.TYPE_INTEGER),
                        'month': openapi.Schema(type=openapi.TYPE_INTEGER),
                        'quarter': openapi.Schema(type=openapi.TYPE_INTEGER),
                        'year': openapi.Schema(type=openapi.TYPE_INTEGER),
                    }
                )
            )
        )}
    )
    def get(self, request):
        filter_type = request.GET.get('filter_type')
        value = request.GET.get('value')
        # Không lấy year từ request
        # Validate
        if filter_type not in ['month', 'quarter']:
            return Response({'error': "filter_type must be 'month' or 'quarter'"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            value = int(value)
        except Exception:
            return Response({'error': 'value must be integer'}, status=status.HTTP_400_BAD_REQUEST)
        if filter_type == 'month' and not (1 <= value <= 12):
            return Response({'error': 'value must be between 1 and 12 for month'}, status=status.HTTP_400_BAD_REQUEST)
        if filter_type == 'quarter' and not (1 <= value <= 4):
            return Response({'error': 'value must be between 1 and 4 for quarter'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            results = self.predict_bestseller_by_time(filter_type, value)
            return Response(results)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def predict_bestseller_by_time(self, filter_type, value):
        """
        filter_type: 'month' hoặc 'quarter'
        value: giá trị tháng (1-12) hoặc quý (1-4)
        """
        from .ml_models import predict_bestseller
        import pandas as pd
        import os
        import datetime
        model_dir = 'prediction/models'
        year = datetime.datetime.now().year - 1
        # Lấy map id -> value
        id_to_value = dict(ProductFilterValues.objects.values_list('productfiltervalueid', 'value'))
        if filter_type == 'month':
            # Lấy data theo tháng
            with connection.cursor() as cursor:
                cursor.execute('''
                    SELECT 
                        EXTRACT(YEAR FROM o.orderdate) AS year,
                        EXTRACT(MONTH FROM o.orderdate) AS month,
                        pfv.productfiltervalueid,
                        SUM(op.quantity) AS salequantity
                    FROM order_product op
                    JOIN orders o ON op.orderid = o.orderid
                    JOIN product_attributes pa ON op.productid = pa.productid
                    JOIN product_filter_values pfv ON pa.productfiltervalueid = pfv.productfiltervalueid
                    WHERE pfv.productfilterid IN (1,2)
                        AND EXTRACT(YEAR FROM o.orderdate) = %s
                        AND EXTRACT(MONTH FROM o.orderdate) = %s
                    GROUP BY year, month, pfv.productfiltervalueid
                    ORDER BY year, month, pfv.productfiltervalueid
                ''', [year, value])
                rows = cursor.fetchall()
                data = [
                    {
                        'year': int(row[0]),
                        'month': int(row[1]),
                        'productfiltervalueid': row[2],
                        'salequantity': int(row[3])
                    }
                    for row in rows
                ]
            # Dự đoán
            results = []
            for d in data:
                # Đảm bảo truyền đúng feature cho model tháng
                d_for_model = {
                    'year': d['year'],
                    'month': d['month'],
                    'productfiltervalueid': d['productfiltervalueid'],
                    'salequantity': d['salequantity']
                }
                df = pd.DataFrame([d_for_model])
                model_path = os.path.join(model_dir, 'bestseller_month_model.joblib')
                pred = predict_bestseller(df, model_path=model_path)
                if pred['bestseller'] == 1:
                    results.append({
                        'productfiltervalueid': d['productfiltervalueid'],
                        'value': id_to_value.get(d['productfiltervalueid']),
                        'bestseller': pred['bestseller'],
                        'probability': pred['probability'],
                        'salequantity': d['salequantity'],
                        'month': d['month'],
                        'year': d['year']
                    })
            return results
        elif filter_type == 'quarter':
            # Lấy data theo quý
            with connection.cursor() as cursor:
                cursor.execute('''
                    SELECT 
                        EXTRACT(YEAR FROM o.orderdate) AS year,
                        FLOOR((EXTRACT(MONTH FROM o.orderdate)-1)/3)+1 AS quarter,
                        pfv.productfiltervalueid,
                        SUM(op.quantity) AS salequantity
                    FROM order_product op
                    JOIN orders o ON op.orderid = o.orderid
                    JOIN product_attributes pa ON op.productid = pa.productid
                    JOIN product_filter_values pfv ON pa.productfiltervalueid = pfv.productfiltervalueid
                    WHERE pfv.productfilterid IN (1,2)
                        AND EXTRACT(YEAR FROM o.orderdate) = %s
                        AND FLOOR((EXTRACT(MONTH FROM o.orderdate)-1)/3)+1 = %s
                    GROUP BY year, quarter, pfv.productfiltervalueid
                    ORDER BY year, quarter, pfv.productfiltervalueid
                ''', [year, value])
                rows = cursor.fetchall()
                data = [
                    {
                        'year': int(row[0]),
                        'quarter': int(row[1]),
                        'productfiltervalueid': row[2],
                        'salequantity': int(row[3])
                    }
                    for row in rows
                ]
            # Dự đoán
            results = []
            for d in data:
                # Đảm bảo truyền đúng feature cho model quý
                d_for_model = {
                    'year': d['year'],
                    'quarter': d['quarter'],
                    'productfiltervalueid': d['productfiltervalueid'],
                    'salequantity': d['salequantity']
                }
                df = pd.DataFrame([d_for_model])
                model_path = os.path.join(model_dir, 'bestseller_quarter_model.joblib')
                pred = predict_bestseller(df, model_path=model_path)
                if pred['bestseller'] == 1:
                    results.append({
                        'productfiltervalueid': d['productfiltervalueid'],
                        'value': id_to_value.get(d['productfiltervalueid']),
                        'bestseller': pred['bestseller'],
                        'probability': pred['probability'],
                        'salequantity': d['salequantity'],
                        'quarter': d['quarter'],
                        'year': d['year']
                    })
            return results
        else:
            raise ValueError('filter_type must be "month" or "quarter"')
