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
@Table(name = "accounts")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "accountid")
    private Integer accountId;

    @Column(name = "username")
    private String username;

    @Column(name = "password")
    private String password;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private AccountStatus status;

    @Column(name = "fullname")
    private String fullName;

    @Column(name = "email")
    private String email;

    @Column(name = "dob")
    private LocalDateTime dob;

    @Column(name = "gender")
    private String gender;

    @Column(name = "phonenumber")
    private String phoneNumber;

    @Column(name = "address")
    private String address;

    @Column(name = "avatarurl")
    private String avatarUrl;

    @Column(name = "accounttype")
    @Enumerated(EnumType.STRING)
    private AccountType accountType;

    @Column(name = "createdat")
    private LocalDateTime createdAt;

    @Column(name = "updatedat")
    private LocalDateTime updatedAt;

    @JsonIgnore
    @OneToOne(mappedBy = "account", cascade = CascadeType.ALL)
    private Employee employee;

    public enum AccountStatus {
        Active, Inactive
    }

    public enum AccountType {
        Employee, Customer
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
} 