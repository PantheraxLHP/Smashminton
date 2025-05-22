package com.smashminton.rule_engine.repositories;

import com.smashminton.rule_engine.entities.ShiftAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ShiftAssignmentRepository extends JpaRepository<ShiftAssignment, ShiftAssignment.ShiftAssignmentId> {
    List<ShiftAssignment> findByEmployeeId(Integer employeeId);
    List<ShiftAssignment> findByShiftId(Integer shiftId);
    List<ShiftAssignment> findByShiftDate(LocalDateTime shiftDate);
} 