# PowerShell script to start Drools Decision Table Application
# Set execution policy if needed: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Set console properties
$Host.UI.RawUI.WindowTitle = "Drools Decision Table Application"
Write-Host "================================================================================" -ForegroundColor Green
Write-Host "Starting Drools Decision Table Application..." -ForegroundColor Green
Write-Host "================================================================================" -ForegroundColor Green
Write-Host "This will start the Spring Boot application with PostgreSQL configuration" -ForegroundColor Yellow
Write-Host "Make sure PostgreSQL is running on localhost:5432" -ForegroundColor Yellow
Write-Host ""
Write-Host "Once started, you can access:" -ForegroundColor Cyan
Write-Host "- Swagger UI: http://localhost:8080/swagger-ui.html" -ForegroundColor White
Write-Host "- API Documentation: http://localhost:8080/v3/api-docs" -ForegroundColor White
Write-Host "- Auto Assignment Endpoint: POST http://localhost:8080/api/autoassignment" -ForegroundColor White
Write-Host ""

# Function to check if a command exists
function Test-Command {
    param($Command)
    try {
        Get-Command $Command -ErrorAction Stop
        return $true
    }
    catch {
        return $false
    }
}

# Check if Maven is installed
if (-not (Test-Command "mvn")) {
    Write-Host "ERROR: Maven is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Maven and ensure it's in your system PATH" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Java is installed
if (-not (Test-Command "java")) {
    Write-Host "ERROR: Java is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Java JDK and ensure it's in your system PATH" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

try {
    # Clean and compile
    Write-Host "Cleaning and compiling..." -ForegroundColor Yellow
    $result = & mvn clean compile
    if ($LASTEXITCODE -ne 0) {
        throw "Maven compile failed"
    }
    Write-Host "Compile successful!" -ForegroundColor Green

    # Package
    Write-Host "Packaging application..." -ForegroundColor Yellow
    $result = & mvn clean package
    if ($LASTEXITCODE -ne 0) {
        throw "Maven package failed"
    }
    Write-Host "Package successful!" -ForegroundColor Green

    # Start application
    Write-Host "Starting Spring Boot application..." -ForegroundColor Yellow
    Write-Host "Application is starting... This may take a few moments." -ForegroundColor Cyan
    & mvn spring-boot:run
    
    if ($LASTEXITCODE -ne 0) {
        throw "Application failed to start"
    }
}
catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Application has stopped." -ForegroundColor Yellow
Read-Host "Press Enter to exit" 