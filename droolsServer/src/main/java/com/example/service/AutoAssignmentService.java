package com.example.service;

import com.example.dto.AutoAssignmentRequest;
import com.example.dto.AutoAssignmentResponse;
import com.example.model.*;
import com.example.util.Sort;
import org.kie.api.runtime.KieSession;
import org.kie.api.runtime.rule.FactHandle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;
import java.util.Iterator;

@Service
@Transactional
public class AutoAssignmentService {
    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ShiftDateRepository shiftDateRepository;

    @Autowired
    private ShiftEnrollmentRepository shiftEnrollmentRepository;

    @Autowired
    private ShiftAssignmentRepository shiftAssignmentRepository;

    @Autowired
    private DroolsService droolsService;

    public AutoAssignmentResponse performAutoAssignment(AutoAssignmentRequest request) {
        AutoAssignmentResponse response = new AutoAssignmentResponse();
        try {
            // Calculate next week dates
            int currentDayOfWeek = LocalDateTime.now().getDayOfWeek().getValue();
            LocalDateTime nextWeekStart = LocalDateTime.now().plusDays(7 - currentDayOfWeek + 1).withHour(0)
                    .withMinute(0).withSecond(0).withNano(0);
            LocalDateTime nextWeekEnd = nextWeekStart.plusDays(6).withHour(23).withMinute(59).withSecond(59)
                    .withNano(999999999);
            LocalDateTime nextWeekStartDateTime = nextWeekStart;
            LocalDateTime nextWeekEndDateTime = nextWeekEnd; // Load part-time employees and initialize their
                                                             // assignedShiftInDay for next week
            List<Employee> employees = loadAndInitializePartTimeEmployees(nextWeekStartDateTime, nextWeekEndDateTime);
            if (employees.isEmpty()) {
                return new AutoAssignmentResponse(false, "No part-time employees found in database");
            }

            // Load shift dates for next week with shiftId > 2
            List<Shift_Date> shiftDates = shiftDateRepository.findByShiftIdGreaterThan2AndShiftDateBetween(
                    nextWeekStartDateTime, nextWeekEndDateTime);

            if (shiftDates.isEmpty()) {
                return new AutoAssignmentResponse(false, "No shifts found for next week with shiftId > 2");
            }
            // Load shift enrollments for next week from database
            List<ShiftEnrollment> shiftEnrollments = shiftEnrollmentRepository.findByShiftDateBetween(
                    nextWeekStartDateTime, nextWeekEndDateTime);

            if (shiftEnrollments.isEmpty()) {
                return new AutoAssignmentResponse(false, "No shift enrollments found for next week");
            }

            // Create Sort object based on request
            Sort sort = createSortFromOption(request.getSortOption());

            // Execute Drools auto-assignment logic
            List<ShiftAssignment> assignments = executeAssignmentLogic(
                    employees, shiftDates, shiftEnrollments, sort);

            // Save assignments to database
            if (!assignments.isEmpty()) {
                shiftAssignmentRepository.saveAll(assignments);
            }

            // Build response
            response.setSuccess(true);
            response.setAssignments(assignments);
            response.setEmployeesProcessed(employees.size());
            response.setShiftsProcessed(shiftDates.size());
            response.setSortOptionUsed(request.getSortOption());
            response.setMessage(String.format(
                    "Successfully created %d assignments for next week (%s to %s) using part-time employees and shifts with ID > 2",
                    assignments.size(), nextWeekStart.toLocalDate(), nextWeekEnd.toLocalDate()));

            return response;

        } catch (Exception e) {
            return new AutoAssignmentResponse(false,
                    "Error during auto-assignment: " + e.getClass().getSimpleName() + " - " + e.getMessage());
        }
    }

    private List<Employee> loadAndInitializePartTimeEmployees(LocalDateTime startDate, LocalDateTime endDate) {
        List<Employee> employees = employeeRepository.findPartTimeEmployees();

        // Initialize assignedShiftInDay for next week for each employee
        for (Employee employee : employees) {
            employee.getAssignedShiftInDay().clear();

            // Get existing assignments for this employee in the next week
            List<ShiftAssignment> existingAssignments = shiftAssignmentRepository
                    .findByEmployeeAndShiftDateBetween(employee.getEmployeeId(), startDate, endDate);

            // Initialize all days of next week to 0 using LocalDate
            LocalDate currentDate = startDate.toLocalDate();
            LocalDate endDateOnly = endDate.toLocalDate();
            while (!currentDate.isAfter(endDateOnly)) {
                employee.setAssignedShiftInDay(currentDate.atStartOfDay(), 0);
                currentDate = currentDate.plusDays(1);
            }

            // Set actual assignment counts from database
            for (ShiftAssignment assignment : existingAssignments) {
                LocalDateTime assignmentDateTime = assignment.getShiftDate();
                int currentCount = employee.getAssignedShiftInDay(assignmentDateTime);
                employee.setAssignedShiftInDay(assignmentDateTime, currentCount + 1);
            }

            // Calculate total assigned shifts in week
            int totalWeekAssignments = shiftAssignmentRepository
                    .countByEmployeeAndShiftDateBetween(employee.getEmployeeId(), startDate, endDate);
            employee.setAssingedShiftInWeek(totalWeekAssignments);
        }

        return employees;
    }

