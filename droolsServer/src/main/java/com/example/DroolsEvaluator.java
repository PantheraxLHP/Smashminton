// package com.example;

// import org.kie.api.KieServices;
// import org.kie.api.builder.KieBuilder;
// import org.kie.api.builder.KieFileSystem;
// import org.kie.api.builder.KieRepository;
// import org.kie.api.builder.ReleaseId;
// import org.kie.api.runtime.KieContainer;
// import org.kie.api.runtime.KieSession;
// import org.kie.api.runtime.rule.FactHandle;
// import org.kie.api.io.Resource;
// import org.kie.internal.builder.DecisionTableConfiguration;
// import org.kie.internal.builder.DecisionTableInputType;
// import org.kie.internal.builder.KnowledgeBuilderFactory;
// import org.kie.internal.io.ResourceFactory;
// import org.drools.decisiontable.*;
// import java.time.LocalDate;
// import java.util.List;
// import java.util.ArrayList;
// import java.util.Iterator;
// import java.sql.Connection;
// import java.sql.ResultSet;
// import java.sql.SQLException;
// import java.sql.Statement;
// import com.example.model.*;

// public class DroolsEvaluator {
//     // * In các fact trong Working Memory của KieSession
//     private static void printFacts(KieSession session) {
//         System.out.println("=== FACTS IN SESSION ===");
//         session.getObjects().forEach(obj -> {
//             if (obj instanceof Employee) {
//                 System.out.println("Employee: " + obj);
//             } else if (obj instanceof ShiftAssignment) {
//                 System.out.println("Assignment: " + obj);
//             } else if (obj instanceof Shift_Date) {
//                 System.out.println("Shift: " + obj);
//             } else {
//                 System.out.println("Other: " + obj);
//             }
//         });
//         System.out.println("======================");
//     }

//     // * Hàm phân công 1 nhân viên cho 1 ca làm việc
//     private static ShiftAssignment assignEmpToShift(KieSession kieSession, Shift_Date shift, Employee employee) {
//         // * Cập nhật các thuộc tính của ca làm việc
//         shift.setAssignedEmployees(shift.getAssignedEmployees() + 1);
//         FactHandle factHandleShift = kieSession.getFactHandle(shift);
//         kieSession.update(factHandleShift, shift);

//         // * Cập nhật các thuộc tính của nhân viên
//         employee.setAssignedShiftInDay(shift.getShiftDate(),
//                 employee.getAssignedShiftInDay(shift.getShiftDate()) + 1);
//         employee.setAssingedShiftInWeek(employee.getAssignedShiftInWeek() + 1);
//         FactHandle factHandleEmployee = kieSession.getFactHandle(employee);
//         kieSession.update(factHandleEmployee, employee);

//         // * Tạo phân công và thêm vào Working Memory
//         ShiftAssignment shiftAssignment = new ShiftAssignment(employee, shift);
//         kieSession.insert(shiftAssignment);
//         System.out.println("Created ShiftAssignment: " +
//                 shiftAssignment.getEmployee().getEmployeeId() + " -> "
//                 + shiftAssignment.getShift().getShiftId() + " on " +
//                 shiftAssignment.getShift().getShiftDate());
//         return shiftAssignment;
//     }

//     public static void main(String[] args) {
//         KieServices kieServices = null;
//         KieContainer kieContainer = null;
//         KieSession kieSession = null;

//         try {
//             // * Khởi tạo stateful KieSession thông qua KieContainer
//             kieServices = KieServices.Factory.get();
//             // * Định nghĩa file Excel (.xlsx) được sử dụng làm decision table
//             Resource dt = ResourceFactory.newClassPathResource("dtables/drools_decisiontable.drl.xlsx",
//                     DroolsEvaluator.class);
//             KieFileSystem kieFileSystem = kieServices.newKieFileSystem().write(dt);
//             KieBuilder kieBuilder = kieServices.newKieBuilder(kieFileSystem);
//             kieBuilder.buildAll();
//             KieRepository kieRepository = kieServices.getRepository();
//             ReleaseId krDefaultReleaseId = kieRepository.getDefaultReleaseId();
//             kieContainer = kieServices.newKieContainer(krDefaultReleaseId);
//             kieSession = kieContainer.newKieSession();
//             System.out.println("Create KieSession successfully");

//             // * Chuyển input Rule từ dạng Excel spreadsheet decision table sang DRL
//             DecisionTableProviderImpl decisionTableProvider = new DecisionTableProviderImpl();
//             DecisionTableConfiguration dtConfig = KnowledgeBuilderFactory.newDecisionTableConfiguration();
//             dtConfig.setInputType(DecisionTableInputType.XLSX);
//             String drl = decisionTableProvider.loadFromResource(dt, dtConfig);
//             System.out.println("Generated DRL: \n" + drl);

