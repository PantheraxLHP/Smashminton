package com.smashminton.rule_engine.controllers;

import com.smashminton.rule_engine.entities.ShiftAssignment;
import com.smashminton.rule_engine.services.ShiftAssignmentService;
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
@RequestMapping("/api/shift-assignments")
@Tag(name = "Shift Assignment Management", description = "APIs for managing shift assignments")
public class ShiftAssignmentController {

    @Autowired
    private ShiftAssignmentService shiftAssignmentService;

    @GetMapping
    @Operation(
        summary = "Get all shift assignments",
        description = "Retrieves a list of all shift assignments in the system"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved all shift assignments",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ShiftAssignment.class)
            )
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error"
        )
    })
    public ResponseEntity<List<ShiftAssignment>> getAllShiftAssignments() {
        return ResponseEntity.ok(shiftAssignmentService.getAllShiftAssignments());
    }

    @GetMapping("/{id}")
    @Operation(
        summary = "Get shift assignment by ID",
        description = "Retrieves a shift assignment by its ID"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved the shift assignment",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ShiftAssignment.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Shift assignment not found"
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error"
        )
    })
    public ResponseEntity<ShiftAssignment> getShiftAssignmentById(
            @Parameter(description = "Shift Assignment ID", required = true, example = "1")
            @PathVariable Integer id) {
        return ResponseEntity.ok(shiftAssignmentService.getShiftAssignmentById(id));
    }

    @GetMapping("/employee/{employeeId}")
    @Operation(
        summary = "Get shift assignments by employee ID",
        description = "Retrieves all shift assignments for a specific employee"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved the shift assignments",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ShiftAssignment.class)
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
    public ResponseEntity<List<ShiftAssignment>> getShiftAssignmentsByEmployeeId(
            @Parameter(description = "Employee ID", required = true, example = "1")
            @PathVariable Integer employeeId) {
        return ResponseEntity.ok(shiftAssignmentService.getShiftAssignmentsByEmployeeId(employeeId));
    }

    @GetMapping("/shift/{shiftId}")
    @Operation(
        summary = "Get shift assignments by shift ID",
        description = "Retrieves all shift assignments for a specific shift"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved the shift assignments",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ShiftAssignment.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Shift not found"
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error"
        )
    })
    public ResponseEntity<List<ShiftAssignment>> getShiftAssignmentsByShiftId(
            @Parameter(description = "Shift ID", required = true, example = "1")
            @PathVariable Integer shiftId) {
        return ResponseEntity.ok(shiftAssignmentService.getShiftAssignmentsByShiftId(shiftId));
    }

    @PostMapping
    @Operation(
        summary = "Create new shift assignment",
        description = "Creates a new shift assignment in the system"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully created the shift assignment",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ShiftAssignment.class)
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
    public ResponseEntity<ShiftAssignment> createShiftAssignment(
            @Parameter(description = "Shift Assignment object", required = true)
            @RequestBody ShiftAssignment shiftAssignment) {
        return ResponseEntity.ok(shiftAssignmentService.createShiftAssignment(shiftAssignment));
    }

    @PutMapping("/{id}")
    @Operation(
        summary = "Update shift assignment",
        description = "Updates an existing shift assignment"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully updated the shift assignment",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ShiftAssignment.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Shift assignment not found"
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error"
        )
    })
    public ResponseEntity<ShiftAssignment> updateShiftAssignment(
            @Parameter(description = "Shift Assignment ID", required = true, example = "1")
            @PathVariable Integer id,
            @Parameter(description = "Updated shift assignment object", required = true)
            @RequestBody ShiftAssignment shiftAssignment) {
        return ResponseEntity.ok(shiftAssignmentService.updateShiftAssignment(id, shiftAssignment));
    }

    @DeleteMapping("/{id}")
    @Operation(
        summary = "Delete shift assignment",
        description = "Deletes a shift assignment by its ID"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully deleted the shift assignment"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Shift assignment not found"
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error"
        )
    })
    public ResponseEntity<Void> deleteShiftAssignment(
            @Parameter(description = "Shift Assignment ID", required = true, example = "1")
            @PathVariable Integer id) {
        shiftAssignmentService.deleteShiftAssignment(id);
        return ResponseEntity.ok().build();
    }
} 