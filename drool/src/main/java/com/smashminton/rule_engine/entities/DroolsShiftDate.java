package com.smashminton.rule_engine.entities;

import java.time.LocalDate;

/**
 * Internal model class for Drools rules processing
 */
public class DroolsShiftDate {
    private Integer shiftId;
    private LocalDate shiftDate;
    private int assignedEmployees;
    private boolean assignable;
    private boolean deletable;

    public DroolsShiftDate() {
        this.assignedEmployees = 0;
        this.assignable = false;
        this.deletable = false;
    }

    public DroolsShiftDate(Integer shiftId) {
        this();
        this.shiftId = shiftId;
    }

    public Integer getShiftId() {
        return shiftId;
    }

    public void setShiftId(Integer shiftId) {
        this.shiftId = shiftId;
    }

    public LocalDate getShiftDate() {
        return shiftDate;
    }

    public void setShiftDate(LocalDate shiftDate) {
        this.shiftDate = shiftDate;
    }

    public int getAssignedEmployees() {
        return assignedEmployees;
    }

    public void setAssignedEmployees(int assignedEmployees) {
        this.assignedEmployees = assignedEmployees;
    }

    public boolean isAssignable() {
        return assignable;
    }

    public void setAssignable(boolean assignable) {
        this.assignable = assignable;
    }

    public boolean isDeletable() {
        return deletable;
    }

    public void setDeletable(boolean deletable) {
        this.deletable = deletable;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null || getClass() != obj.getClass())
            return false;
        DroolsShiftDate that = (DroolsShiftDate) obj;
        return shiftId == that.shiftId && assignedEmployees == that.assignedEmployees && assignable == that.assignable
                && shiftDate.equals(that.shiftDate);
    }

    @Override
    public int hashCode() {
        int result = 31 * shiftId + assignedEmployees + (assignable ? 1 : 0) + shiftDate.hashCode();
        return result;
    }

    @Override
    public String toString() {
        return "DroolsShiftDate{" +
                "shiftId=" + shiftId +
                ", shiftDate=" + shiftDate +
                ", assignedEmployees=" + assignedEmployees +
                ", assignable=" + assignable +
                ", deletable=" + deletable +
                '}';
    }
} 