//             List<Employee> employees = new ArrayList<Employee>();
//             // * Tạo fact Employee và thêm vào Working Memory
//             for (int i = 0; i < 10000; i++) {
//                 Employee employee = new Employee(i + 1);
//                 employees.add(employee);
//                 kieSession.insert(employee);
//             }

//             // * Tạo fact Shift_Date và thêm vào Working Memory
//             List<Shift_Date> shiftDates = new ArrayList<Shift_Date>();
//             int currentDayOfWeek = LocalDate.now().getDayOfWeek().getValue();
//             LocalDate nextWeekStart = LocalDate.now().plusDays(7 - currentDayOfWeek + 1);
//             for (int i = 3; i <= 6; i++) {
//                 for (int j = 0; j < 7; j++) {
//                     Shift_Date shiftDate = new Shift_Date(i);
//                     shiftDate.setShiftDate(nextWeekStart.plusDays(j));
//                     shiftDates.add(shiftDate);
//                     kieSession.insert(shiftDate);
//                 }
//             }

//             // * Tạo fact Sort và thêm vào Working Memory
//             Sort sortEmployee1 = new Sort();
//             sortEmployee1.setSortEnabled(true);
//             sortEmployee1.setSortType(Sort.SortType.ASCENDING);
//             sortEmployee1.setSortBy(Sort.SortBy.ASSIGNEDSHIFTINWEEK);

//             Sort sortEmployee2 = new Sort();
//             sortEmployee2.setSortEnabled(true);
//             sortEmployee2.setSortType(Sort.SortType.DESCENDING);
//             sortEmployee2.setSortBy(Sort.SortBy.PRIORITY);

//             Sort sortEmployee3 = new Sort();
//             sortEmployee3.setSortEnabled(false);

//             // * Tạo fact ShiftEnrollment và thêm vào Working Memory
//             ShiftEnrollments shiftEnrollments = new ShiftEnrollments();
//             for (Employee employee : employees) {
//                 int randomIndex = (int) (Math.random() * shiftDates.size());
//                 ShiftEnrollment shiftEnrollment = new ShiftEnrollment(employee, shiftDates.get(randomIndex));
//                 shiftEnrollments.addEnrollment(shiftEnrollment);
//                 kieSession.insert(shiftEnrollment);
//             }

//             EligibleEmployees eligibleEmployees = new EligibleEmployees();
//             AssignableShifts assignableShifts = new AssignableShifts();
//             ShiftAssignments shiftAssignments = new ShiftAssignments();
//             AutoAssignmentContext autoAssignmentContext = new AutoAssignmentContext();

//             kieSession.insert(autoAssignmentContext);
//             kieSession.insert(eligibleEmployees);
//             kieSession.insert(sortEmployee1);
//             // kieSession.insert(sortEmployee2);
//             // kieSession.insert(sortEmployee3);

//             // * Bước 1: Phân công các ca làm việc được đăng ký cho nhân viên đăng ký ca
//             // * làm tương ứng
//             while (shiftEnrollments.getSize() > 0) {
//                 // * Thực hiện các lệnh thuộc nhóm "EnrollmentShiftRule"
//                 kieSession.getAgenda().getAgendaGroup("EnrollmentShiftRule").setFocus();
//                 kieSession.fireAllRules();

//                 // * Lấy danh sách các ca làm việc có thể phân công sau khi kiểm tra điều kiện
//                 assignableShifts.clearShifts();
//                 Iterator<Shift_Date> shiftIterator = shiftDates.iterator();
//                 while (shiftIterator.hasNext()) {
//                     Shift_Date shift = shiftIterator.next();

//                     if (shift.isAssignable() && !shift.isDeletable()) {
//                         assignableShifts.addShift(shift);
//                     }

//                     // * Trường hợp ca làm không còn có thể phân công được nữa --> Xóa tất cả các
//                     // * đăng ký cho ca làm việc này và xóa ca làm ra khỏi Working Memory
//                     if (shift.isDeletable()) {
//                         shiftEnrollments.removeEnrollments(shift, kieSession);
//                         FactHandle factHandleShift = kieSession.getFactHandle(shift);
//                         kieSession.delete(factHandleShift);
//                         shiftIterator.remove();
//                     }
//                 }

//                 if (assignableShifts.getSize() <= 0 || shiftEnrollments.getSize() <= 0) {
//                     break;
//                 }

//                 // * Chọn 1 ca làm việc để thực hiện lọc danh sách nhân viên có thể được phân
//                 // * công cho ca làm việc này
//                 autoAssignmentContext.setCurrentShift(assignableShifts.getShifts().get(0));
//                 FactHandle factHandleContext = kieSession.getFactHandle(autoAssignmentContext);
//                 kieSession.update(factHandleContext, autoAssignmentContext);
//                 System.out.println("Context shift: " +
//                         autoAssignmentContext.getCurrentShift());

