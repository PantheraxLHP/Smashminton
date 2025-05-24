package com.smashminton.rule_engine.controllers;

import com.smashminton.rule_engine.entities.Shift;
import com.smashminton.rule_engine.services.ShiftService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shifts")
@CrossOrigin(origins = "*")
public class ShiftController {

    @Autowired
    private ShiftService shiftService;

    @GetMapping
    public ResponseEntity<List<Shift>> getAllShifts() {
        return ResponseEntity.ok(shiftService.getAllShifts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Shift> getShiftById(@PathVariable Integer id) {
        return ResponseEntity.ok(shiftService.getShiftById(id));
    }

    @PostMapping
    public ResponseEntity<Shift> createShift(@RequestBody Shift shift) {
        return ResponseEntity.ok(shiftService.createShift(shift));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Shift> updateShift(@PathVariable Integer id, @RequestBody Shift shiftDetails) {
        return ResponseEntity.ok(shiftService.updateShift(id, shiftDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShift(@PathVariable Integer id) {
        shiftService.deleteShift(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/type/{shiftType}")
    public ResponseEntity<List<Shift>> getShiftsByType(@PathVariable String shiftType) {
        return ResponseEntity.ok(shiftService.getShiftsByType(shiftType));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Shift>> getShiftsByEmployeeId(@PathVariable Integer employeeId) {
        return ResponseEntity.ok(shiftService.getShiftsByEmployeeId(employeeId));
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<Shift>> getShiftsByDate(@PathVariable String date) {
        return ResponseEntity.ok(shiftService.getShiftsByDate(date));
    }
} 