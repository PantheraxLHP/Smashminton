package com.example;

import com.smashminton.rule_engine.entities.DroolsShiftAssignment;

public class ShiftAssignment extends DroolsShiftAssignment {
    public ShiftAssignment() {
        super();
    }

    public ShiftAssignment(Employee employee, Shift_Date shift) {
        super(employee, shift);
    }
} 