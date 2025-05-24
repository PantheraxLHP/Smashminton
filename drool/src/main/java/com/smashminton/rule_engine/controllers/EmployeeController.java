package com.smashminton.rule_engine.controllers;

import com.smashminton.rule_engine.entities.Employee;
import com.smashminton.rule_engine.services.EmployeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@Tag(name = "Employee Management", description = "APIs for managing employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping
    @Operation(
        summary = "Get all employees",
        description = "Retrieves a list of all employees in the system"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved all employees",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = Employee.class)
            )
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error"
        )
    })
    public ResponseEntity<List<Employee>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @GetMapping("/{id}")
    @Operation(
        summary = "Get employee by ID",
        description = "Retrieves an employee by their ID"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved the employee",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = Employee.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Employee not found"
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error"
        )
    })
    public ResponseEntity<Employee> getEmployeeById(
            @Parameter(description = "Employee ID", required = true, example = "1")
            @PathVariable Integer id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    @GetMapping("/username/{username}")
    @Operation(
        summary = "Get employee by username",
        description = "Retrieves an employee by their username"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved the employee",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = Employee.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Employee not found"
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error"
        )
    })
    public ResponseEntity<Employee> getEmployeeByUsername(
            @Parameter(description = "Username", required = true, example = "john.doe")
            @PathVariable String username) {
        return ResponseEntity.ok(employeeService.getEmployeeByUsername(username));
    }

    @PostMapping
    @Operation(
        summary = "Create new employee",
        description = "Creates a new employee in the system"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully created the employee",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = Employee.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid input"
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error"
        )
    })
    public ResponseEntity<Employee> createEmployee(
            @Parameter(description = "Employee object", required = true)
            @RequestBody Employee employee) {
        return ResponseEntity.ok(employeeService.createEmployee(employee));
    }

    @PutMapping("/{id}")
    @Operation(
        summary = "Update employee",
        description = "Updates an existing employee"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully updated the employee",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = Employee.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Employee not found"
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error"
        )
    })
    public ResponseEntity<Employee> updateEmployee(
            @Parameter(description = "Employee ID", required = true, example = "1")
            @PathVariable Integer id,
            @Parameter(description = "Updated employee object", required = true)
            @RequestBody Employee employee) {
        return ResponseEntity.ok(employeeService.updateEmployee(id, employee));
    }

    @DeleteMapping("/{id}")
    @Operation(
        summary = "Delete employee",
        description = "Deletes an employee by their ID"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully deleted the employee"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Employee not found"
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error"
        )
    })
    public ResponseEntity<Void> deleteEmployee(
            @Parameter(description = "Employee ID", required = true, example = "1")
            @PathVariable Integer id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok().build();
    }
} 