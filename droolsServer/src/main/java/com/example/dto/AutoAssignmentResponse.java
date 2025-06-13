package com.example.dto;

import com.example.model.ShiftAssignment;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import java.util.ArrayList;

@Schema(description = "Response body for auto assignment")
public class AutoAssignmentResponse {

    @Schema(description = "List of shift assignments created")
    private List<ShiftAssignment> assignments;

    @Schema(description = "Total number of assignments made", example = "5")
    private int totalAssignments;

    @Schema(description = "Number of employees processed", example = "10")
    private int employeesProcessed;

    @Schema(description = "Number of shifts processed", example = "3")
    private int shiftsProcessed;

    @Schema(description = "Assignment success status")
    private boolean success;

    @Schema(description = "Message describing the result")
    private String message;

    @Schema(description = "Sort option used", example = "1")
    private int sortOptionUsed;

    public AutoAssignmentResponse() {
        this.assignments = new ArrayList<>();
        this.success = false;
    }

    public AutoAssignmentResponse(boolean success, String message) {
        this();
        this.success = success;
        this.message = message;
    }

    // Getters and setters
    public List<ShiftAssignment> getAssignments() {
        return assignments;
    }

    public void setAssignments(List<ShiftAssignment> assignments) {
        this.assignments = assignments;
        this.totalAssignments = assignments != null ? assignments.size() : 0;
    }

    public int getTotalAssignments() {
        return totalAssignments;
    }

    public void setTotalAssignments(int totalAssignments) {
        this.totalAssignments = totalAssignments;
    }

    public int getEmployeesProcessed() {
        return employeesProcessed;
    }

    public void setEmployeesProcessed(int employeesProcessed) {
        this.employeesProcessed = employeesProcessed;
    }

    public int getShiftsProcessed() {
        return shiftsProcessed;
    }

    public void setShiftsProcessed(int shiftsProcessed) {
        this.shiftsProcessed = shiftsProcessed;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getSortOptionUsed() {
        return sortOptionUsed;
    }

    public void setSortOptionUsed(int sortOptionUsed) {
        this.sortOptionUsed = sortOptionUsed;
    }
}
