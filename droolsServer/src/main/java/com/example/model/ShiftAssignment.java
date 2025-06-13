package com.example.model;

import javax.persistence.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "shift_assignment")
@IdClass(ShiftAssignmentId.class)
public class ShiftAssignment {
    @Id
    @Column(name = "employeeid")
    private int employeeId;

    @Id
    @Column(name = "shiftid")
    private int shiftId;

    @Id
    @Column(name = "shiftdate")
    private LocalDateTime shiftDate;

    @Column(name = "assignmentstatus")
    private String assignmentStatus;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employeeid", referencedColumnName = "employeeid", insertable = false, updatable = false)
    @JsonBackReference("employee-shiftAssignments")
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "shiftid", referencedColumnName = "shiftid", insertable = false, updatable = false),
            @JoinColumn(name = "shiftdate", referencedColumnName = "shiftdate", insertable = false, updatable = false)
    })
    @JsonBackReference("shift-shiftAssignments")
    private Shift_Date shift;

    public ShiftAssignment() {
    }

    public ShiftAssignment(Employee employee, Shift_Date shiftDate) {
        this.employee = employee;
        this.shift = shiftDate;
        this.employeeId = employee.getEmployeeId();
        this.shiftId = shiftDate.getShiftId();
        this.shiftDate = shiftDate.getShiftDate();
        this.assignmentStatus = "pending";
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

    public String getAssignmentStatus() {
        return assignmentStatus;
    }

    public void setAssignmentStatus(String assignmentStatus) {
        this.assignmentStatus = assignmentStatus;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
        if (employee != null) {
            this.employeeId = employee.getEmployeeId();
        }
    }

    public Shift_Date getShift() {
        return shift;
    }

    public void setShift(Shift_Date shift) {
        this.shift = shift;
        if (shift != null) {
            this.shiftId = shift.getShiftId();
            this.shiftDate = shift.getShiftDate();
        }
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null || getClass() != obj.getClass())
            return false;
        ShiftAssignment that = (ShiftAssignment) obj;
        return employeeId == that.employeeId &&
                shiftId == that.shiftId &&
                shiftDate.equals(that.shiftDate);
    }

    @Override
    public int hashCode() {
        return 31 * (31 * employeeId + shiftId) + shiftDate.hashCode();
    }

    @Override
    public String toString() {
        return "ShiftAssignment{" +
                "employeeId=" + employeeId +
                ", shiftId=" + shiftId +
                ", shiftDate=" + shiftDate +
                '}';
    }
}
