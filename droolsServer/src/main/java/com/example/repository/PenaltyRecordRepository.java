package com.example.repository;

import com.example.model.PenaltyRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PenaltyRecordRepository extends JpaRepository<PenaltyRecord, Integer> {

    /**
     * Find penalty records by employee ID and date range
     */
    @Query("SELECT pr FROM PenaltyRecord pr WHERE pr.employeeId = :employeeId AND pr.violationDate BETWEEN :startDate AND :endDate")
    List<PenaltyRecord> findByEmployeeIdAndViolationDateBetween(
            @Param("employeeId") Integer employeeId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    /**
     * Find penalty records by employee ID and current month
     */
    @Query("SELECT pr FROM PenaltyRecord pr WHERE pr.employeeId = :employeeId " +
            "AND EXTRACT(YEAR FROM pr.violationDate) = :year " +
            "AND EXTRACT(MONTH FROM pr.violationDate) = :month")
    List<PenaltyRecord> findByEmployeeIdAndCurrentMonth(
            @Param("employeeId") Integer employeeId,
            @Param("year") int year,
            @Param("month") int month);

    /**
     * Count penalty records by employee ID and penalty rule name pattern for
     * current month
     */
    @Query("SELECT COUNT(pr) FROM PenaltyRecord pr " +
            "JOIN pr.penaltyRule rule " +
            "WHERE pr.employeeId = :employeeId " +
            "AND LOWER(rule.penaltyName) LIKE LOWER(CONCAT('%', :penaltyType, '%')) " +
            "AND EXTRACT(YEAR FROM pr.violationDate) = :year " +
            "AND EXTRACT(MONTH FROM pr.violationDate) = :month")
    long countByEmployeeIdAndPenaltyTypeAndCurrentMonth(
            @Param("employeeId") Integer employeeId,
            @Param("penaltyType") String penaltyType,
            @Param("year") int year,
            @Param("month") int month);
}
