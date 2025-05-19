package com.smashminton.rule_engine.services.impl;

import com.smashminton.rule_engine.entities.ShiftDate;
import com.smashminton.rule_engine.repositories.ShiftDateRepository;
import com.smashminton.rule_engine.services.ShiftDateService;
import javax.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ShiftDateServiceImpl implements ShiftDateService {

    @Autowired
    private ShiftDateRepository shiftDateRepository;

    @Override
    public List<ShiftDate> getAllShiftDates() {
        return shiftDateRepository.findAll();
    }

    @Override
    public ShiftDate getShiftDateById(Integer id) {
        return shiftDateRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ShiftDate not found with id: " + id));
    }

    @Override
    public List<ShiftDate> getShiftDatesByDate(LocalDate date) {
        return shiftDateRepository.findByShiftDate(date);
    }

    @Override
    public List<ShiftDate> getShiftDatesBetween(LocalDate startDate, LocalDate endDate) {
        return shiftDateRepository.findByShiftDateBetween(startDate, endDate);
    }

    @Override
    public ShiftDate createShiftDate(ShiftDate shiftDate) {
        return shiftDateRepository.save(shiftDate);
    }

    @Override
    public ShiftDate updateShiftDate(Integer id, ShiftDate shiftDateDetails) {
        ShiftDate shiftDate = getShiftDateById(id);
        shiftDate.setShiftDate(shiftDateDetails.getShiftDate());
        return shiftDateRepository.save(shiftDate);
    }

    @Override
    public void deleteShiftDate(Integer id) {
        ShiftDate shiftDate = getShiftDateById(id);
        shiftDateRepository.delete(shiftDate);
    }
} 