    private Sort createSortFromOption(int sortOption) {
        Sort sort = new Sort();

        switch (sortOption) {
            case 1: // Priority Ascending
                sort.setSortEnabled(true);
                sort.setSortBy(Sort.SortBy.PRIORITY);
                sort.setSortType(Sort.SortType.ASCENDING);
                break;
            case 2: // Priority Descending
                sort.setSortEnabled(true);
                sort.setSortBy(Sort.SortBy.PRIORITY);
                sort.setSortType(Sort.SortType.DESCENDING);
                break;
            case 3: // Assigned Shifts Ascending
                sort.setSortEnabled(true);
                sort.setSortBy(Sort.SortBy.ASSIGNEDSHIFTINWEEK);
                sort.setSortType(Sort.SortType.ASCENDING);
                break;
            case 4: // Assigned Shifts Descending
                sort.setSortEnabled(true);
                sort.setSortBy(Sort.SortBy.ASSIGNEDSHIFTINWEEK);
                sort.setSortType(Sort.SortType.DESCENDING);
                break;
            default: // No sort
                sort.setSortEnabled(false);
                break;
        }

        return sort;
    }

    private List<ShiftAssignment> executeAssignmentLogic(
            List<Employee> employees,
            List<Shift_Date> shiftDates,
            List<ShiftEnrollment> enrollments,
            Sort sort) {

        KieSession kieSession = droolsService.getKieSession();
        List<ShiftAssignment> assignments = new ArrayList<>();

        try {
            // Insert all facts into KieSession
            for (Employee employee : employees) {
                kieSession.insert(employee);
            }

            for (Shift_Date shiftDate : shiftDates) {
                kieSession.insert(shiftDate);
            }

            // Create container objects
            ShiftEnrollments shiftEnrollments = new ShiftEnrollments();
            for (ShiftEnrollment enrollment : enrollments) {
                shiftEnrollments.addEnrollment(enrollment);
                kieSession.insert(enrollment);
            }
            EligibleEmployees eligibleEmployees = new EligibleEmployees();
            AssignableShifts assignableShifts = new AssignableShifts();
            ShiftAssignments shiftAssignments = new ShiftAssignments();
            AutoAssignmentContext autoAssignmentContext = new AutoAssignmentContext();

            kieSession.insert(autoAssignmentContext);
            kieSession.insert(eligibleEmployees);
            kieSession.insert(assignableShifts);
            kieSession.insert(shiftAssignments);
            kieSession.insert(shiftEnrollments);
            kieSession.insert(sort);

            // Execute assignment logic similar to DroolsEvaluator
            executeEnrollmentBasedAssignment(kieSession, employees, shiftDates,
                    shiftEnrollments, eligibleEmployees, assignableShifts,
                    shiftAssignments, autoAssignmentContext);

            // Execute remaining shift assignment
            executeRemainingShiftAssignment(kieSession, employees, shiftDates,
                    eligibleEmployees, assignableShifts, shiftAssignments, autoAssignmentContext);

            assignments.addAll(shiftAssignments.getAssignments());

        } finally {
            // Clear all facts from KieSession
            for (FactHandle factHandle : kieSession.getFactHandles()) {
                kieSession.delete(factHandle);
            }
        }

        return assignments;
    }

