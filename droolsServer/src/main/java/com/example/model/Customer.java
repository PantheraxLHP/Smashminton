package com.example.model;

public class Customer {
    private CustomerType type;

    private int years;

    private int discount;

    public CustomerType getType() {
        return type;
    }

    public void setType(CustomerType type) {
        this.type = type;
    }

    public int getYears() {
        return years;
    }

    public void setYears(int years) {
        this.years = years;
    }

    public Customer(CustomerType type, int years) {
        this.type = type;
        this.years = years;
        this.discount = 0;
    }

    public int getDiscount() {
        return discount;
    }

    public void setDiscount(int discount) {
        this.discount = discount;
    }

    public enum CustomerType {
        INDIVIDUAL,
        BUSINESS;
    }
}