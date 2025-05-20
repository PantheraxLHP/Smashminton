package com.smashminton.rule_engine.services.impl;

import com.smashminton.rule_engine.entities.Shift;
import com.smashminton.rule_engine.repositories.ShiftRepository;
import com.smashminton.rule_engine.services.ShiftService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ShiftServiceImpl implements ShiftService {

    @Autowired
    private ShiftRepository shiftRepository;

    @Override
    public List<Shift> getAllShifts() {
        return shiftRepository.findAll();
    }

    @Override
    public Shift getShiftById(Integer id) {
        return shiftRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Shift not found with id: " + id));
    }

    @Override
    public Shift createShift(Shift shift) {
        return shiftRepository.save(shift);
    }

    @Override
    public Shift updateShift(Integer id, Shift shiftDetails) {
        Shift shift = getShiftById(id);
        shift.setShiftType(shiftDetails.getShiftType());
        shift.setShiftStartHour(shiftDetails.getShiftStartHour());
        shift.setShiftEndHour(shiftDetails.getShiftEndHour());
        return shiftRepository.save(shift);
    }

    @Override
    public void deleteShift(Integer id) {
        Shift shift = getShiftById(id);
        shiftRepository.delete(shift);
    }

    @Override
    public List<Shift> getShiftsByType(String shiftType) {
        return shiftRepository.findByShiftType(shiftType);
    }

    @Override
    public List<Shift> getShiftsByEmployeeId(Integer employeeId) {
        return shiftRepository.findByShiftAssignments_Employee_EmployeeId(employeeId);
    }

    @Override
    public List<Shift> getShiftsByDate(String date) {
        LocalDate localDate = LocalDate.parse(date, DateTimeFormatter.ISO_DATE);
        return shiftRepository.findByShiftDates_ShiftDate(localDate);
    }
} 