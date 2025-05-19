package com.smashminton.rule_engine.controllers;

import com.smashminton.rule_engine.entities.ShiftDate;
import com.smashminton.rule_engine.services.ShiftDateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/shift-dates")
@Tag(name = "Shift Date Management", description = "APIs for managing shift dates")
public class ShiftDateController {

    @Autowired
    private ShiftDateService shiftDateService;

    @GetMapping
    @Operation(
        summary = "Get all shift dates",
        description = "Retrieves a list of all shift dates in the system"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved all shift dates",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ShiftDate.class)
            )
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error"
        )
    })
    public ResponseEntity<List<ShiftDate>> getAllShiftDates() {
        return ResponseEntity.ok(shiftDateService.getAllShiftDates());
    }

    @GetMapping("/{id}")
    @Operation(
        summary = "Get shift date by ID",
        description = "Retrieves a shift date by its ID"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved the shift date",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ShiftDate.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Shift date not found"
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error"
        )
    })
    public ResponseEntity<ShiftDate> getShiftDateById(
            @Parameter(description = "Shift Date ID", required = true, example = "1")
            @PathVariable Integer id) {
        return ResponseEntity.ok(shiftDateService.getShiftDateById(id));
    }

    @GetMapping("/date/{date}")
    @Operation(
        summary = "Get shift dates by date",
        description = "Retrieves all shift dates for a specific date"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved the shift dates",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ShiftDate.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid date format"
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error"
        )
    })
    public ResponseEntity<List<ShiftDate>> getShiftDatesByDate(
            @Parameter(description = "Date", required = true, example = "2024-03-20")
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(shiftDateService.getShiftDatesByDate(date));
    }

    @GetMapping("/between")
    @Operation(
        summary = "Get shift dates between dates",
        description = "Retrieves all shift dates between two dates"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved the shift dates",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ShiftDate.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid date format"
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error"
        )
    })
    public ResponseEntity<List<ShiftDate>> getShiftDatesBetween(
            @Parameter(description = "Start date", required = true, example = "2024-03-01")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "End date", required = true, example = "2024-03-31")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(shiftDateService.getShiftDatesBetween(startDate, endDate));
    }

    @PostMapping
    @Operation(
        summary = "Create new shift date",
        description = "Creates a new shift date in the system"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully created the shift date",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ShiftDate.class)
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
    public ResponseEntity<ShiftDate> createShiftDate(
            @Parameter(description = "Shift Date object", required = true)
            @RequestBody ShiftDate shiftDate) {
        return ResponseEntity.ok(shiftDateService.createShiftDate(shiftDate));
    }

    @PutMapping("/{id}")
    @Operation(
        summary = "Update shift date",
        description = "Updates an existing shift date"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully updated the shift date",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ShiftDate.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Shift date not found"
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error"
        )
    })
    public ResponseEntity<ShiftDate> updateShiftDate(
            @Parameter(description = "Shift Date ID", required = true, example = "1")
            @PathVariable Integer id,
            @Parameter(description = "Updated shift date object", required = true)
            @RequestBody ShiftDate shiftDate) {
        return ResponseEntity.ok(shiftDateService.updateShiftDate(id, shiftDate));
    }

    @DeleteMapping("/{id}")
    @Operation(
        summary = "Delete shift date",
        description = "Deletes a shift date by its ID"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully deleted the shift date"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Shift date not found"
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error"
        )
    })
    public ResponseEntity<Void> deleteShiftDate(
            @Parameter(description = "Shift Date ID", required = true, example = "1")
            @PathVariable Integer id) {
        shiftDateService.deleteShiftDate(id);
        return ResponseEntity.ok().build();
    }
} 