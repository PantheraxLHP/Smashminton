package com.smashminton.rule_engine.entities;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

/**
 * Internal model class for Drools rules processing
 */
public class DroolsEmployee {
    private Integer employeeId;
    private List<DroolsShiftAssignment> assignedShifts;
    private int assignedShiftInWeek;
    private int assignedShiftInMonth;
    private boolean eligible;
    private boolean deletable;
    private Map<LocalDate, Integer> assignedShiftInDay;
    private int priorityScore;
    
    public DroolsEmployee() {
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
    
    public DroolsEmployee(Integer employeeId) {
        this();
        this.employeeId = employeeId;
    }
    
    public DroolsEmployee(int employeeId) {
        int currentDayOfWeek = LocalDate.now().getDayOfWeek().getValue();
        LocalDate nextWeekStart = LocalDate.now().plusDays(7 - currentDayOfWeek + 1);
        this.assignedShiftInDay = new HashMap<>();
        for (int i = 0; i < 7; i++) {
            LocalDate shift_date = nextWeekStart.plusDays(i);
            assignedShiftInDay.put(shift_date, 0);
        }

        this.employeeId = employeeId;
        this.assignedShiftInWeek = 0;
        this.priorityScore = 100;
        this.eligible = false;
        this.deletable = false;
    }
    
    public DroolsEmployee(int employeeId, int lateCount, int absenceCount) {
        int currentDayOfWeek = LocalDate.now().getDayOfWeek().getValue();
        LocalDate nextWeekStart = LocalDate.now().plusDays(7 - currentDayOfWeek + 1);
        this.assignedShiftInDay = new HashMap<>();
        for (int i = 0; i < 7; i++) {
            LocalDate shift_date = nextWeekStart.plusDays(i);
            assignedShiftInDay.put(shift_date, 0);
        }
        this.employeeId = employeeId;
        this.assignedShiftInWeek = 0;
        this.priorityScore = 100 - (lateCount + absenceCount * 3);
        this.eligible = false;
        this.deletable = false;
    }
    
    public DroolsEmployee(DroolsEmployee employee) {
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
    
    public Integer getEmployeeId() {
        return employeeId;
    }
    
    public void setEmployeeId(Integer employeeId) {
        this.employeeId = employeeId;
    }
    
    public List<DroolsShiftAssignment> getAssignedShifts() {
        return assignedShifts;
    }
    
    public void setAssignedShifts(List<DroolsShiftAssignment> assignedShifts) {
        this.assignedShifts = assignedShifts;
    }
    
    public void addAssignedShift(DroolsShiftAssignment assignment) {
        if (assignment != null) {
            this.assignedShifts.add(assignment);
            
            // Cập nhật số lượng ca làm việc theo tuần và tháng
            updateAssignedShiftCounts(assignment.getShift().getShiftDate());
        }
    }
    
    private void updateAssignedShiftCounts(LocalDate shiftDate) {
        if (shiftDate == null) return;
        
        LocalDate now = LocalDate.now();
        LocalDate startOfWeek = now.minusDays(now.getDayOfWeek().getValue() - 1);
        LocalDate endOfWeek = startOfWeek.plusDays(6);
        
        LocalDate startOfMonth = now.withDayOfMonth(1);
        LocalDate endOfMonth = now.withDayOfMonth(now.lengthOfMonth());
        
        // Tính số ca làm việc trong tuần
        if (shiftDate.isEqual(startOfWeek) || (shiftDate.isAfter(startOfWeek) && shiftDate.isBefore(endOfWeek)) || shiftDate.isEqual(endOfWeek)) {
            this.assignedShiftInWeek++;
        }
        
        // Tính số ca làm việc trong tháng
        if (shiftDate.isEqual(startOfMonth) || (shiftDate.isAfter(startOfMonth) && shiftDate.isBefore(endOfMonth)) || shiftDate.isEqual(endOfMonth)) {
            this.assignedShiftInMonth++;
        }
    }
    
    public int getAssignedShiftInWeek() {
        return assignedShiftInWeek;
    }
    
    public void setAssignedShiftInWeek(int assignedShiftInWeek) {
        this.assignedShiftInWeek = assignedShiftInWeek;
    }
    
    public int getAssignedShiftInMonth() {
        return assignedShiftInMonth;
    }
    
    public void setAssignedShiftInMonth(int assignedShiftInMonth) {
        this.assignedShiftInMonth = assignedShiftInMonth;
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

    public int getAssignedShiftInDay(LocalDate shift_date) {
        return this.assignedShiftInDay.getOrDefault(shift_date, Integer.MAX_VALUE);
    }
    
    public void setAssignedShiftInDay(LocalDate shift_date, int count) {
        this.assignedShiftInDay.put(shift_date, count);
    }

    public int getPriorityScore() {
        return priorityScore;
    }

    public void setPriorityScore(int priorityScore) {
        this.priorityScore = priorityScore;
    }

    @Override
    public String toString() {
        return "DroolsEmployee{" +
                "employeeId=" + employeeId +
                ", assignedShiftInWeek=" + assignedShiftInWeek +
                ", assignedShiftInMonth=" + assignedShiftInMonth +
                '}';
    }
} 