package com.example.repository;

import com.example.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    @Query("SELECT e FROM Employee e WHERE LOWER(e.employee_type) = 'part-time'")
    List<Employee> findPartTimeEmployees();

    @Query("SELECT DISTINCT e.employeeId FROM Employee e JOIN ShiftEnrollment se ON e.employeeId = se.employeeId WHERE LOWER(e.employee_type) = 'part-time' AND se.shiftId > 2 AND se.shiftDate >= :startDate AND se.shiftDate <= :endDate")
    List<Integer> findAvailablePartTimeEmployeesId(@Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT e FROM Employee e WHERE e.employeeId = :employeeId")
    Employee findEmployeeById(@Param("employeeId") Integer employeeId);
}
