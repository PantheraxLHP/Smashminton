#!/bin/bash

# Bash script to start Drools Decision Table Application

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Set terminal title
echo -ne "\033]0;Drools Decision Table Application\007"

echo -e "${GREEN}================================================================================${NC}"
echo -e "${GREEN}Starting Drools Decision Table Application...${NC}"
echo -e "${GREEN}================================================================================${NC}"
echo -e "${YELLOW}This will start the Spring Boot application with PostgreSQL configuration${NC}"
echo -e "${YELLOW}Make sure PostgreSQL is running on localhost:5432${NC}"
echo ""
echo -e "${CYAN}Once started, you can access:${NC}"
echo -e "${WHITE}- Swagger UI: http://localhost:8080/swagger-ui.html${NC}"
echo -e "${WHITE}- API Documentation: http://localhost:8080/v3/api-docs${NC}"
echo -e "${WHITE}- Auto Assignment Endpoint: POST http://localhost:8080/api/autoassignment${NC}"
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function for error exit with user input
error_exit() {
    echo -e "${RED}$1${NC}"
    echo -n "Press Enter to exit..."
    read
    exit 1
}

# Check if Maven is installed
if ! command_exists mvn; then
    echo -e "${RED}ERROR: Maven is not installed or not in PATH${NC}"
    error_exit "Please install Maven and ensure it's in your system PATH"
fi

# Check if Java is installed
if ! command_exists java; then
    echo -e "${RED}ERROR: Java is not installed or not in PATH${NC}"
    error_exit "Please install Java JDK and ensure it's in your system PATH"
fi

# Main execution with error handling
{
    # Clean and compile
    echo -e "${YELLOW}Cleaning and compiling...${NC}"
    if ! mvn clean compile; then
        error_exit "ERROR: Maven compile failed"
    fi
    echo -e "${GREEN}Compile successful!${NC}"

    # Package
    echo -e "${YELLOW}Packaging application...${NC}"
    if ! mvn clean package; then
        error_exit "ERROR: Maven package failed"
    fi
    echo -e "${GREEN}Package successful!${NC}"

    # Start application
    echo -e "${YELLOW}Starting Spring Boot application...${NC}"
    echo -e "${CYAN}Application is starting... This may take a few moments.${NC}"
    
    # Run the application (this will block until the application stops)
    mvn spring-boot:run
    
    # Check if the application failed to start
    if [ $? -ne 0 ]; then
        error_exit "ERROR: Application failed to start"
    fi
    
} || {
    error_exit "ERROR: An unexpected error occurred"
}

echo -e "${YELLOW}Application has stopped.${NC}"
echo -n "Press Enter to exit..."
read 