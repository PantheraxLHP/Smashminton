package com.smashminton.rule_engine.entities;

import java.util.List;
import java.util.ArrayList;

/**
 * Internal model class for Drools rules processing
 */
public class DroolsAssignableShifts {
    private List<DroolsShiftDate> shifts;

    public DroolsAssignableShifts() {
        this.shifts = new ArrayList<DroolsShiftDate>();
    }

    public DroolsAssignableShifts(List<DroolsShiftDate> shift_dates) {
        this.shifts = new ArrayList<DroolsShiftDate>();
        this.shifts.addAll(shift_dates);
    }

    public List<DroolsShiftDate> getShifts() {
        return shifts;
    }

    public void setShifts(List<DroolsShiftDate> shifts) {
        this.shifts.clear();
        this.shifts.addAll(shifts);
    }

    public void addShift(DroolsShiftDate shift) {
        this.shifts.add(shift);
    }

    public void removeShift(DroolsShiftDate shift) {
        this.shifts.remove(shift);
    }

    public void clearShifts() {
        this.shifts.clear();
    }

    public int getSize() {
        return shifts.size();
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("DroolsAssignableShift{");
        for (DroolsShiftDate shift : shifts) {
            sb.append(shift.toString()).append(", ");
        }
        sb.append('}');
        return sb.toString();
    }
} 