@echo off
echo Starting Drools Decision Table Application...
echo This will start the Spring Boot application with PostgreSQL configuration
echo Make sure PostgreSQL is running on localhost:5432
echo.
echo Once started, you can access:
echo - Swagger UI: http://localhost:8080/swagger-ui.html
echo - API Documentation: http://localhost:8080/v3/api-docs
echo - Auto Assignment Endpoint: POST http://localhost:8080/api/autoassignment
echo.
mvn spring-boot:run
