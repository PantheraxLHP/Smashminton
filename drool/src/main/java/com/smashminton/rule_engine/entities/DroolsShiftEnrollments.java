package com.smashminton.rule_engine.entities;

import java.util.List;
import java.util.ArrayList;

/**
 * Internal model class for Drools rules processing
 */
public class DroolsShiftEnrollments {
    private List<DroolsShiftEnrollment> enrollments;

    public DroolsShiftEnrollments() {
        this.enrollments = new ArrayList<DroolsShiftEnrollment>();
    }

    public DroolsShiftEnrollments(List<DroolsShiftEnrollment> enrollments) {
        this.enrollments = new ArrayList<DroolsShiftEnrollment>();
        this.enrollments.addAll(enrollments);
    }

    public List<DroolsShiftEnrollment> getEnrollments() {
        return enrollments;
    }

    public void setEnrollments(List<DroolsShiftEnrollment> enrollments) {
        this.enrollments.clear();
        this.enrollments.addAll(enrollments);
    }

    public void addEnrollment(DroolsShiftEnrollment enrollment) {
        this.enrollments.add(enrollment);
    }

    public void removeEnrollment(DroolsShiftEnrollment enrollment) {
        this.enrollments.remove(enrollment);
    }

    public void removeEnrollment(DroolsEmployee employee, DroolsShiftDate shiftDate) {
        for (DroolsShiftEnrollment enrollment : enrollments) {
            if (enrollment.getEmployee().equals(employee) && enrollment.getShift().equals(shiftDate)) {
                this.enrollments.remove(enrollment);
                return;
            }
        }
    }

    public void removeEnrollments(DroolsEmployee employee) {
        List<DroolsShiftEnrollment> toRemove = new ArrayList<DroolsShiftEnrollment>();
        for (DroolsShiftEnrollment enrollment : enrollments) {
            if (enrollment.getEmployee().equals(employee)) {
                toRemove.add(enrollment);
            }
        }
        this.enrollments.removeAll(toRemove);
    }

    public void removeEnrollments(DroolsShiftDate shiftDate) {
        List<DroolsShiftEnrollment> toRemove = new ArrayList<DroolsShiftEnrollment>();
        for (DroolsShiftEnrollment enrollment : enrollments) {
            if (enrollment.getShift().equals(shiftDate)) {
                toRemove.add(enrollment);
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
        StringBuilder sb = new StringBuilder("DroolsShiftEnrollments{");
        for (DroolsShiftEnrollment enrollment : enrollments) {
            sb.append(enrollment.toString()).append(", ");
        }
        sb.append('}');
        return sb.toString();
    }
} 