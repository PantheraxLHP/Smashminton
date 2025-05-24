package com.smashminton.rule_engine.repositories;

import com.smashminton.rule_engine.entities.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
    Employee findByAccount_Username(String username);
} 