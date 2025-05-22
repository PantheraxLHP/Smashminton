package com.smashminton.rule_engine.controllers;

import com.smashminton.rule_engine.entities.*;
import com.smashminton.rule_engine.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestController {
    private static final Logger logger = LoggerFactory.getLogger(TestController.class);

    @Autowired
    private EmployeeService employeeService;
    
    @Autowired
    private ShiftDateService shiftDateService;
    
    @Autowired
    private ShiftEnrollmentService shiftEnrollmentService;

    @GetMapping("/check-data")
    public ResponseEntity<Map<String, Object>> checkData() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // Get data from DB
            List<Employee> employees = employeeService.getAllEmployees();
            List<ShiftDate> shiftDates = shiftDateService.getAllShiftDates();
            List<ShiftEnrollment> shiftEnrollments = shiftEnrollmentService.getAllShiftEnrollments();
            
            // Add counts to result
            result.put("employeeCount", employees.size());
            result.put("shiftDateCount", shiftDates.size());
            result.put("enrollmentCount", shiftEnrollments.size());
            
            // Add sample data
            if (!employees.isEmpty()) {
                result.put("sampleEmployee", employees.get(0));
            }
            if (!shiftDates.isEmpty()) {
                result.put("sampleShiftDate", shiftDates.get(0));
            }
            if (!shiftEnrollments.isEmpty()) {
                result.put("sampleEnrollment", shiftEnrollments.get(0));
            }
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Error checking data: ", e);
            result.put("error", e.getMessage());
            return ResponseEntity.status(500).body(result);
        }
    }

    @GetMapping("/log-data")
    public ResponseEntity<String> logData() {
        try {
            // Get data from DB
            List<Employee> employees = employeeService.getAllEmployees();
            List<ShiftDate> shiftDates = shiftDateService.getAllShiftDates();
            List<ShiftEnrollment> shiftEnrollments = shiftEnrollmentService.getAllShiftEnrollments();
            
            // Log data
            logger.info("=== Data from DB ===");
            logger.info("Employees count: {}", employees.size());
            logger.info("ShiftDates count: {}", shiftDates.size());
            logger.info("Enrollments count: {}", shiftEnrollments.size());
            
            logger.info("=== Employees ===");
            for (Employee e : employees) {
                logger.info("Employee: id={}, type={}", e.getEmployeeId(), e.getEmployeeType());
            }
            
            logger.info("=== ShiftDates ===");
            for (ShiftDate s : shiftDates) {
                logger.info("ShiftDate: id={}, date={}", s.getShiftId(), s.getShiftDate());
            }
            
            logger.info("=== Enrollments ===");
            for (ShiftEnrollment se : shiftEnrollments) {
                logger.info("Enrollment: employeeId={}, shiftId={}, date={}", 
                    se.getEmployeeId(), se.getShiftId(), se.getShiftDate());
            }
            
            return ResponseEntity.ok("Data logged successfully. Check application logs for details.");
        } catch (Exception e) {
            logger.error("Error logging data: ", e);
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
} 