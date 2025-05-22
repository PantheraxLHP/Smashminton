package com.smashminton.rule_engine.entities;

import java.util.List;
import java.util.ArrayList;

/**
 * Internal model class for Drools rules processing
 */
public class DroolsEligibleEmployees {
    private List<DroolsEmployee> employees;

    public DroolsEligibleEmployees() {
        this.employees = new ArrayList<DroolsEmployee>();
    }

    public DroolsEligibleEmployees(List<DroolsEmployee> employees) {
        this.employees = new ArrayList<DroolsEmployee>();
        this.employees.addAll(employees);
    }

    public List<DroolsEmployee> getEmployees() {
        return employees;
    }

    public void setEmployees(List<DroolsEmployee> employees) {
        this.employees.clear();
        this.employees.addAll(employees);
    }

    public void addEmployee(DroolsEmployee employee) {
        this.employees.add(employee);
    }

    public void removeEmployee(DroolsEmployee employee) {
        this.employees.remove(employee);
    }

    public void clearEmployees() {
        this.employees.clear();
    }

    public int getSize() {
        return employees != null ? employees.size() : 0;
    }

    public void sortEmployees(DroolsSort sort) {
        if (sort.getSortEnabled()) {
            System.out.println("Sorting employees by " + sort.getSortBy() + " in " + sort.getSortType() + " order.");
            employees.sort((e1, e2) -> {
                int comparison = 0;
                switch (sort.getSortBy()) {
                    case PRIORITY:
                        comparison = Integer.compare(e1.getPriorityScore(), e2.getPriorityScore());
                        break;
                    case ASSIGNEDSHIFTINWEEK:
                        comparison = Integer.compare(e1.getAssignedShiftInWeek(), e2.getAssignedShiftInWeek());
                        break;
                }
                return sort.getSortType() == com.example.Sort.SortType.ASCENDING ? comparison : -comparison;
            });
        }
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("DroolsEligibleEmployees{");
        for (DroolsEmployee employee : employees) {
            sb.append(employee.toString()).append(", ");
        }
        sb.append('}');
        return sb.toString();
    }
} 