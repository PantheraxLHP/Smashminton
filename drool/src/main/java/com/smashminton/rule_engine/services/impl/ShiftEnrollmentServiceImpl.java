package com.smashminton.rule_engine.services.impl;

import com.smashminton.rule_engine.entities.ShiftEnrollment;
import com.smashminton.rule_engine.repositories.ShiftEnrollmentRepository;
import com.smashminton.rule_engine.services.ShiftEnrollmentService;
import javax.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShiftEnrollmentServiceImpl implements ShiftEnrollmentService {

    @Autowired
    private ShiftEnrollmentRepository shiftEnrollmentRepository;

    @Override
    public List<ShiftEnrollment> getAllShiftEnrollments() {
        return shiftEnrollmentRepository.findAll();
    }

    @Override
    public ShiftEnrollment getShiftEnrollmentById(Integer id) {
        return shiftEnrollmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ShiftEnrollment not found with id: " + id));
    }

    @Override
    public List<ShiftEnrollment> getShiftEnrollmentsByEmployeeId(Integer employeeId) {
        return shiftEnrollmentRepository.findByEmployee_EmployeeId(employeeId);
    }

    @Override
    public List<ShiftEnrollment> getShiftEnrollmentsByShiftId(Integer shiftId) {
        return shiftEnrollmentRepository.findByShift_ShiftId(shiftId);
    }

    @Override
    public ShiftEnrollment createShiftEnrollment(ShiftEnrollment shiftEnrollment) {
        return shiftEnrollmentRepository.save(shiftEnrollment);
    }

    @Override
    public ShiftEnrollment updateShiftEnrollment(Integer id, ShiftEnrollment shiftEnrollmentDetails) {
        ShiftEnrollment shiftEnrollment = getShiftEnrollmentById(id);
        shiftEnrollment.setEmployee(shiftEnrollmentDetails.getEmployee());
        shiftEnrollment.setShift(shiftEnrollmentDetails.getShift());
        return shiftEnrollmentRepository.save(shiftEnrollment);
    }

    @Override
    public void deleteShiftEnrollment(Integer id) {
        ShiftEnrollment shiftEnrollment = getShiftEnrollmentById(id);
        shiftEnrollmentRepository.delete(shiftEnrollment);
    }
} 