package com.smashminton.rule_engine.services;

import com.smashminton.rule_engine.entities.Employee;
import java.util.List;

public interface EmployeeService {
    List<Employee> getAllEmployees();
    Employee getEmployeeById(Integer id);
    Employee getEmployeeByUsername(String username);
    Employee createEmployee(Employee employee);
    Employee updateEmployee(Integer id, Employee employeeDetails);
    void deleteEmployee(Integer id);
} 