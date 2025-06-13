package com.example.model;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "shift")
public class Shift implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int shiftid;
    private String shiftstarthour;
    private String shiftendhour;
    private String shifttype;
    // ...relations omitted for brevity...

    public Shift() {
    }

    public int getShiftid() {
        return shiftid;
    }

    public void setShiftid(int shiftid) {
        this.shiftid = shiftid;
    }

    public String getShiftstarthour() {
        return shiftstarthour;
    }

    public void setShiftstarthour(String shiftstarthour) {
        this.shiftstarthour = shiftstarthour;
    }

    public String getShiftendhour() {
        return shiftendhour;
    }

    public void setShiftendhour(String shiftendhour) {
        this.shiftendhour = shiftendhour;
    }

    public String getShifttype() {
        return shifttype;
    }

    public void setShifttype(String shifttype) {
        this.shifttype = shifttype;
    }
}
