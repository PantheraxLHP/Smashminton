package com.example.model;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "employees")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employeeid")
    private int employeeId;

    // Database fields
    private Integer fingerprintid;
    private String last_week_shift_type;
    private String employee_type;
    private String role;
    private String cccd;
    private LocalDateTime expiry_cccd;
    private String taxcode;
    private Double salary; // JPA Relationships
    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("employee-shiftAssignments")
    private List<ShiftAssignment> shiftAssignments;

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("employee-shiftEnrollments")
    private List<ShiftEnrollment> shiftEnrollments; // Calculated/Function-only fields
    @Transient
    private int assignedShiftInWeek;
    @Transient
    private HashMap<LocalDate, Integer> assignedShiftInDay;
    @Transient
    private int priorityScore;
    @Transient
    private boolean eligible;
    @Transient
    private boolean deletable;

    public Employee() {
        int currentDayOfWeek = LocalDate.now().getDayOfWeek().getValue();
        LocalDate nextWeekStart = LocalDate.now().plusDays(7 - currentDayOfWeek + 1);
        this.assignedShiftInDay = new HashMap<>();
        for (int i = 0; i < 7; i++) {
            LocalDate shift_date = nextWeekStart.plusDays(i);
            assignedShiftInDay.put(shift_date, 0);
        }

        this.employeeId = 0;
        this.assignedShiftInWeek = 0;
        this.priorityScore = 100;
        this.eligible = false;
        this.deletable = false;
    }

    public Employee(int employeeid) {
        int currentDayOfWeek = LocalDate.now().getDayOfWeek().getValue();
        LocalDate nextWeekStart = LocalDate.now().plusDays(7 - currentDayOfWeek + 1);
        this.assignedShiftInDay = new HashMap<>();
        for (int i = 0; i < 7; i++) {
            LocalDate shift_date = nextWeekStart.plusDays(i);
            assignedShiftInDay.put(shift_date, 0);
        }

        this.employeeId = employeeid;
        this.assignedShiftInWeek = 0;
        this.priorityScore = 100;
        this.eligible = false;
        this.deletable = false;
    }

    public Employee(int employeeid, int lateCount, int absenceCount) {
        int currentDayOfWeek = LocalDate.now().getDayOfWeek().getValue();
        LocalDate nextWeekStart = LocalDate.now().plusDays(7 - currentDayOfWeek + 1);
        this.assignedShiftInDay = new HashMap<>();
        for (int i = 0; i < 7; i++) {
            LocalDate shift_date = nextWeekStart.plusDays(i);
            assignedShiftInDay.put(shift_date, 0);
        }
        this.employeeId = employeeid;
        this.assignedShiftInWeek = 0;
        this.priorityScore = 100 - (lateCount + absenceCount * 3);
        this.eligible = false;
        this.deletable = false;
    }

    public Employee(Employee employee) {
        this.assignedShiftInDay = new HashMap<LocalDate, Integer>();
        for (LocalDate shiftDate : employee.assignedShiftInDay.keySet()) {
            this.assignedShiftInDay.put(shiftDate, employee.assignedShiftInDay.get(shiftDate));
        }
        this.employeeId = employee.employeeId;
        this.assignedShiftInWeek = employee.assignedShiftInWeek;
        this.priorityScore = employee.priorityScore;
        this.eligible = employee.eligible;
        this.deletable = employee.deletable;
    }

    public int getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(int employeeId) {
        this.employeeId = employeeId;
    }

    public int getAssignedShiftInWeek() {
        return assignedShiftInWeek;
    }

    public void setAssingedShiftInWeek(int assignedShiftInWeek) {
        this.assignedShiftInWeek = assignedShiftInWeek;
    }

    public int getAssignedShiftInDay(LocalDateTime shift_date) {
        // Convert LocalDateTime to LocalDate for lookup
        LocalDate dateOnly = shift_date.toLocalDate();
        return this.assignedShiftInDay.getOrDefault(dateOnly, 0);
    }

    public void setAssignedShiftInDay(LocalDateTime shift_date, int assignedShiftInDay) {
        // Convert LocalDateTime to LocalDate for storage
        LocalDate dateOnly = shift_date.toLocalDate();
        this.assignedShiftInDay.put(dateOnly, assignedShiftInDay);
    }

    public HashMap<LocalDate, Integer> getAssignedShiftInDay() {
        return assignedShiftInDay;
    }

    public List<ShiftAssignment> getShiftAssignments() {
        return shiftAssignments;
    }

    public void setShiftAssignments(List<ShiftAssignment> shiftAssignments) {
        this.shiftAssignments = shiftAssignments;
    }

    public List<ShiftEnrollment> getShiftEnrollments() {
        return shiftEnrollments;
    }

    public void setShiftEnrollments(List<ShiftEnrollment> shiftEnrollments) {
        this.shiftEnrollments = shiftEnrollments;
    }

    public int getPriorityScore() {
        return priorityScore;
    }

    public void setPriorityScore(int priorityScore) {
        this.priorityScore = priorityScore;
    }

    public boolean isEligible() {
        return eligible;
    }

    public void setEligible(boolean eligible) {
        this.eligible = eligible;
    }

    public boolean isDeletable() {
        return deletable;
    }

    public void setDeletable(boolean deletable) {
        this.deletable = deletable;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null || getClass() != obj.getClass())
            return false;
        Employee employee = (Employee) obj;
        return employeeId == employee.employeeId &&
                assignedShiftInWeek == employee.assignedShiftInWeek &&
                priorityScore == employee.priorityScore &&
                eligible == employee.eligible &&
                assignedShiftInDay.equals(employee.assignedShiftInDay);
    }

    @Override
    public int hashCode() {
        return 31 * employeeId + assignedShiftInWeek + priorityScore + (eligible ? 1 : 0)
                + assignedShiftInDay.hashCode();
    }

    @Override
    public String toString() {
        return "Employee{" +
                "employeeId=" + employeeId +
                ", assignedShiftInWeek=" + assignedShiftInWeek +
                ", assignedShiftInDay=" + assignedShiftInDay +
                ", priorityScore=" + priorityScore +
                ", eligible=" + eligible +
                ", deletable=" + deletable +
                '}';
    }
}
