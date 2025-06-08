package com.smashminton.rule_engine.entities;

import com.smashminton.rule_engine.converters.EmployeeTypeConverter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "employees")
public class Employee {
    @Id
    @Column(name = "employeeid")
    private Integer employeeId;

    @Column(name = "fingerprintid")
    private Integer fingerprintId;

    @Column(name = "last_week_shift_type")
    @Enumerated(EnumType.STRING)
    private ShiftType lastWeekShiftType;

    @Column(name = "employee_type")
    @Convert(converter = EmployeeTypeConverter.class)
    private EmployeeType employeeType;

    @Column(name = "role")
    private String role;

    @JsonIgnore
    @OneToOne
    @MapsId
    @JoinColumn(name = "employeeid")
    private Account account;

    @JsonIgnore
    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL)
    private List<ShiftAssignment> shiftAssignments = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL)
    private List<ShiftEnrollment> shiftEnrollments = new ArrayList<>();

    public enum ShiftType {
        Morning, Evening, Mix
    }

    public enum EmployeeType {
        Full_time("Full-time"),
        Part_time("Part-time");

        private final String value;

        EmployeeType(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }

        public static EmployeeType fromValue(String value) {
            for (EmployeeType type : EmployeeType.values()) {
                if (type.value.equals(value)) {
                    return type;
                }
            }
            throw new IllegalArgumentException("Unknown EmployeeType: " + value);
        }

        @Override
        public String toString() {
            return value;
        }
    }
} 