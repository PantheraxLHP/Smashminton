package com.example.controller;

import com.example.service.AutoAssignmentService;
import com.example.service.DroolsService;
import com.example.dto.AutoAssignmentRequest;
import com.example.dto.AutoAssignmentResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("/api")
@Tag(name = "Auto Assignment", description = "APIs for automatic shift assignment using Drools")
public class AutoAssignmentController {

    @Autowired
    private AutoAssignmentService autoAssignmentService;

    @Autowired
    private DroolsService droolsService;

    @PostMapping("/auto-assignment")
    @Operation(summary = "Execute automatic shift assignment", description = "Processes employees and shifts for next week using Drools business rules with configurable sort options")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Assignment completed successfully", content = @Content(schema = @Schema(implementation = AutoAssignmentResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request parameters"),
            @ApiResponse(responseCode = "500", description = "Internal server error during assignment")
    })
    @RequestBody(description = "Auto assignment request with sort options", required = true, content = @Content(schema = @Schema(implementation = AutoAssignmentRequest.class), mediaType = "application/json", examples = @ExampleObject(name = "Basic Example", value = "{ \"sortOption\": 2 }")))
    public ResponseEntity<AutoAssignmentResponse> performAutoAssignment(@RequestBody AutoAssignmentRequest request) {

        try {
            AutoAssignmentResponse response = autoAssignmentService.performAutoAssignment(request);

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }

        } catch (Exception e) {
            AutoAssignmentResponse errorResponse = new AutoAssignmentResponse(false,
                    "Unexpected error during auto-assignment: " + e.getClass().getSimpleName() + " - "
                            + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    @GetMapping("/auto-assignment/options")
    @Operation(summary = "Get available sort options", description = "Returns the available sort options for auto-assignment")
    @ApiResponse(responseCode = "200", description = "Sort options retrieved successfully")
    public ResponseEntity<String> getSortOptions() {
        StringBuilder options = new StringBuilder();
        options.append("Available Sort Options:\n");
        options.append("0 = No Sort (default)\n");
        options.append("1 = Priority Descending (highest priority first)\n");
        options.append("2 = Assigned Shifts Ascending (least assigned first)\n");
        options.append("\nExample request body:\n");
        options.append("{\n");
        options.append("  \"sortOption\": 1,\n");
        options.append("}");

        return ResponseEntity.ok(options.toString());
    }

    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Check if the application is running")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Drools Decision Table Application is running! " +
                "Available endpoints: " +
                "POST /api/auto-assignment, " +
                "GET /api/auto-assignment/options, " +
                "GET /api/drl, " + 
                "GET /api/health");
    }

    @GetMapping("/drl")
    @Operation(summary = "Get DRL rules from decision table", description = "Fetches the DRL rules generated from the decision table")
    public ResponseEntity<String> getDrlRules() {
        String drlRules = droolsService.getDrlRules();
        return ResponseEntity.ok(drlRules);
    }
}
