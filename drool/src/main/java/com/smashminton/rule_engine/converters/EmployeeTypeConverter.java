package com.smashminton.rule_engine.converters;

import com.smashminton.rule_engine.entities.Employee.EmployeeType;
import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter(autoApply = true)
public class EmployeeTypeConverter implements AttributeConverter<EmployeeType, String> {

    @Override
    public String convertToDatabaseColumn(EmployeeType attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getValue();
    }

    @Override
    public EmployeeType convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        for (EmployeeType type : EmployeeType.values()) {
            if (type.getValue().equals(dbData)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown EmployeeType: " + dbData);
    }
} 