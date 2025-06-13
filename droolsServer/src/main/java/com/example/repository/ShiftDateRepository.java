package com.example.repository;

import com.example.model.Shift_Date;
import com.example.model.ShiftDateId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface ShiftDateRepository extends JpaRepository<Shift_Date, ShiftDateId> {
        List<Shift_Date> findByShiftId(int shiftId);

        @Query("SELECT sd FROM Shift_Date sd WHERE sd.shiftDate >= :startDate AND sd.shiftDate <= :endDate")
        List<Shift_Date> findByShiftDateBetween(@Param("startDate") LocalDateTime startDate,
                        @Param("endDate") LocalDateTime endDate);

        @Query("SELECT sd FROM Shift_Date sd WHERE sd.shiftId = :shiftId AND sd.shiftDate >= :startDate AND sd.shiftDate <= :endDate")
        List<Shift_Date> findByShiftIdAndShiftDateBetween(@Param("shiftId") int shiftId,
                        @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

        @Query("SELECT sd FROM Shift_Date sd WHERE sd.shiftId > 2 AND sd.shiftDate >= :startDate AND sd.shiftDate <= :endDate")
        List<Shift_Date> findByShiftIdGreaterThan2AndShiftDateBetween(@Param("startDate") LocalDateTime startDate,
                        @Param("endDate") LocalDateTime endDate);

        @Query("SELECT sd FROM Shift_Date sd WHERE sd.shiftId > 2 AND sd.shiftDate >= :startDate AND sd.shiftDate <= :endDate "
                        +
                        "AND (SELECT COUNT(sa) FROM ShiftAssignment sa WHERE sa.shiftId = sd.shiftId AND sa.shiftDate = sd.shiftDate) < :maxEmployees")
        List<Shift_Date> findAvailableShiftsByShiftIdGreaterThan2AndShiftDateBetween(
                        @Param("startDate") LocalDateTime startDate,
                        @Param("endDate") LocalDateTime endDate,
                        @Param("maxEmployees") long maxEmployees);
}
