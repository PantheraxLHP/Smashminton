package com.example.model;

import java.util.List;

public class Sort {
    public enum SortBy {
        PRIORITY,
        ASSIGNEDSHIFTINWEEK,
    }

    public enum SortType {
        ASCENDING,
        DESCENDING,
    }

    private SortType sortType;
    private SortBy sortBy;
    private boolean sortEnabled;

    public boolean getSortEnabled() {
        return sortEnabled;
    }

    public void setSortEnabled(boolean sortEnabled) {
        this.sortEnabled = sortEnabled;
    }

    public SortType getSortType() {
        return sortType;
    }

    public void setSortType(SortType sortType) {
        this.sortType = sortType;
    }

    public SortBy getSortBy() {
        return sortBy;
    }

    public void setSortBy(SortBy sortBy) {
        this.sortBy = sortBy;
    }

    public static List<Employee> sortEmployeeStatic(List<Employee> eligibleEmployees, SortBy sortBy,
            SortType sortType) {
        System.out.println("Sorting employees by " + sortBy + " in " + sortType + " order.");
        System.out.println("Eligible employees before sorting: " + eligibleEmployees);
        eligibleEmployees.sort((e1, e2) -> {
            int comparison = 0;
            switch (sortBy) {
                case PRIORITY:
                    comparison = Integer.compare(e1.getPriorityScore(), e2.getPriorityScore());
                    break;
                case ASSIGNEDSHIFTINWEEK:
                    comparison = Integer.compare(e1.getAssignedShiftInWeek(), e2.getAssignedShiftInWeek());
                    break;
            }
            return sortType == SortType.ASCENDING ? comparison : -comparison;
        });
        return eligibleEmployees;
    }

    public List<Employee> sortEmployee(List<Employee> eligibleEmployees) {
        System.out.println("Sorting employees by " + sortBy + " in " + sortType + " order.");
        eligibleEmployees.sort((e1, e2) -> {
            int comparison = 0;
            switch (sortBy) {
                case PRIORITY:
                    comparison = Integer.compare(e1.getPriorityScore(), e2.getPriorityScore());
                    break;
                case ASSIGNEDSHIFTINWEEK:
                    comparison = Integer.compare(e1.getAssignedShiftInWeek(),
                            e2.getAssignedShiftInWeek());
                    break;
            }
            return sortType == SortType.ASCENDING ? comparison : -comparison;
        });
        System.out.println("Eligible employees after sorting: " + eligibleEmployees);
        return eligibleEmployees;
    }
}
