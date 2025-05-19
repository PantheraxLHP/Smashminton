package com.smashminton.rule_engine.entities;

import java.time.LocalDateTime;
import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "shift_date")
@IdClass(ShiftDate.ShiftDateId.class)
public class ShiftDate {
    @Id
    @Column(name = "shiftid")
    private Integer shiftId;

    @Id
    @Column(name = "shiftdate")
    private LocalDateTime shiftDate;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "shiftid", insertable = false, updatable = false)
    private Shift shift;

    @JsonIgnore
    @OneToMany(mappedBy = "shiftDateEntity", cascade = CascadeType.ALL)
    private List<ShiftAssignment> shiftAssignments = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "shiftDateEntity", cascade = CascadeType.ALL)
    private List<ShiftEnrollment> shiftEnrollments = new ArrayList<>();

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ShiftDateId implements java.io.Serializable {
        private Integer shiftId;
        private LocalDateTime shiftDate;
    }
} 