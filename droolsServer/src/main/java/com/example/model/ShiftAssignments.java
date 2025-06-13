package com.example.model;

import java.util.List;
import java.util.ArrayList;

public class ShiftAssignments {
    private List<ShiftAssignment> assignments;

    public ShiftAssignments() {
        this.assignments = new ArrayList<ShiftAssignment>();
    }

    public ShiftAssignments(List<ShiftAssignment> assignments) {
        this.assignments.addAll(assignments);
    }

    public List<ShiftAssignment> getAssignments() {
        return assignments;
    }

    public void setAssignments(List<ShiftAssignment> assignments) {
        this.assignments.clear();
        this.assignments.addAll(assignments);
    }

    public void addAssignment(ShiftAssignment assignment) {
        this.assignments.add(assignment);
    }

    public void removeAssignment(ShiftAssignment assignment) {
        this.assignments.remove(assignment);
    }

    public void clearAssignments() {
        this.assignments.clear();
    }

    public int getSize() {
        return assignments != null ? assignments.size() : 0;
    }

    public boolean isAlreadyAssigned(Employee employee, Shift_Date shiftDate) {
        if (employee == null || shiftDate == null) {
            return false;
        }
        if (assignments.isEmpty()) {
            return false;
        }
        ShiftAssignment assignment = new ShiftAssignment(employee, shiftDate);
        return assignments.contains(assignment);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("ShiftAssignments{");
        for (ShiftAssignment assignment : assignments) {
            sb.append(assignment.toString()).append(", ");
        }
        sb.append('}');
        return sb.toString();
    }
}
