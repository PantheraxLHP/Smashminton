package com.smashminton.rule_engine.repositories;

import com.smashminton.rule_engine.entities.ShiftAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShiftAssignmentRepository extends JpaRepository<ShiftAssignment, Integer> {
    List<ShiftAssignment> findByEmployee_EmployeeId(Integer employeeId);
    List<ShiftAssignment> findByShift_ShiftId(Integer shiftId);
} 