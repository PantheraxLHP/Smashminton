package com.smashminton.rule_engine.entities;

import java.util.List;
import java.util.ArrayList;

/**
 * Internal model class for Drools rules processing
 */
public class DroolsShiftAssignments {
    private List<DroolsShiftAssignment> assignments;

    public DroolsShiftAssignments() {
        this.assignments = new ArrayList<DroolsShiftAssignment>();
    }

    public DroolsShiftAssignments(List<DroolsShiftAssignment> assignments) {
        this.assignments = new ArrayList<DroolsShiftAssignment>();
        this.assignments.addAll(assignments);
    }

    public List<DroolsShiftAssignment> getAssignments() {
        return assignments;
    }

    public void setAssignments(List<DroolsShiftAssignment> assignments) {
        this.assignments.clear();
        this.assignments.addAll(assignments);
    }

    public void addAssignment(DroolsShiftAssignment assignment) {
        this.assignments.add(assignment);
    }

    public void removeAssignment(DroolsShiftAssignment assignment) {
        this.assignments.remove(assignment);
    }

    public void clearAssignments() {
        this.assignments.clear();
    }

    public int getSize() {
        return assignments != null ? assignments.size() : 0;
    }

    public boolean isAlreadyAssigned(DroolsEmployee employee, DroolsShiftDate shiftDate) {
        if (employee == null || shiftDate == null) {
            return false;
        }
        if (assignments.isEmpty()) {
            return false;
        }
        DroolsShiftAssignment assignment = new DroolsShiftAssignment(employee, shiftDate);
        return assignments.contains(assignment);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("DroolsShiftAssignments{");
        for (DroolsShiftAssignment assignment : assignments) {
            sb.append(assignment.toString()).append(", ");
        }
        sb.append('}');
        return sb.toString();
    }
} 