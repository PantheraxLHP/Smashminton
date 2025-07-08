package com.example.model;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "penalty_rules")
public class PenaltyRule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "penaltyruleid")
    private int penaltyRuleId;

    @Column(name = "penaltyname")
    private String penaltyName;

    @Column(name = "penaltydescription")
    private String penaltyDescription;

    @Column(name = "basepenalty")
    private BigDecimal basePenalty;

    @Column(name = "incrementalpenalty")
    private BigDecimal incrementalPenalty;

    @Column(name = "maxiumpenalty")
    private BigDecimal maximumPenalty;

    @Column(name = "disciplineaction")
    private String disciplineAction;

    @OneToMany(mappedBy = "penaltyRule", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PenaltyRecord> penaltyRecords;

    // Constructors
    public PenaltyRule() {
    }

    public PenaltyRule(String penaltyName, String penaltyDescription) {
        this.penaltyName = penaltyName;
        this.penaltyDescription = penaltyDescription;
    }

    // Getters and Setters
    public int getPenaltyRuleId() {
        return penaltyRuleId;
    }

    public void setPenaltyRuleId(int penaltyRuleId) {
        this.penaltyRuleId = penaltyRuleId;
    }

    public String getPenaltyName() {
        return penaltyName;
    }

    public void setPenaltyName(String penaltyName) {
        this.penaltyName = penaltyName;
    }

    public String getPenaltyDescription() {
        return penaltyDescription;
    }

    public void setPenaltyDescription(String penaltyDescription) {
        this.penaltyDescription = penaltyDescription;
    }

    public BigDecimal getBasePenalty() {
        return basePenalty;
    }

    public void setBasePenalty(BigDecimal basePenalty) {
        this.basePenalty = basePenalty;
    }

    public BigDecimal getIncrementalPenalty() {
        return incrementalPenalty;
    }

    public void setIncrementalPenalty(BigDecimal incrementalPenalty) {
        this.incrementalPenalty = incrementalPenalty;
    }

    public BigDecimal getMaximumPenalty() {
        return maximumPenalty;
    }

    public void setMaximumPenalty(BigDecimal maximumPenalty) {
        this.maximumPenalty = maximumPenalty;
    }

    public String getDisciplineAction() {
        return disciplineAction;
    }

    public void setDisciplineAction(String disciplineAction) {
        this.disciplineAction = disciplineAction;
    }

    public List<PenaltyRecord> getPenaltyRecords() {
        return penaltyRecords;
    }

    public void setPenaltyRecords(List<PenaltyRecord> penaltyRecords) {
        this.penaltyRecords = penaltyRecords;
    }

    @Override
    public String toString() {
        return "PenaltyRule{" +
                "penaltyRuleId=" + penaltyRuleId +
                ", penaltyName='" + penaltyName + '\'' +
                ", penaltyDescription='" + penaltyDescription + '\'' +
                '}';
    }
}
