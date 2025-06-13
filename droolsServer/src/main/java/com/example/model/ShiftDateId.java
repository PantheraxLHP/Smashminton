package com.example.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

public class ShiftDateId implements Serializable {
    private int shiftId;
    private LocalDateTime shiftDate;

    public ShiftDateId() {
    }

    public ShiftDateId(int shiftId, LocalDateTime shiftDate) {
        this.shiftId = shiftId;
        this.shiftDate = shiftDate;
    }

    public int getShiftId() {
        return shiftId;
    }

    public void setShiftId(int shiftId) {
        this.shiftId = shiftId;
    }

    public LocalDateTime getShiftDate() {
        return shiftDate;
    }

    public void setShiftDate(LocalDateTime shiftDate) {
        this.shiftDate = shiftDate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        ShiftDateId that = (ShiftDateId) o;
        return shiftId == that.shiftId && Objects.equals(shiftDate, that.shiftDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(shiftId, shiftDate);
    }
}
