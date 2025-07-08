package com.example.model;

import java.util.List;

import org.kie.api.runtime.KieSession;
import org.kie.api.runtime.rule.FactHandle;

import java.util.ArrayList;
import java.util.Collections;

public class ShiftEnrollments {
    private List<ShiftEnrollment> enrollments;

    public ShiftEnrollments() {
        this.enrollments = Collections.synchronizedList(new ArrayList<ShiftEnrollment>());
    }

    public ShiftEnrollments(List<ShiftEnrollment> enrollments) {
        this.enrollments = Collections.synchronizedList(new ArrayList<ShiftEnrollment>());
        synchronized (this.enrollments) {
            this.enrollments.addAll(enrollments);
        }
    }

    public List<ShiftEnrollment> getEnrollments() {
        return enrollments;
    }

    public void setEnrollments(List<ShiftEnrollment> enrollments) {
        synchronized (this.enrollments) {
            this.enrollments.clear();
            this.enrollments.addAll(enrollments);
        }
    }

    public synchronized void addEnrollment(ShiftEnrollment enrollment) {
        this.enrollments.add(enrollment);
    }

    public synchronized void removeEnrollment(ShiftEnrollment enrollment) {
        this.enrollments.remove(enrollment);
    }

    public synchronized void removeEnrollment(Employee employee, Shift_Date shiftDate) {
        ShiftEnrollment toRemove = null;
        synchronized (enrollments) {
            for (ShiftEnrollment enrollment : enrollments) {
                if (enrollment.getEmployee().equals(employee) && enrollment.getShift().equals(shiftDate)) {
                    toRemove = enrollment;
                    break;
                }
            }
            if (toRemove != null) {
                this.enrollments.remove(toRemove);
            }
        }
    }

    public synchronized void removeEnrollments(Employee employee, KieSession kieSession) {
        List<ShiftEnrollment> toRemove = new ArrayList<ShiftEnrollment>();
        synchronized (enrollments) {
            for (ShiftEnrollment enrollment : enrollments) {
                if (enrollment.getEmployee().equals(employee)) {
                    toRemove.add(enrollment);
                    FactHandle factHandleShiftEnrollment = kieSession.getFactHandle(enrollment);
                    if (factHandleShiftEnrollment != null) {
                        kieSession.delete(factHandleShiftEnrollment);
                    }
                }
            }
            this.enrollments.removeAll(toRemove);
        }
    }

    public synchronized void removeEnrollments(Shift_Date shiftDate, KieSession kieSession) {
        List<ShiftEnrollment> toRemove = new ArrayList<ShiftEnrollment>();
        synchronized (enrollments) {
            for (ShiftEnrollment enrollment : enrollments) {
                if (enrollment.getShift().equals(shiftDate)) {
                    toRemove.add(enrollment);
                    FactHandle factHandleShiftEnrollment = kieSession.getFactHandle(enrollment);
                    if (factHandleShiftEnrollment != null) {
                        kieSession.delete(factHandleShiftEnrollment);
                    }
                }
            }
            this.enrollments.removeAll(toRemove);
        }
    }

    public synchronized void clearEnrollments() {
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
