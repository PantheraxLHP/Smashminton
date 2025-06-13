package com.example.repository;

import com.example.model.PenaltyRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PenaltyRuleRepository extends JpaRepository<PenaltyRule, Integer> {

    /**
     * Find penalty rule by name
     */
    Optional<PenaltyRule> findByPenaltyName(String penaltyName);

    /**
     * Find penalty rule by name containing (case insensitive)
     */
    @Query("SELECT pr FROM PenaltyRule pr WHERE LOWER(pr.penaltyName) LIKE LOWER(CONCAT('%', :name, '%'))")
    Optional<PenaltyRule> findByPenaltyNameContainingIgnoreCase(@Param("name") String name);
}
