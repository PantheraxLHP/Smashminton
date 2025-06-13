package com.example.model;

import java.util.List;

import org.kie.api.runtime.KieSession;
import org.kie.api.runtime.rule.FactHandle;

import java.util.ArrayList;

public class ShiftEnrollments {
    private List<ShiftEnrollment> enrollments;

    public ShiftEnrollments() {
        this.enrollments = new ArrayList<ShiftEnrollment>();
    }

    public ShiftEnrollments(List<ShiftEnrollment> enrollments) {
        this.enrollments.addAll(enrollments);
    }

    public List<ShiftEnrollment> getEnrollments() {
        return enrollments;
    }

    public void setEnrollments(List<ShiftEnrollment> enrollments) {
        this.enrollments.clear();
        this.enrollments.addAll(enrollments);
    }

    public void addEnrollment(ShiftEnrollment enrollment) {
        this.enrollments.add(enrollment);
    }

    public void removeEnrollment(ShiftEnrollment enrollment) {
        this.enrollments.remove(enrollment);
    }

    public void removeEnrollment(Employee employee, Shift_Date shiftDate) {
        for (ShiftEnrollment enrollment : enrollments) {
            if (enrollment.getEmployee().equals(employee) && enrollment.getShift().equals(shiftDate)) {
                this.enrollments.remove(enrollment);
                return;
            }
        }
    }

    public void removeEnrollments(Employee employee, KieSession kieSession) {
        List<ShiftEnrollment> toRemove = new ArrayList<ShiftEnrollment>();
        for (ShiftEnrollment enrollment : enrollments) {
            if (enrollment.getEmployee().equals(employee)) {
                toRemove.add(enrollment);
                FactHandle factHandleShiftEnrollment = kieSession.getFactHandle(enrollment);
                kieSession.delete(factHandleShiftEnrollment);
            }
        }
        this.enrollments.removeAll(toRemove);
    }

    public void removeEnrollments(Shift_Date shiftDate, KieSession kieSession) {
        List<ShiftEnrollment> toRemove = new ArrayList<ShiftEnrollment>();
        for (ShiftEnrollment enrollment : enrollments) {
            if (enrollment.getShift().equals(shiftDate)) {
                toRemove.add(enrollment);
                FactHandle factHandleShiftEnrollment = kieSession.getFactHandle(enrollment);
                kieSession.delete(factHandleShiftEnrollment);
            }
        }
        this.enrollments.removeAll(toRemove);
    }

    public void clearEnrollments() {
        this.enrollments.clear();
    }

    public int getSize() {
        return enrollments != null ? enrollments.size() : 0;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("ShiftEnrollments{");
        for (ShiftEnrollment enrollment : enrollments) {
            sb.append(enrollment.toString()).append(", ");
        }
        sb.append('}');
        return sb.toString();
    }
}
