package com.smashminton.rule_engine.services.impl;

import org.kie.api.KieServices;
import org.kie.api.builder.KieBuilder;
import org.kie.api.builder.KieFileSystem;
import org.kie.api.builder.KieRepository;
import org.kie.api.builder.ReleaseId;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.kie.api.runtime.rule.FactHandle;
import org.kie.api.io.Resource;
import org.kie.internal.builder.DecisionTableConfiguration;
import org.kie.internal.builder.DecisionTableInputType;
import org.kie.internal.builder.KnowledgeBuilderFactory;
import org.kie.internal.io.ResourceFactory;
import org.drools.decisiontable.*;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.smashminton.rule_engine.entities.Employee;
import com.smashminton.rule_engine.entities.ShiftDate;
import com.smashminton.rule_engine.entities.ShiftAssignment;
import com.smashminton.rule_engine.entities.ShiftEnrollment;
import com.smashminton.rule_engine.services.DroolsEvaluatorService;

import com.smashminton.rule_engine.entities.DroolsEmployee;
import com.smashminton.rule_engine.entities.DroolsShiftDate;
import com.smashminton.rule_engine.entities.DroolsShiftAssignment;
import com.smashminton.rule_engine.entities.DroolsShiftEnrollment;
import com.smashminton.rule_engine.entities.DroolsShiftEnrollments;
import com.smashminton.rule_engine.entities.DroolsShiftAssignments;
import com.smashminton.rule_engine.entities.DroolsSort;
import com.smashminton.rule_engine.entities.DroolsEligibleEmployees;
import com.smashminton.rule_engine.entities.DroolsAssignableShifts;
import com.smashminton.rule_engine.entities.DroolsAutoAssignmentContext;

import com.example.Sort.SortType;
import com.example.Sort.SortBy;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Iterator;

@Service
public class DroolsEvaluatorServiceImpl implements DroolsEvaluatorService {
    private static final Logger logger = LoggerFactory.getLogger(DroolsEvaluatorServiceImpl.class);
    
    // In các fact trong Working Memory của KieSession
    private static void printFacts(KieSession session) {
        System.out.println("=== FACTS IN SESSION ===");
        session.getObjects().forEach(obj -> {
            if (obj instanceof DroolsEmployee) {
                System.out.println("Employee: " + obj);
            } else if (obj instanceof DroolsShiftAssignment) {
                System.out.println("Assignment: " + obj);
            } else if (obj instanceof DroolsShiftDate) {
                System.out.println("Shift: " + obj);
            } else {
                System.out.println("Other: " + obj);
            }
        });
        System.out.println("======================");
    }

    // Hàm phân công 1 nhân viên cho 1 ca làm việc
    private static ShiftAssignment assignEmpToShift(KieSession kieSession, ShiftDate shiftDate, Employee employee) {
        // Cập nhật các thuộc tính của ca làm việc
        DroolsShiftDate droolsShiftDate = mapToInternalShiftDate(shiftDate);
        droolsShiftDate.setAssignedEmployees(droolsShiftDate.getAssignedEmployees() + 1);
        FactHandle factHandleShift = kieSession.getFactHandle(droolsShiftDate);
        kieSession.update(factHandleShift, droolsShiftDate);

        // Cập nhật các thuộc tính của nhân viên
        DroolsEmployee droolsEmployee = mapToInternalEmployee(employee);
        droolsEmployee.setAssignedShiftInWeek(droolsEmployee.getAssignedShiftInWeek() + 1);
        droolsEmployee.setAssignedShiftInMonth(droolsEmployee.getAssignedShiftInMonth() + 1);
        FactHandle factHandleEmployee = kieSession.getFactHandle(droolsEmployee);
        kieSession.update(factHandleEmployee, droolsEmployee);

        // Tạo phân công và thêm vào Working Memory
        ShiftAssignment shiftAssignment = new ShiftAssignment();
        shiftAssignment.setEmployeeId(employee.getEmployeeId());
        shiftAssignment.setShiftId(shiftDate.getShiftId());
        shiftAssignment.setShiftDate(shiftDate.getShiftDate());
        shiftAssignment.setAssignmentDate(LocalDateTime.now());
        shiftAssignment.setEmployee(employee);
        shiftAssignment.setShiftDateEntity(shiftDate);
        
        kieSession.insert(shiftAssignment);
        System.out.println("Created ShiftAssignment: " + 
                shiftAssignment.getEmployeeId() + " -> " + 
                shiftAssignment.getShiftId() + " on " + 
                shiftAssignment.getShiftDate());
        return shiftAssignment;
    }
    
