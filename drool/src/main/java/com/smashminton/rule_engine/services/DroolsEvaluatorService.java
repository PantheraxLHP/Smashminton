package com.smashminton.rule_engine.services;

import java.util.List;

import com.smashminton.rule_engine.entities.Employee;
import com.smashminton.rule_engine.entities.ShiftAssignment;
import com.smashminton.rule_engine.entities.ShiftDate;
import com.smashminton.rule_engine.entities.ShiftEnrollment;

/**
 * Interface for Drools rule engine service
 */
public interface DroolsEvaluatorService {
    /**
     * Tự động phân công ca làm việc sử dụng Drools Rule Engine
     * 
     * @param employees Danh sách nhân viên
     * @param shiftDates Danh sách ca làm việc
     * @param shiftEnrollments Danh sách đăng ký ca làm việc
     * @return Danh sách phân công
     */
    List<ShiftAssignment> autoAssignShifts(List<Employee> employees, List<ShiftDate> shiftDates, 
                                          List<ShiftEnrollment> shiftEnrollments);
} 