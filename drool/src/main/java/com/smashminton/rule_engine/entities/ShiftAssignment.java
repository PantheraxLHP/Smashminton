package com.smashminton.rule_engine.entities;

import java.time.LocalDateTime;
import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "shift_assignment")
@IdClass(ShiftAssignmentId.class)
public class ShiftAssignment {
    @Id
    @Column(name = "employeeid")
    private Integer employeeId;

    @Id
    @Column(name = "shiftid")
    private Integer shiftId;

    @Id
    @Column(name = "shiftdate")
    private LocalDateTime shiftDate;

    @Column(name = "assignmentdate")
    private LocalDateTime assignmentDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employeeid", insertable = false, updatable = false)
    @JsonIgnoreProperties({"shiftAssignments", "shiftEnrollments"})
    private Employee employee;

    @ManyToOne
    @JoinColumn(name = "shift_id")
    @JsonIgnoreProperties({"shiftAssignments", "shiftDates", "shiftEnrollments"})
    private Shift shift;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
        @JoinColumn(name = "shiftid", referencedColumnName = "shiftid", insertable = false, updatable = false),
        @JoinColumn(name = "shiftdate", referencedColumnName = "shiftdate", insertable = false, updatable = false)
    })
    @JsonIgnoreProperties({"shiftAssignments", "shiftEnrollments"})
    private ShiftDate shiftDateEntity;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class ShiftAssignmentId implements java.io.Serializable {
    private Integer employeeId;
    private Integer shiftId;
    private LocalDateTime shiftDate;
} 