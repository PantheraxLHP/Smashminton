package com.smashminton.rule_engine.entities;

import java.util.List;
import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.ArrayList;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "shift")
public class Shift {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "shiftid")
    private Integer shiftId;

    @Column(name = "shiftstarthour")
    private String shiftStartHour;

    @Column(name = "shiftendhour")
    private String shiftEndHour;

    @Column(name = "shifttype")
    private String shiftType;

    @JsonIgnore
    @OneToMany(mappedBy = "shift", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("shift")
    private List<ShiftDate> shiftDates;

    @JsonIgnore
    @OneToMany(mappedBy = "shift", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("shift")
    private List<ShiftAssignment> shiftAssignments;

    @JsonIgnore
    @OneToMany(mappedBy = "shift", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("shift")
    private List<ShiftEnrollment> shiftEnrollments;
} 