package com.smashminton.rule_engine.entities;

/**
 * Internal model class for Drools rules processing
 */
public class DroolsShiftEnrollment {
    private DroolsEmployee employee;
    private DroolsShiftDate shiftDate;

    public DroolsShiftEnrollment(DroolsEmployee employee, DroolsShiftDate shiftDate) {
        this.employee = employee;
        this.shiftDate = shiftDate;
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
        DroolsShiftEnrollment that = (DroolsShiftEnrollment) obj;
        return employee.equals(that.employee) && shiftDate.equals(that.shiftDate);
    }

    @Override
    public int hashCode() {
        return 31 * employee.hashCode() + shiftDate.hashCode();
    }

    @Override
    public String toString() {
        return "DroolsShiftEnrollment{" +
                "employee=" + employee +
                ", shiftDate=" + shiftDate +
                '}';
    }
} 