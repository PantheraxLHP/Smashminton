package com.example.model;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "penalty_records")
public class PenaltyRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "penaltyrecordid")
    private int penaltyRecordId;

    @Column(name = "violationdate")
    private LocalDateTime violationDate;

    @Column(name = "finalpenaltyamount")
    private BigDecimal finalPenaltyAmount;

    @Column(name = "penaltyapplieddate")
    private LocalDateTime penaltyAppliedDate;

    @Column(name = "penaltyruleid")
    private Integer penaltyRuleId;

    @Column(name = "employeeid")
    private Integer employeeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "penaltyruleid", insertable = false, updatable = false)
    private PenaltyRule penaltyRule;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employeeid", insertable = false, updatable = false)
    private Employee employee;

    // Constructors
    public PenaltyRecord() {
    }

    public PenaltyRecord(Integer employeeId, Integer penaltyRuleId, LocalDateTime violationDate) {
        this.employeeId = employeeId;
        this.penaltyRuleId = penaltyRuleId;
        this.violationDate = violationDate;
    }

    // Getters and Setters
    public int getPenaltyRecordId() {
        return penaltyRecordId;
    }

    public void setPenaltyRecordId(int penaltyRecordId) {
        this.penaltyRecordId = penaltyRecordId;
    }

    public LocalDateTime getViolationDate() {
        return violationDate;
    }

    public void setViolationDate(LocalDateTime violationDate) {
        this.violationDate = violationDate;
    }

    public BigDecimal getFinalPenaltyAmount() {
        return finalPenaltyAmount;
    }

    public void setFinalPenaltyAmount(BigDecimal finalPenaltyAmount) {
        this.finalPenaltyAmount = finalPenaltyAmount;
    }

    public LocalDateTime getPenaltyAppliedDate() {
        return penaltyAppliedDate;
    }

    public void setPenaltyAppliedDate(LocalDateTime penaltyAppliedDate) {
        this.penaltyAppliedDate = penaltyAppliedDate;
    }

    public Integer getPenaltyRuleId() {
        return penaltyRuleId;
    }

    public void setPenaltyRuleId(Integer penaltyRuleId) {
        this.penaltyRuleId = penaltyRuleId;
    }

    public Integer getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Integer employeeId) {
        this.employeeId = employeeId;
    }

    public PenaltyRule getPenaltyRule() {
        return penaltyRule;
    }

    public void setPenaltyRule(PenaltyRule penaltyRule) {
        this.penaltyRule = penaltyRule;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    @Override
    public String toString() {
        return "PenaltyRecord{" +
                "penaltyRecordId=" + penaltyRecordId +
                ", employeeId=" + employeeId +
                ", penaltyRuleId=" + penaltyRuleId +
                ", violationDate=" + violationDate +
                '}';
    }
}
