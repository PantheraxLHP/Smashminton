package com.smashminton.rule_engine.services;

import com.smashminton.rule_engine.entities.ShiftAssignment;
import java.util.List;

public interface ShiftAssignmentService {
    List<ShiftAssignment> getAllShiftAssignments();
    ShiftAssignment getShiftAssignmentById(Integer id);
    List<ShiftAssignment> getShiftAssignmentsByEmployeeId(Integer employeeId);
    List<ShiftAssignment> getShiftAssignmentsByShiftId(Integer shiftId);
    ShiftAssignment createShiftAssignment(ShiftAssignment shiftAssignment);
    ShiftAssignment updateShiftAssignment(Integer id, ShiftAssignment shiftAssignmentDetails);
    void deleteShiftAssignment(Integer id);
} 