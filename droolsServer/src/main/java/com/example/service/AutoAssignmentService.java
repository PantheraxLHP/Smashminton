package com.example.service;

import com.example.dto.AutoAssignmentRequest;
import com.example.dto.AutoAssignmentResponse;
import com.example.model.*;
import com.example.repository.*;
import com.example.util.Sort;
import org.kie.api.runtime.KieSession;
import org.kie.api.runtime.rule.FactHandle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.ArrayList;

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
    private PenaltyRecordRepository penaltyRecordRepository;

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
            LocalDateTime nextWeekEndDateTime = nextWeekEnd;

            // Load part-time employees and initialize their assignedShiftInDay for next  week
            List<Employee> employees = loadAndInitializePartTimeEmployees(nextWeekStartDateTime, nextWeekEndDateTime);
            if (employees.isEmpty()) {
                return new AutoAssignmentResponse(false, "No available part-time employees found in database");
            }

            // Load shift dates for next week with shiftId > 2
            List<Shift_Date> shiftDates = shiftDateRepository.findByShiftIdGreaterThan2AndShiftDateBetween(
                    nextWeekStartDateTime, nextWeekEndDateTime);

            if (shiftDates.isEmpty()) {
                return new AutoAssignmentResponse(false, "No shifts found for next week with shiftId > 2");
            }

            // Initialize assigned employee counts for each shift
            initializeShiftAssignedEmployees(shiftDates);

            // Load existing shift assignments for next week from database
            List<ShiftAssignment> existingAssignments = shiftAssignmentRepository.findByShiftDateBetween(
                    nextWeekStartDateTime, nextWeekEndDateTime);

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
                    employees, shiftDates, shiftEnrollments, existingAssignments, sort);

            // Save assignments to database
            if (!assignments.isEmpty()) {
                shiftAssignmentRepository.saveAll(assignments);
            } // Build response
            response.setSuccess(true);
            response.setAssignments(assignments);
            response.setSortOptionUsed(request.getSortOption());
            response.setMessage(String.format(
                    "Successfully created %d assignments for next week (%s to %s)",
                    assignments.size(), nextWeekStart.toLocalDate(), nextWeekEnd.toLocalDate()));

            return response;

        } catch (Exception e) {
            return new AutoAssignmentResponse(false,
                    "Error during auto-assignment: " + e.getClass().getSimpleName() + " - " + e.getMessage());
        }
    }

    private List<Employee> loadAndInitializePartTimeEmployees(LocalDateTime startDate, LocalDateTime endDate) {
        List<Employee> employees = new ArrayList<>();

        List<Integer> employeesId = employeeRepository.findAvailablePartTimeEmployeesId(startDate, endDate);
        if (employeesId.isEmpty()) {
            return employees;
        }

        for (Integer employeeId : employeesId) {
            Employee employee = employeeRepository.findEmployeeById(employeeId);
            if (employee != null) {
                employees.add(employee);
            }
        }

        // Get current month and year for penalty calculation
        LocalDate now = LocalDate.now();
        int currentYear = now.getYear();
        int currentMonth = now.getMonthValue();

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

            // Calculate and set priority score based on penalty records for current month
            try {
                long lateCount = penaltyRecordRepository.countByEmployeeIdAndPenaltyTypeAndCurrentMonth(
                        employee.getEmployeeId(), "late", currentYear, currentMonth);
                long absenceCount = penaltyRecordRepository.countByEmployeeIdAndPenaltyTypeAndCurrentMonth(
                        employee.getEmployeeId(), "absence", currentYear, currentMonth);

                // Calculate priority score: 100 - (lateCount + absenceCount * 3)
                int penaltyDeduction = (int) (lateCount + absenceCount * 3);
                int priorityScore = Math.max(0, 100 - penaltyDeduction);
                employee.setPriorityScore(priorityScore);

            } catch (Exception e) {
                // If penalty calculation fails, set default priority score
                employee.setPriorityScore(100);
                System.err.println("Failed to calculate penalty score for employee " +
                        employee.getEmployeeId() + ": " + e.getMessage());
            }
        }

        return employees;
    }

    private void initializeShiftAssignedEmployees(List<Shift_Date> shiftDates) {
        for (Shift_Date shiftDate : shiftDates) {
            // Count current assignments for this specific shift and date
            int currentAssignments = shiftAssignmentRepository.countByShiftIdAndShiftDate(
                    shiftDate.getShiftId(), shiftDate.getShiftDate());

            // Set the assigned employees count - Drools will use this information
            shiftDate.setAssignedEmployees(currentAssignments);
        }
    }

    private Sort createSortFromOption(int sortOption) {
        Sort sort = new Sort();

        switch (sortOption) {
            case 1: // Priority Descending
                sort.setSortEnabled(true);
                sort.setSortBy(Sort.SortBy.PRIORITY);
                sort.setSortType(Sort.SortType.DESCENDING);
                break;
            case 2: // Assigned Shifts Ascending
                sort.setSortEnabled(true);
                sort.setSortBy(Sort.SortBy.ASSIGNEDSHIFTINWEEK);
                sort.setSortType(Sort.SortType.ASCENDING);
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
            List<ShiftAssignment> existingAssignments,
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

            // Insert existing assignments into KieSession
            for (ShiftAssignment existingAssignment : existingAssignments) {
                kieSession.insert(existingAssignment);
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
            kieSession.insert(sort);

            // Execute assignment logic similar to DroolsEvaluator
            System.out.println("Starting enrollment based assignment process...");
            executeEnrollmentBasedAssignment(kieSession, employees, shiftDates,
                    shiftEnrollments, eligibleEmployees, assignableShifts,
                    shiftAssignments, autoAssignmentContext);

            System.out.println("Starting remaining shift assignment process...");
            // Execute remaining shift assignment
            executeRemainingShiftAssignment(kieSession, employees, shiftDates,
                    eligibleEmployees, assignableShifts, shiftAssignments, autoAssignmentContext);

            // Safely copy assignments to avoid concurrent modification
            synchronized (shiftAssignments) {
                assignments.addAll(new ArrayList<>(shiftAssignments.getAssignments()));
            }

        } finally {
            // Clear all facts from KieSession safely
            try {
                // Get all fact handles first, then delete them
                List<FactHandle> factHandles = new ArrayList<>(kieSession.getFactHandles());
                for (FactHandle factHandle : factHandles) {
                    if (factHandle != null) {
                        kieSession.delete(factHandle);
                    }
                }
            } catch (Exception e) {
                System.err.println("Warning: Error clearing KieSession facts: " + e.getMessage());
                // Continue execution even if cleanup fails
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

            if (assignableShifts.getSize() <= 0) {
                System.out.println("Breaking from enrollment loop - no assignable shifts");
                break;
            }

            int iter = 0;
            do {
                // Set current shift context
                synchronized (assignableShifts) {
                    autoAssignmentContext.setCurrentShift(assignableShifts.getShifts().get(iter));
                }
                FactHandle contextHandle = kieSession.getFactHandle(autoAssignmentContext);
                kieSession.update(contextHandle, autoAssignmentContext);

                // Execute EmployeeRule
                kieSession.getAgenda().getAgendaGroup("EnrollmentEmployeeRule").setFocus();
                kieSession.fireAllRules();

                // Update eligible employees
                updateEligibleEmployees(kieSession, employees, eligibleEmployees, shiftEnrollments);

                if (eligibleEmployees.getSize() > 0) {
                    System.out.println(
                            "Found at least one assignable enrollment shift with eligible employees to be assigned"
                                    + " at " + autoAssignmentContext.getCurrentShift());
                    break;
                }

                iter++;
            } while (iter < assignableShifts.getSize());

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
            kieSession.fireAllRules(); // Make assignment
            if (eligibleEmployees.getSize() > 0) {
                Shift_Date chosenShift = autoAssignmentContext.getCurrentShift();
                Employee chosenEmployee = null;
                synchronized (eligibleEmployees) {
                    if (eligibleEmployees.getEmployees().size() > 0) {
                        chosenEmployee = eligibleEmployees.getEmployees().get(0);
                    }
                }

                if (chosenEmployee != null) {
                    ShiftAssignment assignment = assignEmployeeToShift(kieSession, chosenShift, chosenEmployee, "approved");
                    shiftAssignments.addAssignment(assignment);

                    // Remove processed enrollment
                    removeProcessedEnrollment(kieSession, shiftEnrollments, chosenEmployee, chosenShift);
                }
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

            // Execute ShiftRule
            kieSession.getAgenda().getAgendaGroup("ShiftRule").setFocus();
            kieSession.fireAllRules();

            // Update assignable shifts
            updateAssignableShiftsForRemainingAssignment(kieSession, shiftDates, assignableShifts);

            if (assignableShifts.getSize() <= 0) {
                System.out.println("Breaking from remaining assignment - no assignable shifts");
                break;
            }

            int iter = 0;
            do {
                // Set current shift context
                synchronized (assignableShifts) {
                    autoAssignmentContext.setCurrentShift(assignableShifts.getShifts().get(iter));
                }
                FactHandle contextHandle = kieSession.getFactHandle(autoAssignmentContext);
                kieSession.update(contextHandle, autoAssignmentContext);

                // Execute EmployeeRule
                kieSession.getAgenda().getAgendaGroup("EmployeeRule").setFocus();
                kieSession.fireAllRules();

                // Update eligible employees
                updateEligibleEmployeesForRemainingAssignment(kieSession, employees, eligibleEmployees);

                if (eligibleEmployees.getSize() > 0) {
                    System.out.println(
                            "Found at least one assignable remaining shift with eligible employees to be assigned"
                                    + " at " + autoAssignmentContext.getCurrentShift());
                    break;
                }

                iter++;
            } while (iter < assignableShifts.getSize());

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
            if (eligibleEmployees.getSize() > 0) {
                Shift_Date chosenShift = autoAssignmentContext.getCurrentShift();
                Employee chosenEmployee = null;
                synchronized (eligibleEmployees) {
                    if (eligibleEmployees.getEmployees().size() > 0) {
                        chosenEmployee = eligibleEmployees.getEmployees().get(0);
                    }
                }

                if (chosenEmployee != null) {
                    ShiftAssignment assignment = assignEmployeeToShift(kieSession, chosenShift, chosenEmployee, "pending");
                    shiftAssignments.addAssignment(assignment);
                }
            }

        } while (true);
    }

    private ShiftAssignment assignEmployeeToShift(KieSession kieSession, Shift_Date shift, Employee employee, String assignmentStatus) {
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
        ShiftAssignment assignment = new ShiftAssignment(employee, shift, assignmentStatus);
        kieSession.insert(assignment);

        return assignment;
    }

    private synchronized void updateAssignableShifts(KieSession kieSession, List<Shift_Date> shiftDates,
            AssignableShifts assignableShifts, ShiftEnrollments shiftEnrollments) {
        assignableShifts.clearShifts();

        // Create a copy to avoid ConcurrentModificationException
        List<Shift_Date> shiftsToRemove = new ArrayList<>();

        // Use a defensive copy and synchronize access
        List<Shift_Date> shiftDatesCopy = new ArrayList<>(shiftDates);
        for (Shift_Date shift : shiftDatesCopy) {
            if (shift.isAssignable() && !shift.isDeletable()) {
                assignableShifts.addShift(shift);
            }

            if (shift.isDeletable()) {
                shiftEnrollments.removeEnrollments(shift, kieSession);
                FactHandle handle = kieSession.getFactHandle(shift);
                if (handle != null) {
                    kieSession.delete(handle);
                }
                shiftsToRemove.add(shift);
            }
        }

        // Remove deletable shifts from original list after iteration
        synchronized (shiftDates) {
            shiftDates.removeAll(shiftsToRemove);
        }
    }

    private synchronized void updateAssignableShiftsForRemainingAssignment(KieSession kieSession,
            List<Shift_Date> shiftDates,
            AssignableShifts assignableShifts) {
        assignableShifts.clearShifts();

        // Create a copy to avoid ConcurrentModificationException
        List<Shift_Date> shiftsToRemove = new ArrayList<>();

        // Use a defensive copy and synchronize access
        List<Shift_Date> shiftDatesCopy = new ArrayList<>(shiftDates);
        for (Shift_Date shift : shiftDatesCopy) {
            if (shift.isAssignable() && !shift.isDeletable()) {
                assignableShifts.addShift(shift);
            }

            if (shift.isDeletable()) {
                FactHandle handle = kieSession.getFactHandle(shift);
                if (handle != null) {
                    kieSession.delete(handle);
                }
                shiftsToRemove.add(shift);
            }
        }

        // Remove deletable shifts from original list after iteration
        synchronized (shiftDates) {
            shiftDates.removeAll(shiftsToRemove);
        }
    }

    private synchronized void updateEligibleEmployees(KieSession kieSession, List<Employee> employees,
            EligibleEmployees eligibleEmployees, ShiftEnrollments shiftEnrollments) {
        eligibleEmployees.clearEmployees();

        // Create a copy to avoid ConcurrentModificationException
        List<Employee> employeesToRemove = new ArrayList<>();

        // Use a defensive copy and synchronize access
        List<Employee> employeesCopy = new ArrayList<>(employees);
        for (Employee emp : employeesCopy) {
            if (emp.isEligible() && !emp.isDeletable()) {
                eligibleEmployees.addEmployee(emp);
            }

            if (emp.isDeletable()) {
                shiftEnrollments.removeEnrollments(emp, kieSession);
                FactHandle handle = kieSession.getFactHandle(emp);
                if (handle != null) {
                    kieSession.delete(handle);
                }
                employeesToRemove.add(emp);
            }
        }

        // Remove deletable employees from original list after iteration
        synchronized (employees) {
            employees.removeAll(employeesToRemove);
        }
    }

    private synchronized void updateEligibleEmployeesForRemainingAssignment(KieSession kieSession,
            List<Employee> employees,
            EligibleEmployees eligibleEmployees) {
        eligibleEmployees.clearEmployees();

        // Create a copy to avoid ConcurrentModificationException
        List<Employee> employeesToRemove = new ArrayList<>();

        // Use a defensive copy and synchronize access
        List<Employee> employeesCopy = new ArrayList<>(employees);
        for (Employee emp : employeesCopy) {
            if (emp.isEligible() && !emp.isDeletable()) {
                eligibleEmployees.addEmployee(emp);
            }

            if (emp.isDeletable()) {
                FactHandle handle = kieSession.getFactHandle(emp);
                if (handle != null) {
                    kieSession.delete(handle);
                }
                employeesToRemove.add(emp);
            }
        }

        // Remove deletable employees from original list after iteration
        synchronized (employees) {
            employees.removeAll(employeesToRemove);
        }
    }

    private synchronized void removeProcessedEnrollment(KieSession kieSession, ShiftEnrollments shiftEnrollments,
            Employee employee, Shift_Date shift) {
        ShiftEnrollment toRemove = null;

        // Use defensive copy to avoid concurrent modification
        List<ShiftEnrollment> enrollmentsCopy = new ArrayList<>(shiftEnrollments.getEnrollments());
        for (ShiftEnrollment enrollment : enrollmentsCopy) {
            if (enrollment.getEmployee().equals(employee) && enrollment.getShift().equals(shift)) {
                toRemove = enrollment;
                break;
            }
        }

        if (toRemove != null) {
            FactHandle handle = kieSession.getFactHandle(toRemove);
            if (handle != null) {
                kieSession.delete(handle);
            }
            shiftEnrollments.removeEnrollment(toRemove);
        }
    }
}
