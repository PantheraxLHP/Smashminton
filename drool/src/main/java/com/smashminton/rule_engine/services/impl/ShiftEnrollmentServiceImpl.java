package com.smashminton.rule_engine.services.impl;

import com.smashminton.rule_engine.entities.ShiftEnrollment;
import com.smashminton.rule_engine.repositories.ShiftEnrollmentRepository;
import com.smashminton.rule_engine.services.ShiftEnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
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
    public ShiftEnrollment getShiftEnrollmentById(Integer employeeId, Integer shiftId, LocalDateTime shiftDate) {
        return shiftEnrollmentRepository.findById(new ShiftEnrollment.ShiftEnrollmentId(employeeId, shiftId, shiftDate))
                .orElseThrow(() -> new EntityNotFoundException("ShiftEnrollment not found"));
    }

    @Override
    public List<ShiftEnrollment> getShiftEnrollmentsByEmployeeId(Integer employeeId) {
        return shiftEnrollmentRepository.findByEmployeeId(employeeId);
    }

    @Override
    public List<ShiftEnrollment> getShiftEnrollmentsByShiftId(Integer shiftId) {
        return shiftEnrollmentRepository.findByShiftId(shiftId);
    }

    @Override
    public List<ShiftEnrollment> getShiftEnrollmentsByDate(LocalDateTime date) {
        return shiftEnrollmentRepository.findByShiftDate(date);
    }

    @Override
    public ShiftEnrollment createShiftEnrollment(ShiftEnrollment shiftEnrollment) {
        return shiftEnrollmentRepository.save(shiftEnrollment);
    }

    @Override
    public ShiftEnrollment updateShiftEnrollment(Integer employeeId, Integer shiftId, LocalDateTime shiftDate, 
            ShiftEnrollment shiftEnrollmentDetails) {
        ShiftEnrollment shiftEnrollment = getShiftEnrollmentById(employeeId, shiftId, shiftDate);
        shiftEnrollment.setEnrollmentDate(shiftEnrollmentDetails.getEnrollmentDate());
        return shiftEnrollmentRepository.save(shiftEnrollment);
    }

    @Override
    public void deleteShiftEnrollment(Integer employeeId, Integer shiftId, LocalDateTime shiftDate) {
        ShiftEnrollment shiftEnrollment = getShiftEnrollmentById(employeeId, shiftId, shiftDate);
        shiftEnrollmentRepository.delete(shiftEnrollment);
    }
} 