# Smashminton Prediction Server

A Django-based prediction server for Smashminton sports club management system.

## Setup

1. Create and activate virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Apply database migrations:

```bash
python manage.py migrate
```

4. Create a superuser (optional):

```bash
python manage.py createsuperuser
```

5. Run the development server:

```bash
python manage.py runserver
```

## API Endpoints

### Predict

- URL: `/api/predict/`
- Method: POST
- Request Body:

```json
{
  "model_id": 1,
  "input_data": {
    // Your prediction input data
  }
}
```

- Response:

```json
{
  "status": "success",
  "prediction": {
    // Prediction results
  },
  "result_id": 1
}
```

## Models

### PredictionModel

- name: Name of the model
- description: Description of the model
- model_file: Uploaded model file
- created_at: Creation timestamp
- updated_at: Last update timestamp

### PredictionResult

- model: Reference to PredictionModel
- input_data: JSON input data
- output_data: JSON prediction results
- created_at: Creation timestamp

---
predictionServer/
│
├── manage.py
├── requirements.txt
├── README.md
│
├── predictionServer/         # Thư mục cấu hình chính của project Django
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py           # File cấu hình toàn hệ thống (database, app, static, ...)
│   ├── urls.py               # Định nghĩa các route tổng của project
│   └── wsgi.py
│
├── prediction/               # App prediction: nơi chứa logic nghiệp vụ
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── migrations/           # Thư mục chứa các file migration (quản lý schema DB)
│   ├── models.py             # Định nghĩa các model mapping với bảng DB
│   ├── serializers.py        # Định nghĩa các serializer cho API (REST)
│   ├── templates/
│   │   └── prediction/
│   │       └── home.html     # Template cho trang chủ
│   ├── tests.py
│   ├── urls.py               # Định nghĩa các route riêng cho app prediction
│   └── views.py              # Chứa các view (API endpoint, logic xử lý request)
│
├── venv/                     # Virtual environment (thư mục môi trường ảo Python)
└── db.sqlite3                # (Nếu có) file database SQLite mặc định

## 3. Vai trò các file/thư mục chính

### Ở cấp project (`predictionServer/`):

- **manage.py**: Công cụ dòng lệnh để quản lý project (chạy server, migrate, tạo app, ...)
- **requirements.txt**: Danh sách các thư viện Python cần cài đặt
- **README.md**: Hướng dẫn sử dụng project

### Thư mục cấu hình project (`predictionServer/predictionServer/`):

- **settings.py**: Cấu hình database, app, static, middleware, ...
- **urls.py**: Định nghĩa các route tổng, bao gồm route cho admin, API, swagger, ...
- **wsgi.py/asgi.py**: Cấu hình cho server WSGI/ASGI (dùng khi deploy production)

### App prediction (`predictionServer/prediction/`):

- **models.py**: Định nghĩa các model mapping với các bảng trong database (products, orders, order_product, ...)
- **serializers.py**: Định nghĩa các serializer để chuyển đổi dữ liệu giữa model và JSON (REST API)
- **views.py**: Chứa các class/function xử lý request (API endpoint, logic nghiệp vụ)
- **urls.py**: Định nghĩa các route riêng cho app prediction (có thể include vào urls tổng)
- **templates/**: Chứa các file HTML template (nếu có render HTML)
- **migrations/**: Chứa các file migration để quản lý schema database

---

## 4. Cách các thành phần kết nối với nhau

- **Client** (browser, Postman, Swagger UI) gửi request tới server
- **urls.py** (project) định tuyến request tới app phù hợp (ví dụ: `/api/` tới prediction)
- **urls.py** (app) định tuyến tiếp tới view phù hợp
- **views.py** xử lý logic, truy vấn database qua **models.py**, serialize dữ liệu qua **serializers.py** và trả về response (JSON hoặc HTML)
- **templates/** chỉ dùng nếu trả về HTML (ví dụ: trang chủ)

---

## 5. Một số điểm nổi bật trong project

- Sử dụng **Django REST Framework** để xây dựng API
- Sử dụng **drf-yasg** để tự động sinh tài liệu Swagger cho API
- Mapping trực tiếp các bảng PostgreSQL (managed = False) để chỉ đọc dữ liệu, không để Django tự động quản lý schema
- Có endpoint analytics group by tháng/quý, filter theo năm, phục vụ dashboard thống kê
