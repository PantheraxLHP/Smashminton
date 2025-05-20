package com.smashminton.rule_engine.services.impl;

import com.smashminton.rule_engine.entities.ShiftDate;
import com.smashminton.rule_engine.repositories.ShiftDateRepository;
import com.smashminton.rule_engine.services.ShiftDateService;
import javax.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ShiftDateServiceImpl implements ShiftDateService {
    private static final Logger logger = LoggerFactory.getLogger(ShiftDateServiceImpl.class);

    @Autowired
    private ShiftDateRepository shiftDateRepository;

    @Override
    public List<ShiftDate> getAllShiftDates() {
        try {
            // Debug information
            logger.info("Starting getAllShiftDates()");
            
            // Check if table exists
            String tableName = shiftDateRepository.checkTableExists();
            logger.info("Table exists check: {}", tableName);

            // Get table structure
            List<Object[]> tableStructure = shiftDateRepository.getTableStructure();
            logger.info("Table structure: {}", tableStructure);
            
            Long count = shiftDateRepository.countAllNative();
            logger.info("Total records in shift_dates table: {}", count);

            List<Object[]> rawData = shiftDateRepository.findAllRawData();
            logger.info("Raw data from shift_dates table: {}", rawData);

            // Try different methods to get data
            logger.info("Trying findAllNative()");
            List<ShiftDate> allDates = shiftDateRepository.findAllNative();
            logger.info("findAllNative() returned {} records", allDates.size());

            if (allDates.isEmpty()) {
                logger.info("Trying findAllShiftDates()");
                allDates = shiftDateRepository.findAllShiftDates();
                logger.info("findAllShiftDates() returned {} records", allDates.size());
            }

            if (allDates.isEmpty()) {
                logger.info("Trying findAll()");
                allDates = shiftDateRepository.findAll();
                logger.info("findAll() returned {} records", allDates.size());
            }
            
            logger.info("Final result: Found {} shift dates", allDates.size());
            return allDates;
        } catch (Exception e) {
            logger.error("Error in getAllShiftDates(): ", e);
            throw e;
        }
    }

    @Override
    public ShiftDate getShiftDateById(Integer id) {
        try {
            logger.info("Getting shift date by id: {}", id);
            
            // Debug information
            List<Object[]> rawData = shiftDateRepository.findByShiftIdNative(id);
            logger.info("Raw data for shiftId {}: {}", id, rawData);

            ShiftDate.ShiftDateId compositeId = new ShiftDate.ShiftDateId(id, null);
            logger.info("Created composite ID: {}", compositeId);

            return shiftDateRepository.findById(compositeId)
                    .orElseThrow(() -> new EntityNotFoundException("ShiftDate not found with id: " + id));
        } catch (Exception e) {
            logger.error("Error in getShiftDateById(): ", e);
            throw e;
        }
    }

    @Override
    public List<ShiftDate> getShiftDatesByDate(LocalDateTime date) {
        return shiftDateRepository.findByShiftDate(date);
    }

    @Override
    public List<ShiftDate> getShiftDatesBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return shiftDateRepository.findByShiftDateBetween(startDate, endDate);
    }

    @Override
    public ShiftDate createShiftDate(ShiftDate shiftDate) {
        return shiftDateRepository.save(shiftDate);
    }

    @Override
    public ShiftDate updateShiftDate(Integer id, ShiftDate shiftDateDetails) {
        ShiftDate shiftDate = getShiftDateById(id);
        shiftDate.setShiftDate(shiftDateDetails.getShiftDate());
        return shiftDateRepository.save(shiftDate);
    }

    @Override
    public void deleteShiftDate(Integer id) {
        ShiftDate shiftDate = getShiftDateById(id);
        shiftDateRepository.delete(shiftDate);
    }
} 