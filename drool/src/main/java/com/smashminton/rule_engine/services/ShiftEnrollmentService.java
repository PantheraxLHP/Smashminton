package com.smashminton.rule_engine.services;

import com.smashminton.rule_engine.entities.ShiftEnrollment;
import java.time.LocalDateTime;
import java.util.List;

public interface ShiftEnrollmentService {
    List<ShiftEnrollment> getAllShiftEnrollments();
    
    ShiftEnrollment getShiftEnrollmentById(Integer employeeId, Integer shiftId, LocalDateTime shiftDate);
    
    List<ShiftEnrollment> getShiftEnrollmentsByEmployeeId(Integer employeeId);
    
    List<ShiftEnrollment> getShiftEnrollmentsByShiftId(Integer shiftId);
    
    List<ShiftEnrollment> getShiftEnrollmentsByDate(LocalDateTime date);
    
    ShiftEnrollment createShiftEnrollment(ShiftEnrollment shiftEnrollment);
    
    ShiftEnrollment updateShiftEnrollment(Integer employeeId, Integer shiftId, LocalDateTime shiftDate, ShiftEnrollment shiftEnrollmentDetails);
    
    void deleteShiftEnrollment(Integer employeeId, Integer shiftId, LocalDateTime shiftDate);
} 