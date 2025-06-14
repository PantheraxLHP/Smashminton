package com.example.model;

import java.util.List;
import com.example.util.Sort;
import com.example.util.Sort.SortType;
import java.util.ArrayList;
import java.util.Collections;

public class EligibleEmployees {
    private List<Employee> employees;

    public EligibleEmployees() {
        this.employees = Collections.synchronizedList(new ArrayList<Employee>());
    }

    public EligibleEmployees(List<Employee> employees) {
        this.employees = Collections.synchronizedList(new ArrayList<Employee>());
        synchronized (this.employees) {
            this.employees.addAll(employees);
        }
    }

    public List<Employee> getEmployees() {
        return employees;
    }

    public void setEmployees(List<Employee> employees) {
        synchronized (this.employees) {
            this.employees.clear();
            this.employees.addAll(employees);
        }
    }

    public synchronized void addEmployee(Employee employee) {
        this.employees.add(employee);
    }

    public synchronized void removeEmployee(Employee employee) {
        this.employees.remove(employee);
    }

    public synchronized void clearEmployees() {
        this.employees.clear();
    }

    public int getSize() {
        return employees != null ? employees.size() : 0;
    }

    public void sortEmployees(Sort sort) {
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

                if (comparison == 0) {
                    return Integer.compare(e1.getEmployeeId(), e2.getEmployeeId());
                }
                return sort.getSortType() == SortType.ASCENDING ? comparison : -comparison;
            });
        }
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("EligibleEmployees{");
        for (Employee employee : employees) {
            sb.append(employee.toString()).append(", ");
        }
        sb.append('}');
        return sb.toString();
    }
}
