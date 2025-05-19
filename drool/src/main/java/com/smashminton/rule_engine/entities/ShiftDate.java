package com.smashminton.rule_engine.entities;

import java.time.LocalDateTime;
import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "shift_date")
@IdClass(ShiftDateId.class)
public class ShiftDate {
    @Id
    @Column(name = "shiftid")
    private Integer shiftId;

    @Id
    @Column(name = "shiftdate")
    private LocalDateTime shiftDate;

    @ManyToOne
    @JoinColumn(name = "shift_id")
    @JsonIgnoreProperties({"shiftDates", "shiftAssignments", "shiftEnrollments"})
    private Shift shift;

    @OneToMany(mappedBy = "shiftDateEntity", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("shiftDateEntity")
    private List<ShiftAssignment> shiftAssignments = new ArrayList<>();

    @OneToMany(mappedBy = "shiftDateEntity", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("shiftDateEntity")
    private List<ShiftEnrollment> shiftEnrollments = new ArrayList<>();
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class ShiftDateId implements java.io.Serializable {
    private Integer shiftId;
    private LocalDateTime shiftDate;
} 