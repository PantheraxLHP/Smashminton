package com.smashminton.rule_engine.repositories;

import com.smashminton.rule_engine.entities.Shift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ShiftRepository extends JpaRepository<Shift, Integer> {
    List<Shift> findByShiftType(String shiftType);
    List<Shift> findByShiftAssignments_Employee_EmployeeId(Integer employeeId);
    List<Shift> findByShiftDates_ShiftDate(LocalDate shiftDate);
} 