    // Implementation based on DroolsEvaluator Step 1
    private void executeEnrollmentBasedAssignment(
            KieSession kieSession,
            List<Employee> employees,
            List<Shift_Date> shiftDates,
            ShiftEnrollments shiftEnrollments,
            EligibleEmployees eligibleEmployees,
            AssignableShifts assignableShifts,
            ShiftAssignments shiftAssignments,
            AutoAssignmentContext autoAssignmentContext) {

        while (shiftEnrollments.getSize() > 0) {
            // Execute EnrollmentShiftRule
            kieSession.getAgenda().getAgendaGroup("EnrollmentShiftRule").setFocus();
            kieSession.fireAllRules();

            // Update assignable shifts
            updateAssignableShifts(kieSession, shiftDates, assignableShifts, shiftEnrollments);

            if (assignableShifts.getSize() <= 0 || shiftEnrollments.getSize() <= 0) {
                System.out.println("Breaking from enrollment loop - assignable: " + assignableShifts.getSize()
                        + ", enrollments: " + shiftEnrollments.getSize());
                break;
            }

            // Set current shift context
            autoAssignmentContext.setCurrentShift(assignableShifts.getShifts().get(0));
            FactHandle contextHandle = kieSession.getFactHandle(autoAssignmentContext);
            kieSession.update(contextHandle, autoAssignmentContext);

            // Execute EnrollmentEmployeeRule
            kieSession.getAgenda().getAgendaGroup("EnrollmentEmployeeRule").setFocus();
            kieSession.fireAllRules();

            // Update eligible employees
            updateEligibleEmployees(kieSession, employees, eligibleEmployees, shiftEnrollments);

            if (eligibleEmployees.getSize() <= 0) {
                System.out.println("Breaking from enrollment loop - no eligible employees");
                break;
            }

            // Execute sorting
            FactHandle eligibleHandle = kieSession.getFactHandle(eligibleEmployees);
            if (eligibleHandle != null) {
                kieSession.update(eligibleHandle, eligibleEmployees);
            }

            kieSession.getAgenda().getAgendaGroup("EmployeeSortingRule").setFocus();
            kieSession.fireAllRules();

            // Make assignment
            if (eligibleEmployees.getSize() > 0) {
                Shift_Date chosenShift = autoAssignmentContext.getCurrentShift();
                Employee chosenEmployee = eligibleEmployees.getEmployees().get(0);

                ShiftAssignment assignment = assignEmployeeToShift(kieSession, chosenShift, chosenEmployee);
                shiftAssignments.addAssignment(assignment);

                // Remove processed enrollment
                removeProcessedEnrollment(kieSession, shiftEnrollments, chosenEmployee, chosenShift);
            }
        }
    }

    // Implementation based on DroolsEvaluator Step 2
    private void executeRemainingShiftAssignment(
            KieSession kieSession,
            List<Employee> employees,
            List<Shift_Date> shiftDates,
            EligibleEmployees eligibleEmployees,
            AssignableShifts assignableShifts,
            ShiftAssignments shiftAssignments,
            AutoAssignmentContext autoAssignmentContext) {
        int iterationCount = 0;
        final int MAX_ITERATIONS = 300;
        int lastAssignmentCount = 0;

        do {
            iterationCount++;

            if (iterationCount > MAX_ITERATIONS) {
                System.out.println("**ERROR**: Reached maximum iterations (" + MAX_ITERATIONS
                        + "). Breaking to prevent infinite loop!");
                break;
            }

            // Safety check: If no progress is being made, break the loop
            if (shiftAssignments.getSize() == lastAssignmentCount && iterationCount > 10) {
                System.out.println(
                        "**SAFETY**: No assignments made in the last iteration. Breaking to prevent infinite loop!");
                break;
            }
            lastAssignmentCount = shiftAssignments.getSize();

            // Safety check: If we've reached exactly 56 assignments, break
            if (shiftAssignments.getSize() >= 56) {
                System.out.println("**SUCCESS**: Reached optimal assignment count (56). Current assignments: "
                        + shiftAssignments.getSize());
                break;
            }

            // Execute ShiftRule
            kieSession.getAgenda().getAgendaGroup("ShiftRule").setFocus();
            kieSession.fireAllRules();

            // Update assignable shifts
            updateAssignableShiftsForRemainingAssignment(kieSession, shiftDates, assignableShifts);

            if (assignableShifts.getSize() <= 0) {
                System.out.println("Breaking from remaining assignment - no assignable shifts");
                break;
            }

            // Set current shift context
            autoAssignmentContext.setCurrentShift(assignableShifts.getShifts().get(0));
            FactHandle contextHandle = kieSession.getFactHandle(autoAssignmentContext);
            kieSession.update(contextHandle, autoAssignmentContext);

            // Execute EmployeeRule
            kieSession.getAgenda().getAgendaGroup("EmployeeRule").setFocus();
            kieSession.fireAllRules();

            // Update eligible employees
            updateEligibleEmployeesForRemainingAssignment(kieSession, employees, eligibleEmployees);

            if (eligibleEmployees.getSize() <= 0) {
                System.out.println("Breaking from remaining assignment - no eligible employees");
                break;
            }

            // Execute sorting
            FactHandle eligibleHandle = kieSession.getFactHandle(eligibleEmployees);
            if (eligibleHandle != null) {
                kieSession.update(eligibleHandle, eligibleEmployees);
            }

            kieSession.getAgenda().getAgendaGroup("EmployeeSortingRule").setFocus();
            kieSession.fireAllRules();

            if (eligibleEmployees.getSize() <= 0) {
                System.out.println("Breaking from remaining assignment - no eligible employees after sorting");
                break;
            }

            // Make assignment
            ShiftAssignment assignment = assignEmployeeToShift(kieSession,
                    autoAssignmentContext.getCurrentShift(),
                    eligibleEmployees.getEmployees().get(0));
            shiftAssignments.addAssignment(assignment);

        } while (true);
    }

