#!/bin/bash

# =============================================================================
# Smashminton Prediction Server Setup Script
# Compatible with Windows (Git Bash/WSL) and Linux
# =============================================================================

set -e  # Exit on any error

# =============================================================================
# CONFIGURATION AND CONSTANTS
# =============================================================================

# Terminal colors for pretty output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Global variables (will be set during execution)
OS=""
PYTHON_CMD=""
PIP_CMD=""
ACTIVATE_CMD=""
PYTHON_IN_VENV=""

# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

# Print colored status messages
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_section() {
    echo -e "\n${BLUE}=== $1 ===${NC}"
}

# =============================================================================
# SYSTEM DETECTION FUNCTIONS
# =============================================================================

# Detect the operating system
detect_os() {
    case "$(uname -s)" in
        Linux*)     OS="Linux";;
        Darwin*)    OS="Mac";;
        CYGWIN*)    OS="Cygwin";;
        MINGW*)     OS="MinGw";;
        MSYS*)      OS="Msys";;
        *)          OS="Unknown";;
    esac
    
    # Additional Windows detection for edge cases
    if [[ "$OS" == "Unknown" && (-n "$WINDIR" || -n "$windir") ]]; then
        OS="Windows"
    fi
    
    print_status "Detected OS: $OS"
}

# Find the correct Python command
get_python_cmd() {
    if command -v python3 &> /dev/null; then
        PYTHON_CMD="python3"
    elif command -v python &> /dev/null; then
        PYTHON_CMD="python"
    else
        print_error "Python is not installed or not in PATH"
        exit 1
    fi
    print_status "Using Python command: $PYTHON_CMD"
}

# Find the correct pip command
get_pip_cmd() {
    if command -v pip3 &> /dev/null; then
        PIP_CMD="pip3"
    elif command -v pip &> /dev/null; then
        PIP_CMD="pip"
    else
        PIP_CMD="$PYTHON_CMD -m pip"
    fi
    print_status "Using pip command: $PIP_CMD"
}

# =============================================================================
# VIRTUAL ENVIRONMENT FUNCTIONS
# =============================================================================

# Set the correct virtual environment paths based on OS
set_venv_paths() {
    if [[ "$OS" == "Windows" || "$OS" == "Cygwin" || "$OS" == "MinGw" || "$OS" == "Msys" ]]; then
        ACTIVATE_CMD="venv/Scripts/activate"
        PYTHON_IN_VENV="venv/Scripts/python"
    else
        ACTIVATE_CMD="venv/bin/activate"
        PYTHON_IN_VENV="venv/bin/python"
    fi
}

# Activate the virtual environment
activate_venv() {
    set_venv_paths
    
    if [[ -f "$ACTIVATE_CMD" ]]; then
        print_status "Activating virtual environment..."
        source "$ACTIVATE_CMD"
    else
        print_error "Virtual environment not found at $ACTIVATE_CMD"
        exit 1
    fi
}

# Create a new virtual environment
create_venv() {
    print_section "Creating Virtual Environment"
    
    # Check if virtual environment already exists
    if [[ -d "venv" ]]; then
        print_warning "Virtual environment already exists"
        read -p "Do you want to recreate it? (y/N): " -n 1 -r
        echo
        
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_status "Removing existing virtual environment..."
            rm -rf venv
        else
            print_status "Using existing virtual environment"
            return 0
        fi
    fi
    
    # Create new virtual environment
    print_status "Creating new virtual environment..."
    $PYTHON_CMD -m venv venv
    
    if [[ $? -eq 0 ]]; then
        print_status "Virtual environment created successfully"
    else
        print_error "Failed to create virtual environment"
        exit 1
    fi
}

# =============================================================================
# DEPENDENCY MANAGEMENT FUNCTIONS
# =============================================================================

