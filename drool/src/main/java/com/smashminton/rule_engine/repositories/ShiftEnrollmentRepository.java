package com.smashminton.rule_engine.repositories;

import com.smashminton.rule_engine.entities.ShiftEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShiftEnrollmentRepository extends JpaRepository<ShiftEnrollment, Integer> {
    List<ShiftEnrollment> findByEmployee_EmployeeId(Integer employeeId);
    List<ShiftEnrollment> findByShift_ShiftId(Integer shiftId);
} 