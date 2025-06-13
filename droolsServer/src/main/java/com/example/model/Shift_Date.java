package com.example.model;

import java.time.LocalDateTime;
import java.util.List;
import javax.persistence.*;
import java.io.Serializable;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "shift_date")
@IdClass(ShiftDateId.class)
public class Shift_Date implements Serializable {
    @Id
    @Column(name = "shiftid")
    private int shiftId;
    @Id
    @Column(name = "shiftdate")
    private LocalDateTime shiftDate; // JPA Relationships
    @OneToMany(mappedBy = "shift", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("shift-shiftAssignments")
    private List<ShiftAssignment> shiftAssignments;

    @OneToMany(mappedBy = "shift", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("shift-shiftEnrollments")
    private List<ShiftEnrollment> shiftEnrollments;

    // Calculated/Function-only fields
    @Transient
    private int assignedEmployees;
    @Transient
    private boolean assignable;
    @Transient
    private boolean deletable;

    public Shift_Date() {
        this.shiftId = 0;
        this.shiftDate = LocalDateTime.now();
        this.assignedEmployees = 0;
        this.assignable = false;
        this.deletable = false;
    }

    public Shift_Date(int shiftId) {
        this.shiftId = shiftId;
        this.shiftDate = LocalDateTime.now();
        this.assignedEmployees = 0;
        this.assignable = false;
        this.deletable = false;
    }

    public Shift_Date(int shiftId, LocalDateTime shiftDate, int assignedEmployees, boolean assignable,
            boolean deletable) {
        this.shiftId = shiftId;
        this.shiftDate = shiftDate;
        this.assignedEmployees = assignedEmployees;
        this.assignable = assignable;
        this.deletable = deletable;
    }

    public Shift_Date(Shift_Date shiftDate) {
        this.shiftId = shiftDate.shiftId;
        this.shiftDate = shiftDate.shiftDate;
        this.assignedEmployees = shiftDate.assignedEmployees;
        this.assignable = shiftDate.assignable;
        this.deletable = shiftDate.deletable;
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
        Shift_Date that = (Shift_Date) obj;
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
        return "Shift_Date{" +
                "shiftId=" + shiftId +
                ", shiftDate=" + shiftDate +
                ", assignedEmployees=" + assignedEmployees +
                ", assignable=" + assignable +
                ", deletable=" + deletable +
                '}';
    }

    public List<ShiftAssignment> getShiftAssignments() {
        return shiftAssignments;
    }

    public void setShiftAssignments(List<ShiftAssignment> shiftAssignments) {
        this.shiftAssignments = shiftAssignments;
    }

    public List<ShiftEnrollment> getShiftEnrollments() {
        return shiftEnrollments;
    }

    public void setShiftEnrollments(List<ShiftEnrollment> shiftEnrollments) {
        this.shiftEnrollments = shiftEnrollments;
    }
}