# Install Python dependencies from requirements.txt
install_dependencies() {
    print_section "Installing Dependencies"
    
    # Check if requirements.txt exists
    if [[ ! -f "requirements.txt" ]]; then
        print_error "requirements.txt not found"
        exit 1
    fi
    
    # Activate virtual environment and install dependencies
    activate_venv
    
    print_status "Upgrading pip..."
    $PIP_CMD install --upgrade pip
    
    print_status "Installing dependencies from requirements.txt..."
    $PIP_CMD install -r requirements.txt
    
    if [[ $? -eq 0 ]]; then
        print_status "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
}

# =============================================================================
# DATABASE FUNCTIONS
# =============================================================================

# Apply Django database migrations
apply_migrations() {
    print_section "Applying Database Migrations"
    
    activate_venv
    
    # Check if manage.py exists
    if [[ ! -f "manage.py" ]]; then
        print_error "manage.py not found. Make sure you're in the correct directory"
        exit 1
    fi
    
    print_status "Applying migrations..."
    $PYTHON_IN_VENV manage.py migrate
    
    if [[ $? -eq 0 ]]; then
        print_status "Migrations applied successfully"
    else
        print_error "Failed to apply migrations"
        exit 1
    fi
}

# =============================================================================
# SERVER FUNCTIONS
# =============================================================================

# Start the Django development server
run_server() {
    print_section "Starting Development Server"
    
    read -p "Do you want to start the development server now? (Y/n): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Nn]$ ]]; then
        print_status "Skipping server startup"
        print_status "To start the server later, run:"
        print_status "  source $ACTIVATE_CMD"
        print_status "  $PYTHON_IN_VENV manage.py runserver"
        return 0
    fi
    
    activate_venv
    print_status "Starting Django development server..."
    print_status "Server will be available at: http://127.0.0.1:8000/"
    print_status "Press Ctrl+C to stop the server"
    
    $PYTHON_IN_VENV manage.py runserver
}

# =============================================================================
# HELP AND USAGE FUNCTIONS
# =============================================================================

# Display script usage information
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --help     Show this help message"
    echo "  --skip-venv    Skip virtual environment creation"
    echo "  --skip-deps    Skip dependency installation"
    echo "  --skip-migrate Skip database migrations"
    echo "  --skip-server  Skip starting the development server"
    echo "  --full-auto    Run full setup without prompts"
    echo ""
}

# =============================================================================
# MAIN SETUP FUNCTION
# =============================================================================

main() {
    print_section "Smashminton Prediction Server Setup"
    
    # Initialize command line flags
    SKIP_VENV=false
    SKIP_DEPS=false
    SKIP_MIGRATE=false
    SKIP_SERVER=false
    FULL_AUTO=false
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_usage
                exit 0
                ;;
            --skip-venv)
                SKIP_VENV=true
                shift
                ;;
            --skip-deps)
                SKIP_DEPS=true
                shift
                ;;
            --skip-migrate)
                SKIP_MIGRATE=true
                shift
                ;;
            --skip-server)
                SKIP_SERVER=true
                shift
                ;;
            --full-auto)
                FULL_AUTO=true
                shift
                ;;
            *)
                print_error "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
    
    # System detection and setup
    detect_os
    get_python_cmd
    get_pip_cmd
    
    # Run setup steps based on flags
    if [[ "$SKIP_VENV" != true ]]; then
        create_venv
    fi
    
    if [[ "$SKIP_DEPS" != true ]]; then
        install_dependencies
    fi
    
    if [[ "$SKIP_MIGRATE" != true ]]; then
        apply_migrations
    fi
    
    # Handle server startup
    if [[ "$SKIP_SERVER" != true ]]; then
        if [[ "$FULL_AUTO" == true ]]; then
            print_status "Setup completed successfully!"
            print_status "To start the server, run:"
            print_status "  source $ACTIVATE_CMD"
            print_status "  $PYTHON_IN_VENV manage.py runserver"
        else
            run_server
        fi
    fi
}

# =============================================================================
# SCRIPT ENTRY POINT
# =============================================================================

# Run main function with all command line arguments
main "$@" 