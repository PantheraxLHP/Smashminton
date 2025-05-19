package com.smashminton.rule_engine.services;

import com.smashminton.rule_engine.entities.ShiftDate;
import java.time.LocalDateTime;
import java.util.List;

public interface ShiftDateService {
    List<ShiftDate> getAllShiftDates();
    ShiftDate getShiftDateById(Integer id);
    List<ShiftDate> getShiftDatesByDate(LocalDateTime date);
    List<ShiftDate> getShiftDatesBetween(LocalDateTime startDate, LocalDateTime endDate);
    ShiftDate createShiftDate(ShiftDate shiftDate);
    ShiftDate updateShiftDate(Integer id, ShiftDate shiftDateDetails);
    void deleteShiftDate(Integer id);
} 