//                 // * Thực hiện các lệnh thuộc nhóm "EnrollmentEmployeeRule"
//                 kieSession.getAgenda().getAgendaGroup("EnrollmentEmployeeRule").setFocus();
//                 kieSession.fireAllRules();

//                 // * Lấy danh sách các nhân viên có thể phân công cho ca làm việc được chọn ở
//                 // * trên
//                 eligibleEmployees.clearEmployees();
//                 Iterator<Employee> empIterator = employees.iterator();
//                 while (empIterator.hasNext()) {
//                     Employee emp = empIterator.next();

//                     if (emp.isEligible() && !emp.isDeletable()) {
//                         eligibleEmployees.addEmployee(emp);
//                     }

//                     // * Trường hợp nhân viên không còn có thể phân công được nữa --> Xóa tất cả
//                     // * đăng ký của nhân viên này và bản thân nhân viên ra khỏi Working Memory
//                     if (emp.isDeletable()) {
//                         shiftEnrollments.removeEnrollments(emp, kieSession);
//                         FactHandle factHandleEmployee = kieSession.getFactHandle(emp);
//                         kieSession.delete(factHandleEmployee);
//                         empIterator.remove();
//                     }
//                 }

//                 if (eligibleEmployees.getSize() <= 0 || shiftEnrollments.getSize() <= 0) {
//                     break;
//                 }

//                 // * Cập nhật fact chứa danh sách nhân viên có thể phân công
//                 // * trong Working Memory
//                 FactHandle factHandleEligibleEmployees = kieSession.getFactHandle(eligibleEmployees);
//                 if (factHandleEligibleEmployees != null) {
//                     System.out.println("EligibleEmployees fact handle is not null, updating");
//                     kieSession.update(factHandleEligibleEmployees, eligibleEmployees);
//                 }

//                 // * Thực hiện các lệnh thuộc nhóm "EmployeeSortingRule"
//                 // * Thực hiện sắp xếp danh sách nhân viên có thể phân công theo fact Sort
//                 kieSession.getAgenda().getAgendaGroup("EmployeeSortingRule").setFocus();
//                 kieSession.fireAllRules();

//                 if (shiftEnrollments.getSize() <= 0) {
//                     break;
//                 }

//                 Shift_Date chosenShift = autoAssignmentContext.getCurrentShift();
//                 // * Chọn 1 nhân viên đầu tiên trong danh sách để phân công cho ca làm việc
//                 Employee chosenEmployee = eligibleEmployees.getEmployees().get(0);
//                 // * Sau khi phân công, xóa đăng ký đã được xử lý khỏi danh sách đăng ký
//                 ShiftEnrollment processedEnrollment = null;
//                 for (ShiftEnrollment enrollment : shiftEnrollments.getEnrollments()) {
//                     if (enrollment.getEmployee().equals(chosenEmployee) &&
//                             enrollment.getShift().equals(chosenShift)) {
//                         processedEnrollment = enrollment;
//                         break;
//                     }
//                 }
//                 FactHandle factHandleShiftEnrollment = kieSession.getFactHandle(processedEnrollment);
//                 kieSession.delete(factHandleShiftEnrollment);
//                 shiftEnrollments.removeEnrollment(processedEnrollment);

//                 // * Tạo phân công bằng nhân viên và ca làm được chọn ở trên và thêm vào danh
//                 // * sách phân công
//                 ShiftAssignment sa = assignEmpToShift(kieSession, chosenShift, chosenEmployee);
//                 shiftAssignments.addAssignment(sa);
//             }

//             // * Kết quả phân công sau sau khi thực hiện bước 1
//             System.out.println("Shift Assignments length after first step: " + shiftAssignments.getSize());
//             for (ShiftAssignment shiftAssignment : shiftAssignments.getAssignments()) {
//                 System.out.println("Shift Assignment: " +
//                         shiftAssignment.getEmployee().getEmployeeId() + " -> "
//                         + shiftAssignment.getShift().getShiftId() + " on " +
//                         shiftAssignment.getShift().getShiftDate());
//             }

//             // * Bước 2: Phân công các ca làm việc còn lại cho các nhân viên có tham gia
//             // * đăng ký ca làm
//             do {
//                 // * Thực hiện các lệnh thuộc nhóm "ShiftRule"
//                 kieSession.getAgenda().getAgendaGroup("ShiftRule").setFocus();
//                 kieSession.fireAllRules();

