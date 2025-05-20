package com.smashminton.rule_engine.services;

import com.smashminton.rule_engine.entities.ShiftEnrollment;
import java.util.List;

public interface ShiftEnrollmentService {
    List<ShiftEnrollment> getAllShiftEnrollments();
    ShiftEnrollment getShiftEnrollmentById(Integer id);
    List<ShiftEnrollment> getShiftEnrollmentsByEmployeeId(Integer employeeId);
    List<ShiftEnrollment> getShiftEnrollmentsByShiftId(Integer shiftId);
    ShiftEnrollment createShiftEnrollment(ShiftEnrollment shiftEnrollment);
    ShiftEnrollment updateShiftEnrollment(Integer id, ShiftEnrollment shiftEnrollmentDetails);
    void deleteShiftEnrollment(Integer id);
} 