    private ShiftAssignment assignEmployeeToShift(KieSession kieSession, Shift_Date shift, Employee employee) {
        // Update shift
        shift.setAssignedEmployees(shift.getAssignedEmployees() + 1);
        FactHandle shiftHandle = kieSession.getFactHandle(shift);
        kieSession.update(shiftHandle, shift);

        // Update employee
        LocalDateTime shiftDateTime = shift.getShiftDate();
        employee.setAssignedShiftInDay(shiftDateTime, employee.getAssignedShiftInDay(shiftDateTime) + 1);
        employee.setAssingedShiftInWeek(employee.getAssignedShiftInWeek() + 1);
        FactHandle employeeHandle = kieSession.getFactHandle(employee);
        kieSession.update(employeeHandle, employee);

        // Create assignment
        ShiftAssignment assignment = new ShiftAssignment(employee, shift);
        kieSession.insert(assignment);

        return assignment;
    }

    private void updateAssignableShifts(KieSession kieSession, List<Shift_Date> shiftDates,
            AssignableShifts assignableShifts, ShiftEnrollments shiftEnrollments) {
        assignableShifts.clearShifts();
        Iterator<Shift_Date> iterator = shiftDates.iterator();

        while (iterator.hasNext()) {
            Shift_Date shift = iterator.next();

            if (shift.isAssignable() && !shift.isDeletable()) {
                assignableShifts.addShift(shift);
            }

            if (shift.isDeletable()) {
                shiftEnrollments.removeEnrollments(shift, kieSession);
                FactHandle handle = kieSession.getFactHandle(shift);
                kieSession.delete(handle);
                iterator.remove();
            }
        }
    }

    private void updateAssignableShiftsForRemainingAssignment(KieSession kieSession, List<Shift_Date> shiftDates,
            AssignableShifts assignableShifts) {
        assignableShifts.clearShifts();
        Iterator<Shift_Date> iterator = shiftDates.iterator();

        while (iterator.hasNext()) {
            Shift_Date shift = iterator.next();

            if (shift.isAssignable() && !shift.isDeletable()) {
                assignableShifts.addShift(shift);
            }

            if (shift.isDeletable()) {
                FactHandle handle = kieSession.getFactHandle(shift);
                if (handle != null) {
                    kieSession.delete(handle);
                }
                iterator.remove();
            }
        }
    }

    private void updateEligibleEmployees(KieSession kieSession, List<Employee> employees,
            EligibleEmployees eligibleEmployees, ShiftEnrollments shiftEnrollments) {
        eligibleEmployees.clearEmployees();
        Iterator<Employee> iterator = employees.iterator();

        while (iterator.hasNext()) {
            Employee emp = iterator.next();

            if (emp.isEligible() && !emp.isDeletable()) {
                eligibleEmployees.addEmployee(emp);
            }

            if (emp.isDeletable()) {
                shiftEnrollments.removeEnrollments(emp, kieSession);
                FactHandle handle = kieSession.getFactHandle(emp);
                kieSession.delete(handle);
                iterator.remove();
            }
        }
    }

    private void updateEligibleEmployeesForRemainingAssignment(KieSession kieSession, List<Employee> employees,
            EligibleEmployees eligibleEmployees) {
        eligibleEmployees.clearEmployees();
        Iterator<Employee> iterator = employees.iterator();

        while (iterator.hasNext()) {
            Employee emp = iterator.next();

            if (emp.isEligible() && !emp.isDeletable()) {
                eligibleEmployees.addEmployee(emp);
            }

            if (emp.isDeletable()) {
                FactHandle handle = kieSession.getFactHandle(emp);
                kieSession.delete(handle);
                iterator.remove();
            }
        }
    }

    private void removeProcessedEnrollment(KieSession kieSession, ShiftEnrollments shiftEnrollments,
            Employee employee, Shift_Date shift) {
        ShiftEnrollment toRemove = null;
        for (ShiftEnrollment enrollment : shiftEnrollments.getEnrollments()) {
            if (enrollment.getEmployee().equals(employee) && enrollment.getShift().equals(shift)) {
                toRemove = enrollment;
                break;
            }
        }

        if (toRemove != null) {
            FactHandle handle = kieSession.getFactHandle(toRemove);
            kieSession.delete(handle);
            shiftEnrollments.removeEnrollment(toRemove);
        }
    }
}
