package com.smashminton.rule_engine.services.impl;

import com.smashminton.rule_engine.entities.Employee;
import com.smashminton.rule_engine.repositories.EmployeeRepository;
import com.smashminton.rule_engine.services.EmployeeService;
import javax.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @Override
    public Employee getEmployeeById(Integer id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found with id: " + id));
    }

    @Override
    public Employee getEmployeeByUsername(String username) {
        Employee employee = employeeRepository.findByAccount_Username(username);
        if (employee == null) {
            throw new EntityNotFoundException("Employee not found with username: " + username);
        }
        return employee;
    }

    @Override
    public Employee createEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    @Override
    public Employee updateEmployee(Integer id, Employee employeeDetails) {
        Employee employee = getEmployeeById(id);
        employee.setEmployeeType(employeeDetails.getEmployeeType());
        employee.setAccount(employeeDetails.getAccount());
        return employeeRepository.save(employee);
    }

    @Override
    public void deleteEmployee(Integer id) {
        Employee employee = getEmployeeById(id);
        employeeRepository.delete(employee);
    }
} 