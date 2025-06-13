package com.example.model;

public class AutoAssignmentContext {
    private Shift_Date currentShift;

    public AutoAssignmentContext() {
        this.currentShift = new Shift_Date();
    }

    public AutoAssignmentContext(Shift_Date currentShift) {
        this.currentShift = currentShift;
    }

    public Shift_Date getCurrentShift() {
        return currentShift;
    }

    public void setCurrentShift(Shift_Date currentShift) {
        this.currentShift = currentShift;
    }
}
