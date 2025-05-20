package com.smashminton.rule_engine.services.impl;

import com.smashminton.rule_engine.entities.ShiftAssignment;
import com.smashminton.rule_engine.repositories.ShiftAssignmentRepository;
import com.smashminton.rule_engine.services.ShiftAssignmentService;
import javax.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShiftAssignmentServiceImpl implements ShiftAssignmentService {

    @Autowired
    private ShiftAssignmentRepository shiftAssignmentRepository;

    @Override
    public List<ShiftAssignment> getAllShiftAssignments() {
        return shiftAssignmentRepository.findAll();
    }

    @Override
    public ShiftAssignment getShiftAssignmentById(Integer id) {
        return shiftAssignmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ShiftAssignment not found with id: " + id));
    }

    @Override
    public List<ShiftAssignment> getShiftAssignmentsByEmployeeId(Integer employeeId) {
        return shiftAssignmentRepository.findByEmployee_EmployeeId(employeeId);
    }

    @Override
    public List<ShiftAssignment> getShiftAssignmentsByShiftId(Integer shiftId) {
        return shiftAssignmentRepository.findByShift_ShiftId(shiftId);
    }

    @Override
    public ShiftAssignment createShiftAssignment(ShiftAssignment shiftAssignment) {
        return shiftAssignmentRepository.save(shiftAssignment);
    }

    @Override
    public ShiftAssignment updateShiftAssignment(Integer id, ShiftAssignment shiftAssignmentDetails) {
        ShiftAssignment shiftAssignment = getShiftAssignmentById(id);
        shiftAssignment.setEmployee(shiftAssignmentDetails.getEmployee());
        shiftAssignment.setShift(shiftAssignmentDetails.getShift());
        return shiftAssignmentRepository.save(shiftAssignment);
    }

    @Override
    public void deleteShiftAssignment(Integer id) {
        ShiftAssignment shiftAssignment = getShiftAssignmentById(id);
        shiftAssignmentRepository.delete(shiftAssignment);
    }
} 