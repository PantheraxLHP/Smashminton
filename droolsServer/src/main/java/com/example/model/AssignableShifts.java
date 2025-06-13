package com.example.model;

import java.util.List;
import java.util.ArrayList;

public class AssignableShifts {
    private List<Shift_Date> shifts;

    public AssignableShifts() {
        this.shifts = new ArrayList<Shift_Date>();
    }

    public AssignableShifts(List<Shift_Date> shift_dates) {
        this.shifts.addAll(shift_dates);
    }

    public List<Shift_Date> getShifts() {
        return shifts;
    }

    public void setShifts(List<Shift_Date> shifts) {
        this.shifts.clear();
        this.shifts.addAll(shifts);
    }

    public void addShift(Shift_Date shift) {
        this.shifts.add(shift);
    }

    public void removeShift(Shift_Date shift) {
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
        StringBuilder sb = new StringBuilder("AssignableShift{");
        for (Shift_Date shift : shifts) {
            sb.append(shift.toString()).append(", ");
        }
        sb.append('}');
        return sb.toString();
    }
}
