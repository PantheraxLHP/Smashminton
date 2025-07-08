package com.example.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

public class ShiftEnrollmentId implements Serializable {
    private int employeeId;
    private int shiftId;
    private LocalDateTime shiftDate;

    public ShiftEnrollmentId() {}

    public ShiftEnrollmentId(int employeeId, int shiftId, LocalDateTime shiftDate) {
        this.employeeId = employeeId;
        this.shiftId = shiftId;
        this.shiftDate = shiftDate;
    }

    public int getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(int employeeId) {
        this.employeeId = employeeId;
    }

    public int getShiftId() {
        return shiftId;
    }

    public void setShiftId(int shiftId) {
        this.shiftId = shiftId;
    }

    public LocalDateTime getShiftDate() {
        return shiftDate;
    }

    public void setShiftDate(LocalDateTime shiftDate) {
        this.shiftDate = shiftDate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ShiftEnrollmentId that = (ShiftEnrollmentId) o;
        return employeeId == that.employeeId &&
               shiftId == that.shiftId &&
               Objects.equals(shiftDate, that.shiftDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(employeeId, shiftId, shiftDate);
    }
}
