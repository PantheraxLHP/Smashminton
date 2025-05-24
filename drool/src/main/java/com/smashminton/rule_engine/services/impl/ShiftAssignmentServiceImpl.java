package com.smashminton.rule_engine.services.impl;

import com.smashminton.rule_engine.entities.ShiftAssignment;
import com.smashminton.rule_engine.entities.ShiftDate;
import com.smashminton.rule_engine.entities.Employee;
import com.smashminton.rule_engine.entities.ShiftEnrollment;
import com.smashminton.rule_engine.repositories.ShiftAssignmentRepository;
import com.smashminton.rule_engine.services.ShiftAssignmentService;
import com.smashminton.rule_engine.services.DroolsEvaluatorService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ShiftAssignmentServiceImpl implements ShiftAssignmentService {

    @Autowired
    private ShiftAssignmentRepository shiftAssignmentRepository;
    
    @Autowired
    private DroolsEvaluatorService droolsEvaluatorService;

    @Override
    public List<ShiftAssignment> getAllShiftAssignments() {
        return shiftAssignmentRepository.findAll();
    }

    @Override
    public ShiftAssignment getShiftAssignmentById(Integer employeeId, Integer shiftId, LocalDateTime shiftDate) {
        ShiftAssignment.ShiftAssignmentId id = new ShiftAssignment.ShiftAssignmentId(employeeId, shiftId, shiftDate);
        return shiftAssignmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ShiftAssignment not found with id: " + id));
    }

    @Override
    public List<ShiftAssignment> getShiftAssignmentsByEmployeeId(Integer employeeId) {
        return shiftAssignmentRepository.findByEmployeeId(employeeId);
    }

    @Override
    public List<ShiftAssignment> getShiftAssignmentsByShiftId(Integer shiftId) {
        return shiftAssignmentRepository.findByShiftId(shiftId);
    }

    @Override
    public ShiftAssignment createShiftAssignment(ShiftAssignment shiftAssignment) {
        return shiftAssignmentRepository.save(shiftAssignment);
    }

    @Override
    public ShiftAssignment updateShiftAssignment(Integer employeeId, Integer shiftId, LocalDateTime shiftDate, ShiftAssignment shiftAssignmentDetails) {
        ShiftAssignment shiftAssignment = getShiftAssignmentById(employeeId, shiftId, shiftDate);
        shiftAssignment.setAssignmentDate(shiftAssignmentDetails.getAssignmentDate());
        return shiftAssignmentRepository.save(shiftAssignment);
    }

    @Override
    public void deleteShiftAssignment(Integer employeeId, Integer shiftId, LocalDateTime shiftDate) {
        ShiftAssignment shiftAssignment = getShiftAssignmentById(employeeId, shiftId, shiftDate);
        shiftAssignmentRepository.delete(shiftAssignment);
    }
    
    @Override
    public List<ShiftAssignment> autoAssignShifts(List<Employee> employees, List<ShiftDate> shiftDates, List<ShiftEnrollment> shiftEnrollments) {
        // Sử dụng DroolsEvaluatorService để tự động phân công ca làm việc
        List<ShiftAssignment> assignments = droolsEvaluatorService.autoAssignShifts(employees, shiftDates, shiftEnrollments);
        
        // Lưu các phân công vào cơ sở dữ liệu
        return shiftAssignmentRepository.saveAll(assignments);
    }
} 