//                 // * Lấy danh sách các ca làm việc có thể phân công sau khi kiểm tra điều kiện
//                 assignableShifts.clearShifts();
//                 Iterator<Shift_Date> shiftIterator = shiftDates.iterator();
//                 while (shiftIterator.hasNext()) {
//                     Shift_Date shift = shiftIterator.next();
//                     if (shift.isAssignable() && !shift.isDeletable()) {
//                         assignableShifts.addShift(shift);
//                     }
//                     // * Trường hợp ca làm không còn có thể phân công được nữa
//                     // * --> Xóa ca làm khỏi Working Memory
//                     if (shift.isDeletable()) {
//                         FactHandle factHandleShift = kieSession.getFactHandle(shift);
//                         kieSession.delete(factHandleShift);
//                         shiftIterator.remove();
//                     }
//                 }

//                 if (assignableShifts.getSize() <= 0) {
//                     break;
//                 }

//                 // * Chọn 1 ca làm việc để thực hiện lọc danh sách nhân viên có thể được phân
//                 // * công cho ca làm việc này
//                 autoAssignmentContext.setCurrentShift(assignableShifts.getShifts().get(0));
//                 FactHandle factHandleContext = kieSession.getFactHandle(autoAssignmentContext);
//                 kieSession.update(factHandleContext, autoAssignmentContext);
//                 System.out.println("Context shift: " +
//                         autoAssignmentContext.getCurrentShift());

//                 /// * Thực hiện các lệnh thuộc nhóm "EmployeeRule"
//                 kieSession.getAgenda().getAgendaGroup("EmployeeRule").setFocus();
//                 kieSession.fireAllRules();

//                 // * Lấy danh sách các nhân viên có thể phân công cho ca làm việc được chọn ở
//                 // * trên
//                 eligibleEmployees.clearEmployees();
//                 Iterator<Employee> empIterator = employees.iterator();
//                 while (empIterator.hasNext()) {
//                     Employee emp = empIterator.next();
//                     if (emp.isEligible() && !emp.isDeletable()) {
//                         eligibleEmployees.addEmployee(emp);
//                     }
//                     // * Trường hợp nhân viên không còn có thể phân công được nữa
//                     // * --> Xóa nhân viên ra khỏi Working Memory
//                     if (emp.isDeletable()) {
//                         FactHandle factHandleEmployee = kieSession.getFactHandle(emp);
//                         kieSession.delete(factHandleEmployee);
//                         empIterator.remove();
//                     }
//                 }

//                 if (eligibleEmployees.getSize() <= 0) {
//                     break;
//                 }

//                 // * Cập nhật fact chứa danh sách nhân viên có thể phân công
//                 FactHandle factHandleEligibleEmployees = kieSession.getFactHandle(eligibleEmployees);
//                 if (factHandleEligibleEmployees != null) {
//                     System.out.println("EligibleEmployees fact handle is not null, updating");
//                     kieSession.update(factHandleEligibleEmployees, eligibleEmployees);
//                 }

//                 // * Thực hiện các lệnh thuộc nhóm "EmployeeSortingRule"
//                 // * Sắp xếp danh sách nhân viên có thể phân công theo fact Sort
//                 kieSession.getAgenda().getAgendaGroup("EmployeeSortingRule").setFocus();
//                 kieSession.fireAllRules();

//                 if (eligibleEmployees.getSize() <= 0) {
//                     break;
//                 }

//                 // * Chọn 1 nhân viên đầu tiên trong danh sách để phân công cho ca làm việc
//                 ShiftAssignment sa = assignEmpToShift(kieSession,
//                         autoAssignmentContext.getCurrentShift(),
//                         eligibleEmployees.getEmployees().get(0));
//                 shiftAssignments.addAssignment(sa);

//             } while (true);

//             // * Kết quả phân công sau khi hoàn thành phân công
//             System.out.println("Shift Assignments length final: " + shiftAssignments.getSize());
//             for (ShiftAssignment shiftAssignment : shiftAssignments.getAssignments()) {
//                 System.out.println("Shift Assignment: " +
//                         shiftAssignment.getEmployee().getEmployeeId() + " -> "
//                         + shiftAssignment.getShift().getShiftId() + " on " +
//                         shiftAssignment.getShift().getShiftDate());
//             }

//         } catch (Exception e) {
//             e.printStackTrace();
//         } finally {
//             // Dọn tài nguyên, tránh memory leak
//             System.out.println("Cleaning up resources...");

//             if (kieSession != null) {
//                 try {
//                     kieSession.dispose();
//                 } catch (Exception e) {
//                     System.err.println("Error disposing KieSession: " + e.getMessage());
//                 }
//             }

//             if (kieContainer != null) {
//                 try {
//                     kieContainer.dispose();
//                 } catch (Exception e) {
//                     System.err.println("Error disposing KieContainer: " + e.getMessage());
//                 }
//             }

//             // Gọi garbage collector của JVM
//             System.gc();

//             try {
//                 Thread.sleep(100);
//             } catch (InterruptedException e) {
//                 // Ignore
//             }
//         }
//     }
// }