package com.smashminton.rule_engine.services;

import com.smashminton.rule_engine.entities.ShiftDate;
import java.time.LocalDate;
import java.util.List;

public interface ShiftDateService {
    List<ShiftDate> getAllShiftDates();
    ShiftDate getShiftDateById(Integer id);
    List<ShiftDate> getShiftDatesByDate(LocalDate date);
    List<ShiftDate> getShiftDatesBetween(LocalDate startDate, LocalDate endDate);
    ShiftDate createShiftDate(ShiftDate shiftDate);
    ShiftDate updateShiftDate(Integer id, ShiftDate shiftDateDetails);
    void deleteShiftDate(Integer id);
} 