package com.smashminton.rule_engine.repositories;

import com.smashminton.rule_engine.entities.ShiftDate;
import com.smashminton.rule_engine.entities.ShiftDate.ShiftDateId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ShiftDateRepository extends JpaRepository<ShiftDate, ShiftDateId> {
    List<ShiftDate> findByShiftDate(LocalDateTime date);
    List<ShiftDate> findByShiftDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT sd FROM ShiftDate sd")
    List<ShiftDate> findAllShiftDates();
    
    @Query("SELECT sd FROM ShiftDate sd WHERE sd.shiftId = :shiftId")
    List<ShiftDate> findByShiftId(Integer shiftId);
    
    @Query(value = "SELECT * FROM shift_dates", nativeQuery = true)
    List<ShiftDate> findAllNative();

    @Query(value = "SELECT COUNT(*) FROM shift_dates", nativeQuery = true)
    Long countAllNative();

    @Query(value = "SELECT shiftid, shiftdate FROM shift_dates", nativeQuery = true)
    List<Object[]> findAllRawData();

    @Query(value = "SELECT * FROM shift_dates WHERE shiftid = :shiftId", nativeQuery = true)
    List<Object[]> findByShiftIdNative(@Param("shiftId") Integer shiftId);

    @Query(value = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'shift_dates'", nativeQuery = true)
    String checkTableExists();

    @Query(value = "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'shift_dates'", nativeQuery = true)
    List<Object[]> getTableStructure();
} 