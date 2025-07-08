package com.example.repository;

import com.example.model.ShiftAssignment;
import com.example.model.ShiftAssignmentId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface ShiftAssignmentRepository extends JpaRepository<ShiftAssignment, ShiftAssignmentId> {
        @Query("SELECT sa FROM ShiftAssignment sa WHERE sa.shiftDate >= :startDate AND sa.shiftDate <= :endDate")
        List<ShiftAssignment> findByShiftDateBetween(@Param("startDate") LocalDateTime startDate,
                        @Param("endDate") LocalDateTime endDate);

        @Query("SELECT sa FROM ShiftAssignment sa WHERE sa.employeeId = :employeeId AND sa.shiftDate >= :startDate AND sa.shiftDate <= :endDate")
        List<ShiftAssignment> findByEmployeeAndShiftDateBetween(@Param("employeeId") int employeeId,
                        @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

        @Query("SELECT COUNT(sa) FROM ShiftAssignment sa WHERE sa.employeeId = :employeeId AND sa.shiftDate >= :startDate AND sa.shiftDate <= :endDate")
        int countByEmployeeAndShiftDateBetween(@Param("employeeId") int employeeId,
                        @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

        @Query("SELECT COUNT(sa) FROM ShiftAssignment sa WHERE sa.shiftId = :shiftId AND sa.shiftDate = :shiftDate")
        int countByShiftIdAndShiftDate(@Param("shiftId") int shiftId, @Param("shiftDate") LocalDateTime shiftDate);
}
