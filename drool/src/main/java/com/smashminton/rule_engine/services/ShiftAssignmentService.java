package com.smashminton.rule_engine.services;

import com.smashminton.rule_engine.entities.ShiftAssignment;
import com.smashminton.rule_engine.entities.ShiftDate;
import com.smashminton.rule_engine.entities.Employee;
import com.smashminton.rule_engine.entities.ShiftEnrollment;

import java.time.LocalDateTime;
import java.util.List;

public interface ShiftAssignmentService {
    List<ShiftAssignment> getAllShiftAssignments();
    ShiftAssignment getShiftAssignmentById(Integer employeeId, Integer shiftId, LocalDateTime shiftDate);
    List<ShiftAssignment> getShiftAssignmentsByEmployeeId(Integer employeeId);
    List<ShiftAssignment> getShiftAssignmentsByShiftId(Integer shiftId);
    ShiftAssignment createShiftAssignment(ShiftAssignment shiftAssignment);
    ShiftAssignment updateShiftAssignment(Integer employeeId, Integer shiftId, LocalDateTime shiftDate, ShiftAssignment shiftAssignmentDetails);
    void deleteShiftAssignment(Integer employeeId, Integer shiftId, LocalDateTime shiftDate);
    
    // Phương thức tự động phân công ca làm việc sử dụng Drools
    List<ShiftAssignment> autoAssignShifts(List<Employee> employees, List<ShiftDate> shiftDates, List<ShiftEnrollment> shiftEnrollments);
} 