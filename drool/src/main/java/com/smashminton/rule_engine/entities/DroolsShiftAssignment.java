package com.smashminton.rule_engine.entities;

/**
 * Internal model class for Drools rules processing
 */
public class DroolsShiftAssignment {
    private DroolsEmployee employee;
    private DroolsShiftDate shiftDate;

    public DroolsShiftAssignment(DroolsEmployee employee, DroolsShiftDate shiftDate) {
        this.employee = employee;
        this.shiftDate = shiftDate;
    }

    public DroolsShiftAssignment() {
        this.employee = null;
        this.shiftDate = null;
    }

    public DroolsEmployee getEmployee() {
        return employee;
    }

    public void setEmployee(DroolsEmployee employee) {
        this.employee = employee;
    }

    public DroolsShiftDate getShift() {
        return shiftDate;
    }

    public void setShift(DroolsShiftDate shiftDate) {
        this.shiftDate = shiftDate;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null || getClass() != obj.getClass())
            return false;
        DroolsShiftAssignment that = (DroolsShiftAssignment) obj;
        return employee.equals(that.employee) && shiftDate.equals(that.shiftDate);
    }

    @Override
    public int hashCode() {
        return 31 * employee.hashCode() + shiftDate.hashCode();
    }

    @Override
    public String toString() {
        return "DroolsShiftAssignment{" +
                "employee=" + employee +
                ", shiftDate=" + shiftDate +
                '}';
    }
} 