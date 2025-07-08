package com.example.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request body for auto assignment")
public class AutoAssignmentRequest {
    @Schema(description = "Sort option number (1=Priority Ascending, 2=Priority Descending, 3=AssignedShifts Ascending, 4=AssignedShifts Descending, 0=No Sort)", example = "1")
    private int sortOption;

    public AutoAssignmentRequest() {
    }

    public AutoAssignmentRequest(int sortOption) {
        this.sortOption = sortOption;
    }

    public int getSortOption() {
        return sortOption;
    }

    public void setSortOption(int sortOption) {
        this.sortOption = sortOption;
    }

    @Override
    public String toString() {
        return "AutoAssignmentRequest{" +
                "sortOption=" + sortOption +
                '}';
    }
}
