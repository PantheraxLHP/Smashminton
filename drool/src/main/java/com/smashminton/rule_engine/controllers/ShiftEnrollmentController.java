package com.smashminton.rule_engine.controllers;

import com.smashminton.rule_engine.entities.ShiftEnrollment;
import com.smashminton.rule_engine.services.ShiftEnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import java.time.LocalDateTime;
import java.util.List;

@Tag(name = "Shift Enrollment", description = "Shift Enrollment management APIs")
@RestController
@RequestMapping("/api/shift-enrollments")
public class ShiftEnrollmentController {

    @Autowired
    private ShiftEnrollmentService shiftEnrollmentService;

    @Operation(summary = "Get all shift enrollments")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Found all shift enrollments"),
        @ApiResponse(responseCode = "404", description = "No shift enrollments found")
    })
    @GetMapping
    public ResponseEntity<List<ShiftEnrollment>> getAllShiftEnrollments() {
        return ResponseEntity.ok(shiftEnrollmentService.getAllShiftEnrollments());
    }

    @Operation(summary = "Get a shift enrollment by its composite ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Found the shift enrollment"),
        @ApiResponse(responseCode = "404", description = "Shift enrollment not found")
    })
    @GetMapping("/{employeeId}/{shiftId}/{shiftDate}")
    public ResponseEntity<ShiftEnrollment> getShiftEnrollmentById(
            @Parameter(description = "Employee ID") @PathVariable Integer employeeId,
            @Parameter(description = "Shift ID") @PathVariable Integer shiftId,
            @Parameter(description = "Shift date (format: yyyy-MM-dd'T'HH:mm:ss)") @PathVariable String shiftDate) {
        LocalDateTime date = LocalDateTime.parse(shiftDate);
        return ResponseEntity.ok(shiftEnrollmentService.getShiftEnrollmentById(employeeId, shiftId, date));
    }

    @Operation(summary = "Get shift enrollments by employee ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Found shift enrollments"),
        @ApiResponse(responseCode = "404", description = "No shift enrollments found")
    })
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<ShiftEnrollment>> getShiftEnrollmentsByEmployeeId(
            @Parameter(description = "Employee ID") @PathVariable Integer employeeId) {
        return ResponseEntity.ok(shiftEnrollmentService.getShiftEnrollmentsByEmployeeId(employeeId));
    }

    @Operation(summary = "Get shift enrollments by shift ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Found shift enrollments"),
        @ApiResponse(responseCode = "404", description = "No shift enrollments found")
    })
    @GetMapping("/shift/{shiftId}")
    public ResponseEntity<List<ShiftEnrollment>> getShiftEnrollmentsByShiftId(
            @Parameter(description = "Shift ID") @PathVariable Integer shiftId) {
        return ResponseEntity.ok(shiftEnrollmentService.getShiftEnrollmentsByShiftId(shiftId));
    }

    @Operation(summary = "Get shift enrollments by date")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Found shift enrollments"),
        @ApiResponse(responseCode = "404", description = "No shift enrollments found")
    })
    @GetMapping("/date/{date}")
    public ResponseEntity<List<ShiftEnrollment>> getShiftEnrollmentsByDate(
            @Parameter(description = "Date (format: yyyy-MM-dd'T'HH:mm:ss)") @PathVariable String date) {
        LocalDateTime parsedDate = LocalDateTime.parse(date);
        return ResponseEntity.ok(shiftEnrollmentService.getShiftEnrollmentsByDate(parsedDate));
    }

    @Operation(summary = "Create a new shift enrollment")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Shift enrollment created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    @PostMapping
    public ResponseEntity<ShiftEnrollment> createShiftEnrollment(
            @Parameter(description = "Shift enrollment details") @RequestBody ShiftEnrollment shiftEnrollment) {
        return ResponseEntity.ok(shiftEnrollmentService.createShiftEnrollment(shiftEnrollment));
    }

    @Operation(summary = "Update an existing shift enrollment")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Shift enrollment updated successfully"),
        @ApiResponse(responseCode = "404", description = "Shift enrollment not found"),
        @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    @PutMapping("/{employeeId}/{shiftId}/{shiftDate}")
    public ResponseEntity<ShiftEnrollment> updateShiftEnrollment(
            @Parameter(description = "Employee ID") @PathVariable Integer employeeId,
            @Parameter(description = "Shift ID") @PathVariable Integer shiftId,
            @Parameter(description = "Shift date (format: yyyy-MM-dd'T'HH:mm:ss)") @PathVariable String shiftDate,
            @Parameter(description = "Updated shift enrollment details") @RequestBody ShiftEnrollment shiftEnrollmentDetails) {
        LocalDateTime date = LocalDateTime.parse(shiftDate);
        return ResponseEntity.ok(shiftEnrollmentService.updateShiftEnrollment(employeeId, shiftId, date, shiftEnrollmentDetails));
    }

    @Operation(summary = "Delete a shift enrollment")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Shift enrollment deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Shift enrollment not found")
    })
    @DeleteMapping("/{employeeId}/{shiftId}/{shiftDate}")
    public ResponseEntity<Void> deleteShiftEnrollment(
            @Parameter(description = "Employee ID") @PathVariable Integer employeeId,
            @Parameter(description = "Shift ID") @PathVariable Integer shiftId,
            @Parameter(description = "Shift date (format: yyyy-MM-dd'T'HH:mm:ss)") @PathVariable String shiftDate) {
        LocalDateTime date = LocalDateTime.parse(shiftDate);
        shiftEnrollmentService.deleteShiftEnrollment(employeeId, shiftId, date);
        return ResponseEntity.ok().build();
    }
} 