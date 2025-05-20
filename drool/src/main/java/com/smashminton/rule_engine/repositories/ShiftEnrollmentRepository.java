package com.smashminton.rule_engine.repositories;

import com.smashminton.rule_engine.entities.ShiftEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ShiftEnrollmentRepository extends JpaRepository<ShiftEnrollment, ShiftEnrollment.ShiftEnrollmentId> {
    List<ShiftEnrollment> findByEmployeeId(Integer employeeId);
    List<ShiftEnrollment> findByShiftId(Integer shiftId);
    List<ShiftEnrollment> findByShiftDate(LocalDateTime shiftDate);
} 