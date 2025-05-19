package com.smashminton.rule_engine.repositories;

import com.smashminton.rule_engine.entities.ShiftDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ShiftDateRepository extends JpaRepository<ShiftDate, Integer> {
    List<ShiftDate> findByShiftDate(LocalDate date);
    List<ShiftDate> findByShiftDateBetween(LocalDate startDate, LocalDate endDate);
} 