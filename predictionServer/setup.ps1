    # =============================================================================
    # Smashminton Prediction Server Setup Script for Windows PowerShell
    # =============================================================================

    param(
        [switch]$Help,
        [switch]$SkipVenv,
        [switch]$SkipDeps,
        [switch]$SkipMigrate,
        [switch]$SkipServer,
        [switch]$FullAuto
    )

    # Set error action preference to stop on errors
    $ErrorActionPreference = "Stop"

    # =============================================================================
    # CONFIGURATION AND CONSTANTS
    # =============================================================================

    # Global variables
    $script:PythonCmd = ""
    $script:PipCmd = ""
    $script:VenvPath = "venv"
    $script:ActivateScript = "venv\Scripts\Activate.ps1"
    $script:PythonInVenv = "venv\Scripts\python.exe"

    # =============================================================================
    # UTILITY FUNCTIONS
    # =============================================================================

    function Write-Status {
        param([string]$Message)
        Write-Host "[INFO] $Message" -ForegroundColor Green
    }

    function Write-Warning {
        param([string]$Message)
        Write-Host "[WARNING] $Message" -ForegroundColor Yellow
    }

    function Write-Error {
        param([string]$Message)
        Write-Host "[ERROR] $Message" -ForegroundColor Red
    }

    function Write-Section {
        param([string]$Title)
        Write-Host ""
        Write-Host "=== $Title ===" -ForegroundColor Blue
    }

    # =============================================================================
    # SYSTEM DETECTION FUNCTIONS
    # =============================================================================

    function Test-Command {
        param([string]$CommandName)
        return (Get-Command $CommandName -ErrorAction SilentlyContinue) -ne $null
    }

    function Get-PythonCommand {
        Write-Status "Detecting Python installation..."
        
        if (Test-Command "python") {
            $script:PythonCmd = "python"
            $version = & python --version 2>&1
            Write-Status "Found Python: $version"
        } elseif (Test-Command "python3") {
            $script:PythonCmd = "python3"
            $version = & python3 --version 2>&1
            Write-Status "Found Python3: $version"
        } else {
            Write-Error "Python is not installed or not in PATH"
            Write-Host "Please install Python from https://www.python.org/downloads/" -ForegroundColor Yellow
            exit 1
        }
        
        Write-Status "Using Python command: $script:PythonCmd"
    }

    function Get-PipCommand {
        Write-Status "Detecting pip installation..."
        
        if (Test-Command "pip") {
            $script:PipCmd = "pip"
        } elseif (Test-Command "pip3") {
            $script:PipCmd = "pip3"
        } else {
            $script:PipCmd = "$script:PythonCmd -m pip"
        }
        
        Write-Status "Using pip command: $script:PipCmd"
    }

    # =============================================================================
    # VIRTUAL ENVIRONMENT FUNCTIONS
    # =============================================================================

    function Test-VirtualEnvironment {
        return (Test-Path $script:VenvPath) -and (Test-Path $script:ActivateScript)
    }

    function Invoke-InVirtualEnvironment {
        param([scriptblock]$ScriptBlock)
        
        if (-not (Test-VirtualEnvironment)) {
            Write-Error "Virtual environment not found at $script:VenvPath"
            exit 1
        }
        
        Write-Status "Activating virtual environment..."
        
        # Execute the script block in the virtual environment context
        $originalPath = $env:PATH
        $venvScripts = Join-Path (Resolve-Path $script:VenvPath) "Scripts"
        $env:PATH = "$venvScripts;$env:PATH"
        
        try {
            & $ScriptBlock
        } finally {
            $env:PATH = $originalPath
        }
    }

    function New-VirtualEnvironment {
        Write-Section "Creating Virtual Environment"
        
        if (Test-Path $script:VenvPath) {
            Write-Warning "Virtual environment already exists"
            
            if (-not $FullAuto) {
                $response = Read-Host "Do you want to recreate it? (y/N)"
                if ($response -notmatch "^[Yy]$") {
                    Write-Status "Using existing virtual environment"
                    return
                }
            } else {
                Write-Status "Using existing virtual environment"
                return
            }
            
            Write-Status "Removing existing virtual environment..."
            Remove-Item -Recurse -Force $script:VenvPath
        }
        
        Write-Status "Creating new virtual environment..."
        try {
            & $script:PythonCmd -m venv $script:VenvPath
            Write-Status "Virtual environment created successfully"
        } catch {
            Write-Error "Failed to create virtual environment: $_"
            exit 1
        }
        
        # Check if activation script was created
        if (-not (Test-Path $script:ActivateScript)) {
            Write-Error "Virtual environment creation failed - activation script not found"
            exit 1
        }
    }

    # =============================================================================
    # DEPENDENCY MANAGEMENT FUNCTIONS
    # =============================================================================

    function Install-Dependencies {
        Write-Section "Installing Dependencies"
        
        if (-not (Test-Path "requirements.txt")) {
            Write-Error "requirements.txt not found in current directory"
            exit 1
        }
        
        Invoke-InVirtualEnvironment {
            Write-Status "Upgrading pip..."
            try {
                & $script:PythonInVenv -m pip install --upgrade pip
            } catch {
                Write-Error "Failed to upgrade pip: $_"
                exit 1
            }
            
            Write-Status "Installing dependencies from requirements.txt..."
            try {
                & $script:PythonInVenv -m pip install -r requirements.txt
                Write-Status "Dependencies installed successfully"
            } catch {
                Write-Error "Failed to install dependencies: $_"
                exit 1
            }
        }
    }

    # =============================================================================
    # DATABASE FUNCTIONS
    # =============================================================================

    function Invoke-DatabaseMigrations {
        Write-Section "Applying Database Migrations"
        
        if (-not (Test-Path "manage.py")) {
            Write-Error "manage.py not found. Make sure you're in the correct directory"
            exit 1
        }
        
        Invoke-InVirtualEnvironment {
            Write-Status "Applying migrations..."
            try {
                & $script:PythonInVenv manage.py migrate
                Write-Status "Migrations applied successfully"
            } catch {
                Write-Error "Failed to apply migrations: $_"
                exit 1
            }
        }
    }

    # =============================================================================
    # SERVER FUNCTIONS
    # =============================================================================

    function Start-DevelopmentServer {
        Write-Section "Starting Development Server"
        
        if (-not $FullAuto) {
            $response = Read-Host "Do you want to start the development server now? (Y/n)"
            if ($response -match "^[Nn]$") {
                Write-Status "Skipping server startup"
                Write-Status "To start the server later, run:"
                Write-Status "  .\venv\Scripts\Activate.ps1"
                Write-Status "  python manage.py runserver"
                return
            }
        } else {
            Write-Status "Setup completed successfully!"
            Write-Status "To start the server, run:"
            Write-Status "  .\venv\Scripts\Activate.ps1"
            Write-Status "  python manage.py runserver"
            return
        }
        
        Invoke-InVirtualEnvironment {
            Write-Status "Starting Django development server..."
            Write-Status "Server will be available at: http://127.0.0.1:8000/"
            Write-Status "Press Ctrl+C to stop the server"
            
            try {
                & $script:PythonInVenv manage.py runserver
            } catch {
                Write-Error "Failed to start development server: $_"
                exit 1
            }
        }
    }

    # =============================================================================
    # HELP AND USAGE FUNCTIONS
    # =============================================================================

    function Show-Usage {
        Write-Host "Smashminton Prediction Server Setup Script for Windows PowerShell"
        Write-Host ""
        Write-Host "Usage: .\setup.ps1 [OPTIONS]"
        Write-Host ""
        Write-Host "Options:"
        Write-Host "  -Help          Show this help message"
        Write-Host "  -SkipVenv      Skip virtual environment creation"
        Write-Host "  -SkipDeps      Skip dependency installation"
        Write-Host "  -SkipMigrate   Skip database migrations"
        Write-Host "  -SkipServer    Skip starting the development server"
        Write-Host "  -FullAuto      Run full setup without prompts"
        Write-Host ""
        Write-Host "Examples:"
        Write-Host "  .\setup.ps1                    # Full interactive setup"
        Write-Host "  .\setup.ps1 -FullAuto         # Automated setup without prompts"
        Write-Host "  .\setup.ps1 -SkipServer       # Setup without starting server"
        Write-Host ""
    }

    # =============================================================================
    # MAIN SETUP FUNCTION
    # =============================================================================

    function Start-Setup {
        Write-Section "Smashminton Prediction Server Setup"
        
        # Check PowerShell execution policy
        $executionPolicy = Get-ExecutionPolicy
        if ($executionPolicy -eq "Restricted") {
            Write-Warning "PowerShell execution policy is set to Restricted"
            Write-Host "You may need to run: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" -ForegroundColor Yellow
        }
        
        # Handle help request
        if ($Help) {
            Show-Usage
            exit 0
        }
        
        # System detection and setup
        Write-Status "Detected OS: Windows"
        Get-PythonCommand
        Get-PipCommand
        
        # Verify we're in the correct directory
        if (-not (Test-Path "manage.py") -and -not $SkipMigrate) {
            Write-Warning "manage.py not found in current directory"
            Write-Host "Make sure you're running this script from the Django project root" -ForegroundColor Yellow
        }
        
        # Run setup steps based on parameters
        try {
            if (-not $SkipVenv) {
                New-VirtualEnvironment
            }
            
            if (-not $SkipDeps) {
                Install-Dependencies
            }
            
            if (-not $SkipMigrate) {
                Invoke-DatabaseMigrations
            }
            
            if (-not $SkipServer) {
                Start-DevelopmentServer
            }
            
            Write-Status "Setup process completed successfully!"
            
        } catch {
            Write-Error "Setup failed: $_"
            exit 1
        }
    }

    # =============================================================================
    # SCRIPT ENTRY POINT
    # =============================================================================

    # Check if script is being run with PowerShell
    if ($PSVersionTable.PSVersion.Major -lt 3) {
        Write-Error "This script requires PowerShell 3.0 or later"
        exit 1
    }

    # Run main setup function
    Start-Setup 