    @Override
    public List<ShiftAssignment> autoAssignShifts(List<Employee> employees, List<ShiftDate> shiftDates, 
                                                List<ShiftEnrollment> shiftEnrollments) {
        KieServices kieServices = null;
        KieContainer kieContainer = null;
        KieSession kieSession = null;
        List<ShiftAssignment> resultAssignments = new ArrayList<>();

        try {
            // Khởi tạo stateful KieSession thông qua KieContainer
            kieServices = KieServices.Factory.get();
            
            // Định nghĩa file Excel (.xlsx) được sử dụng làm decision table
            Resource dt = ResourceFactory.newClassPathResource("/dtables/drools_decisiontable.drl.xlsx",
                    DroolsEvaluatorServiceImpl.class);
            KieFileSystem kieFileSystem = kieServices.newKieFileSystem().write(dt);
            
            KieBuilder kieBuilder = kieServices.newKieBuilder(kieFileSystem);
            kieBuilder.buildAll();
            
            // Create KieContainer using the KieModule from KieBuilder
            kieContainer = kieServices.newKieContainer(kieBuilder.getKieModule().getReleaseId());
            kieSession = kieContainer.newKieSession();
            System.out.println("Create KieSession successfully");

            // Chuyển đổi JPA entities sang Drools facts
            List<DroolsEmployee> droolsEmployees = new ArrayList<>();
            for (Employee employee : employees) {
                DroolsEmployee droolsEmployee = mapToInternalEmployee(employee);
                droolsEmployees.add(droolsEmployee);
                kieSession.insert(droolsEmployee);
            }

            // Chuyển đổi và thêm ShiftDate vào Working Memory
            List<DroolsShiftDate> droolsShiftDates = new ArrayList<>();
            for (ShiftDate shiftDate : shiftDates) {
                DroolsShiftDate droolsShiftDate = mapToInternalShiftDate(shiftDate);
                droolsShiftDates.add(droolsShiftDate);
                kieSession.insert(droolsShiftDate);
            }

            // Tạo fact Sort và thêm vào Working Memory
            DroolsSort sortEmployee1 = new DroolsSort();
            sortEmployee1.setSortEnabled(true);
            sortEmployee1.setSortType(SortType.ASCENDING);
            sortEmployee1.setSortBy(SortBy.ASSIGNEDSHIFTINWEEK);
            kieSession.insert(sortEmployee1);

            // Tạo và chuyển đổi ShiftEnrollment thành DroolsShiftEnrollment
            DroolsShiftEnrollments enrollmentsContainer = new DroolsShiftEnrollments();
            Map<Integer, DroolsEmployee> employeeMap = new HashMap<>();
            Map<Integer, DroolsShiftDate> shiftDateMap = new HashMap<>();
            
            // Lập map để truy cập nhanh
            for (DroolsEmployee emp : droolsEmployees) {
                employeeMap.put(emp.getEmployeeId(), emp);
            }
            
            for (DroolsShiftDate shiftDate : droolsShiftDates) {
                shiftDateMap.put(shiftDate.getShiftId(), shiftDate);
            }
            
            for (ShiftEnrollment enrollment : shiftEnrollments) {
                Integer employeeId = enrollment.getEmployeeId();
                Integer shiftId = enrollment.getShiftId();
                
                DroolsEmployee droolsEmployee = employeeMap.get(employeeId);
                DroolsShiftDate droolsShiftDate = shiftDateMap.get(shiftId);
                
                if (droolsEmployee != null && droolsShiftDate != null) {
                    DroolsShiftEnrollment droolsEnrollment = new DroolsShiftEnrollment(droolsEmployee, droolsShiftDate);
                    enrollmentsContainer.addEnrollment(droolsEnrollment);
                    kieSession.insert(droolsEnrollment);
                }
            }
            kieSession.insert(enrollmentsContainer);

            // Tạo các container objects
            DroolsEligibleEmployees eligibleEmployees = new DroolsEligibleEmployees();
            DroolsAssignableShifts assignableShifts = new DroolsAssignableShifts();
            DroolsShiftAssignments shiftAssignments = new DroolsShiftAssignments();
            DroolsAutoAssignmentContext autoAssignmentContext = new DroolsAutoAssignmentContext();

            kieSession.insert(autoAssignmentContext);
            kieSession.insert(eligibleEmployees);
            kieSession.insert(assignableShifts);
            kieSession.insert(shiftAssignments);

            // Bước 1: Phân công các ca làm việc được đăng ký cho nhân viên đăng ký ca
            while (enrollmentsContainer.getSize() > 0) {
                // Thực hiện các lệnh thuộc nhóm "EnrollmentShiftRule"
                kieSession.getAgenda().getAgendaGroup("EnrollmentShiftRule").setFocus();
                kieSession.fireAllRules();

                // Lấy danh sách các ca làm việc có thể phân công sau khi kiểm tra điều kiện
                assignableShifts.clearShifts();
                Iterator<DroolsShiftDate> shiftIterator = droolsShiftDates.iterator();
                while (shiftIterator.hasNext()) {
                    DroolsShiftDate shift = shiftIterator.next();

                    if (shift.isAssignable() && !shift.isDeletable()) {
                        assignableShifts.addShift(shift);
                    }

                    // Trường hợp ca làm không còn có thể phân công được nữa
                    if (shift.isDeletable()) {
                        enrollmentsContainer.removeEnrollments(shift);
                        FactHandle factHandleShift = kieSession.getFactHandle(shift);
                        kieSession.delete(factHandleShift);
                        shiftIterator.remove();
                    }
                }

                if (assignableShifts.getSize() <= 0 || enrollmentsContainer.getSize() <= 0) {
                    break;
                }

                // Chọn 1 ca làm việc để thực hiện lọc danh sách nhân viên có thể được phân công
                autoAssignmentContext.setCurrentShift(assignableShifts.getShifts().get(0));
                FactHandle factHandleContext = kieSession.getFactHandle(autoAssignmentContext);
                kieSession.update(factHandleContext, autoAssignmentContext);
                System.out.println("Context shift: " + autoAssignmentContext.getCurrentShift());

                // Thực hiện các lệnh thuộc nhóm "EnrollmentEmployeeRule"
                kieSession.getAgenda().getAgendaGroup("EnrollmentEmployeeRule").setFocus();
                kieSession.fireAllRules();

                // Lấy danh sách các nhân viên có thể phân công cho ca làm việc được chọn
                eligibleEmployees.clearEmployees();
                Iterator<DroolsEmployee> empIterator = droolsEmployees.iterator();
                while (empIterator.hasNext()) {
                    DroolsEmployee emp = empIterator.next();

                    if (emp.isEligible() && !emp.isDeletable()) {
                        eligibleEmployees.addEmployee(emp);
                    }

                    // Trường hợp nhân viên không còn có thể phân công được nữa
                    if (emp.isDeletable()) {
                        enrollmentsContainer.removeEnrollments(emp);
                        FactHandle factHandleEmployee = kieSession.getFactHandle(emp);
                        kieSession.delete(factHandleEmployee);
                        empIterator.remove();
                    }
                }

                if (eligibleEmployees.getSize() <= 0 || enrollmentsContainer.getSize() <= 0) {
                    break;
                }

                // Cập nhật fact chứa danh sách nhân viên có thể phân công
                FactHandle factHandleEligibleEmployees = kieSession.getFactHandle(eligibleEmployees);
                if (factHandleEligibleEmployees != null) {
                    System.out.println("EligibleEmployees fact handle is not null, updating");
                    kieSession.update(factHandleEligibleEmployees, eligibleEmployees);
                }

                // Thực hiện các lệnh thuộc nhóm "EmployeeSortingRule"
                kieSession.getAgenda().getAgendaGroup("EmployeeSortingRule").setFocus();
                kieSession.fireAllRules();

                if (eligibleEmployees.getSize() <= 0) {
                    break;
                }

                // Chọn 1 nhân viên đầu tiên trong danh sách để phân công cho ca làm việc
                DroolsShiftDate chosenShift = autoAssignmentContext.getCurrentShift();
                DroolsEmployee chosenEmployee = eligibleEmployees.getEmployees().get(0);

                // Tạo phân công và thêm vào danh sách
                DroolsShiftAssignment assignment = new DroolsShiftAssignment(chosenEmployee, chosenShift);
                shiftAssignments.addAssignment(assignment);
                kieSession.insert(assignment);

                // Xóa đăng ký đã được xử lý
                enrollmentsContainer.removeEnrollment(chosenEmployee, chosenShift);
            }

            // Bước 2: Phân công các ca làm việc còn lại cho các nhân viên có tham gia đăng ký ca làm
            do {
                // Thực hiện các lệnh thuộc nhóm "ShiftRule"
                kieSession.getAgenda().getAgendaGroup("ShiftRule").setFocus();
                kieSession.fireAllRules();

                // Lấy danh sách các ca làm việc có thể phân công sau khi kiểm tra điều kiện
                assignableShifts.clearShifts();
                Iterator<DroolsShiftDate> shiftIterator = droolsShiftDates.iterator();
                while (shiftIterator.hasNext()) {
                    DroolsShiftDate shift = shiftIterator.next();
                    if (shift.isAssignable() && !shift.isDeletable()) {
                        assignableShifts.addShift(shift);
                    }
                    // Trường hợp ca làm không còn có thể phân công được nữa
                    if (shift.isDeletable()) {
                        enrollmentsContainer.removeEnrollments(shift);
                        FactHandle factHandleShift = kieSession.getFactHandle(shift);
                        kieSession.delete(factHandleShift);
                        shiftIterator.remove();
                    }
                }

                if (assignableShifts.getSize() <= 0) {
                    break;
                }

                // Chọn 1 ca làm việc để thực hiện lọc danh sách nhân viên có thể được phân công
                autoAssignmentContext.setCurrentShift(assignableShifts.getShifts().get(0));
                FactHandle factHandleContext = kieSession.getFactHandle(autoAssignmentContext);
                kieSession.update(factHandleContext, autoAssignmentContext);
                System.out.println("Context shift: " + autoAssignmentContext.getCurrentShift());

                // Thực hiện các lệnh thuộc nhóm "EmployeeRule"
                kieSession.getAgenda().getAgendaGroup("EmployeeRule").setFocus();
                kieSession.fireAllRules();

                // Lấy danh sách các nhân viên có thể phân công cho ca làm việc được chọn
                eligibleEmployees.clearEmployees();
                Iterator<DroolsEmployee> empIterator = droolsEmployees.iterator();
                while (empIterator.hasNext()) {
                    DroolsEmployee emp = empIterator.next();
                    if (emp.isEligible() && !emp.isDeletable()) {
                        eligibleEmployees.addEmployee(emp);
                    }
                    // Trường hợp nhân viên không còn có thể phân công được nữa
                    if (emp.isDeletable()) {
                        enrollmentsContainer.removeEnrollments(emp);
                        FactHandle factHandleEmployee = kieSession.getFactHandle(emp);
                        kieSession.delete(factHandleEmployee);
                        empIterator.remove();
                    }
                }

                if (eligibleEmployees.getSize() <= 0) {
                    break;
                }

                // Cập nhật fact chứa danh sách nhân viên có thể phân công
                FactHandle factHandleEligibleEmployees = kieSession.getFactHandle(eligibleEmployees);
                if (factHandleEligibleEmployees != null) {
                    System.out.println("EligibleEmployees fact handle is not null, updating");
                    kieSession.update(factHandleEligibleEmployees, eligibleEmployees);
                }

                // Thực hiện các lệnh thuộc nhóm "EmployeeSortingRule"
                kieSession.getAgenda().getAgendaGroup("EmployeeSortingRule").setFocus();
                kieSession.fireAllRules();

                if (eligibleEmployees.getSize() <= 0) {
                    break;
                }

                // Chọn 1 nhân viên đầu tiên trong danh sách để phân công cho ca làm việc
                DroolsShiftAssignment assignment = new DroolsShiftAssignment(
                    eligibleEmployees.getEmployees().get(0),
                    autoAssignmentContext.getCurrentShift()
                );
                shiftAssignments.addAssignment(assignment);
                kieSession.insert(assignment);

            } while (true);

            // Lấy kết quả phân công
            System.out.println("Getting assignment results: " + shiftAssignments.getAssignments().size());
            for (DroolsShiftAssignment assignment : shiftAssignments.getAssignments()) {
                resultAssignments.add(mapFromInternalShiftAssignment(assignment));
            }

        } catch (Exception e) {
            System.err.println("Error during Drools evaluation: " + e.getMessage());
            e.printStackTrace();
        } finally {
            // Dọn tài nguyên, tránh memory leak
            System.out.println("Cleaning up resources...");

            if (kieSession != null) {
                try {
                    kieSession.dispose();
                } catch (Exception e) {
                    System.err.println("Error disposing KieSession: " + e.getMessage());
                }
            }

            if (kieContainer != null) {
                try {
                    kieContainer.dispose();
                } catch (Exception e) {
                    System.err.println("Error disposing KieContainer: " + e.getMessage());
                }
            }
        }
        
        return resultAssignments;
    }
    
    
    // Phương thức chuyển đổi từ entity sang internal model
    private static DroolsEmployee mapToInternalEmployee(Employee employee) {
        if (employee == null) return null;
        DroolsEmployee internalEmployee = new DroolsEmployee(employee.getEmployeeId());
        return internalEmployee;
    }
    
    private static DroolsShiftDate mapToInternalShiftDate(ShiftDate shiftDate) {
        if (shiftDate == null) return null;
        DroolsShiftDate internalShiftDate = new DroolsShiftDate(shiftDate.getShiftId());
        internalShiftDate.setShiftDate(shiftDate.getShiftDate().toLocalDate());
        return internalShiftDate;
    }
    
    // Phương thức chuyển đổi từ internal model sang entity
    private ShiftAssignment mapFromInternalShiftAssignment(DroolsShiftAssignment internalAssignment) {
        ShiftAssignment assignment = new ShiftAssignment();
        assignment.setEmployeeId(internalAssignment.getEmployee().getEmployeeId());
        assignment.setShiftId(internalAssignment.getShift().getShiftId());
        assignment.setShiftDate(LocalDateTime.of(internalAssignment.getShift().getShiftDate(), 
                                               java.time.LocalTime.MIDNIGHT));
        assignment.setAssignmentDate(LocalDateTime.now());
        return assignment;
    }
} 