package com.smashminton.rule_engine.services;

import com.smashminton.rule_engine.entities.Shift;
import java.util.List;

public interface ShiftService {
    List<Shift> getAllShifts();
    Shift getShiftById(Integer id);
    Shift createShift(Shift shift);
    Shift updateShift(Integer id, Shift shiftDetails);
    void deleteShift(Integer id);
    List<Shift> getShiftsByType(String shiftType);
    List<Shift> getShiftsByEmployeeId(Integer employeeId);
    List<Shift> getShiftsByDate(String date);
} 