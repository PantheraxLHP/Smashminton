@echo off
echo Setting up Smashminton Prediction Server...

REM Create virtual environment
python -m venv venv

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Upgrade pip
python -m pip install --upgrade pip

REM Install dependencies
pip install -r requirements.txt

REM Apply migrations
python manage.py migrate

REM Ask for superuser creation
set /p create_super="Create superuser? (y/n): "
if /i "%create_super%"=="y" python manage.py createsuperuser

REM Ask to start server
set /p start_server="Start development server? (y/n): "
if /i "%start_server%"=="y" python manage.py runserver

pause 