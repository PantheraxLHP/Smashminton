package com.smashminton.rule_engine.services.impl;

import com.smashminton.rule_engine.entities.ShiftDate;
import com.smashminton.rule_engine.repositories.ShiftDateRepository;
import com.smashminton.rule_engine.services.ShiftDateService;
import javax.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ShiftDateServiceImpl implements ShiftDateService {
    private static final Logger logger = LoggerFactory.getLogger(ShiftDateServiceImpl.class);

    @Autowired
    private ShiftDateRepository shiftDateRepository;

    @Override
    public List<ShiftDate> getAllShiftDates() {
        return shiftDateRepository.findAll();
    }

    @Override
    public ShiftDate getShiftDateById(Integer id) {
        return shiftDateRepository.findById(new ShiftDate.ShiftDateId(id, null))
                .orElseThrow(() -> new EntityNotFoundException("ShiftDate not found with id: " + id));
    }

    @Override
    public List<ShiftDate> getShiftDatesByDate(LocalDateTime date) {
        return shiftDateRepository.findByShiftDate(date);
    }

    @Override
    public List<ShiftDate> getShiftDatesBetween(LocalDateTime startDate, LocalDateTime endDate) {
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