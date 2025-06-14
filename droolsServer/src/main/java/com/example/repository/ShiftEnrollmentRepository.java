package com.example.repository;

import com.example.model.ShiftEnrollment;
import com.example.model.ShiftEnrollmentId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface ShiftEnrollmentRepository extends JpaRepository<ShiftEnrollment, ShiftEnrollmentId> {
        @Query("SELECT se FROM ShiftEnrollment se WHERE se.shiftId > 2 AND se.shiftDate >= :startDate AND se.shiftDate <= :endDate")
        List<ShiftEnrollment> findByShiftDateBetween(@Param("startDate") LocalDateTime startDate,
                        @Param("endDate") LocalDateTime endDate);

        @Query("SELECT se FROM ShiftEnrollment se WHERE se.employeeId = :employeeId AND se.shiftDate >= :startDate AND se.shiftDate <= :endDate")
        List<ShiftEnrollment> findByEmployeeAndShiftDateBetween(@Param("employeeId") int employeeId,
                        @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

        @Query("SELECT se FROM ShiftEnrollment se WHERE se.shiftId = :shiftId AND se.shiftDate >= :startDate AND se.shiftDate <= :endDate")
        List<ShiftEnrollment> findByShiftIdAndShiftDateBetween(@Param("shiftId") int shiftId,
                        @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
