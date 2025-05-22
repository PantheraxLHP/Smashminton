package com.smashminton.rule_engine.entities;

/**
 * Internal model class for Drools rules processing
 */
public class DroolsAutoAssignmentContext {
    private DroolsShiftDate currentShift;

    public DroolsAutoAssignmentContext() {
        this.currentShift = new DroolsShiftDate();
    }

    public DroolsAutoAssignmentContext(DroolsShiftDate currentShift) {
        this.currentShift = currentShift;
    }

    public DroolsShiftDate getCurrentShift() {
        return currentShift;
    }

    public void setCurrentShift(DroolsShiftDate currentShift) {
        this.currentShift = currentShift;
    }
} 