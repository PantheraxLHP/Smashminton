package com.smashminton.rule_engine.entities;

import java.time.LocalDateTime;
import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

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

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employeeid", insertable = false, updatable = false)
    private Employee employee;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "shift_id")
    private Shift shift;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
        @JoinColumn(name = "shiftid", referencedColumnName = "shiftid", insertable = false, updatable = false),
        @JoinColumn(name = "shiftdate", referencedColumnName = "shiftdate", insertable = false, updatable = false)
    })
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