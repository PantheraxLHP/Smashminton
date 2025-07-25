import { useState, useCallback } from 'react';
import { z } from 'zod';
import {
    getValidationErrors,
    sanitizeString,
    sanitizeEmail,
    sanitizePhone,
    sanitizeNumber,
} from '@/lib/validation.schema';

type SanitizerFunction = (value: any) => any;

export interface UseFormValidationOptions<T> {
    schema: z.ZodSchema<T>;
    initialValues: T;
    onSubmit?: (validatedData: T) => Promise<void> | void;
    sanitizers?: Record<string, SanitizerFunction>;
}

export interface FormValidationResult<T> {
    values: T;
    errors: Record<string, string>;
    isSubmitting: boolean;
    isValid: boolean;
    handleChange: (field: string, value: any) => void;
    handleSubmit: (e?: React.FormEvent) => Promise<void>;
    setValues: (values: Partial<T>) => void;
    setErrors: (errors: Record<string, string>) => void;
    reset: () => void;
    validateField: (field: string, value: any) => boolean;
    validateAll: () => boolean;
}

const defaultSanitizers: Record<string, SanitizerFunction> = {
    string: sanitizeString,
    email: sanitizeEmail,
    phone: sanitizePhone,
    number: sanitizeNumber,
};

export function useFormValidation<T extends Record<string, any>>({
    schema,
    initialValues,
    onSubmit,
    sanitizers = {},
}: UseFormValidationOptions<T>): FormValidationResult<T> {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Combine default sanitizers with custom ones
    const allSanitizers = { ...defaultSanitizers, ...sanitizers };

    const sanitizeValue = useCallback(
        (field: string, value: any) => {
            // Check if there's a custom sanitizer for this field
            if (allSanitizers[field]) {
                return allSanitizers[field](value);
            }

            // Auto-detect and apply appropriate sanitizer based on field name or value type
            if (typeof value === 'string') {
                if (field.toLowerCase().includes('email')) {
                    return sanitizeEmail(value);
                } else if (field.toLowerCase().includes('phone')) {
                    return sanitizePhone(value);
                } else {
                    return sanitizeString(value);
                }
            } else if (typeof value === 'number') {
                return sanitizeNumber(value);
            }

            return value;
        },
        [allSanitizers],
    );

    const validateField = useCallback(
        (field: string, value: any): boolean => {
            try {
                // Try to validate just this field using schema.pick if possible
                const fieldSchema = (schema as any).shape?.[field];
                if (fieldSchema) {
                    fieldSchema.parse(value);
                } else {
                    // Fallback: validate the whole object but only check this field
                    const testData = { ...values, [field]: value };
                    schema.parse(testData);
                }

                setErrors((prev) => ({ ...prev, [field]: '' }));
                return true;
            } catch (error: any) {
                const errorMessage = error.errors?.[0]?.message || 'Giá trị không hợp lệ';
                setErrors((prev) => ({ ...prev, [field]: errorMessage }));
                return false;
            }
        },
        [schema, values],
    );

    const validateAll = useCallback((): boolean => {
        try {
            schema.parse(values);
            setErrors({});
            return true;
        } catch (error: any) {
            const validationErrors = getValidationErrors(error);
            setErrors(validationErrors);
            return false;
        }
    }, [schema, values]);

    const handleChange = useCallback(
        (field: string, value: any) => {
            // Sanitize the input value
            const sanitizedValue = sanitizeValue(field, value);

            // Update values
            setValues((prev) => ({ ...prev, [field]: sanitizedValue }));

            // Validate the field in real-time
            setTimeout(() => {
                validateField(field, sanitizedValue);
            }, 0);
        },
        [sanitizeValue, validateField],
    );

    const handleSubmit = useCallback(
        async (e?: React.FormEvent) => {
            if (e) {
                e.preventDefault();
            }

            // Validate all fields before submission
            if (!validateAll()) {
                return;
            }

            if (!onSubmit) {
                return;
            }

            setIsSubmitting(true);

            try {
                // Parse and validate one more time to ensure data integrity
                const validatedData = schema.parse(values);
                await onSubmit(validatedData);
            } catch (error) {
                console.error('Form submission error:', error);
                if (error instanceof z.ZodError) {
                    const validationErrors = getValidationErrors(error);
                    setErrors(validationErrors);
                }
            } finally {
                setIsSubmitting(false);
            }
        },
        [validateAll, onSubmit, schema, values],
    );

    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setIsSubmitting(false);
    }, [initialValues]);

    const setValuesPartial = useCallback((newValues: Partial<T>) => {
        setValues((prev) => ({ ...prev, ...newValues }));
    }, []);

    const setErrorsPartial = useCallback((newErrors: Record<string, string>) => {
        setErrors((prev) => ({ ...prev, ...newErrors }));
    }, []);

    const isValid = Object.values(errors).every((error) => error === '') && Object.keys(errors).length === 0;

    return {
        values,
        errors,
        isSubmitting,
        isValid,
        handleChange,
        handleSubmit,
        setValues: setValuesPartial,
        setErrors: setErrorsPartial,
        reset,
        validateField,
        validateAll,
    };
}

// Helper function to create input props with validation
export function createInputProps<T>(form: FormValidationResult<T>, field: keyof T, type: string = 'text') {
    return {
        type,
        value: form.values[field] ?? '',
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            form.handleChange(field as string, e.target.value);
        },
        className: `w-full rounded border px-3 py-2 ${
            form.errors[field as string] ? 'border-red-500' : 'border-gray-300'
        }`,
        'aria-invalid': !!form.errors[field as string],
        'aria-describedby': form.errors[field as string] ? `${field as string}-error` : undefined,
    };
}

// Helper function to create error display props
export function createErrorProps(fieldName: string, errors: Record<string, string>) {
    return {
        id: `${fieldName}-error`,
        className: 'mt-1 text-xs text-red-500',
        role: 'alert' as const,
        children: errors[fieldName] || '',
        style: { display: errors[fieldName] ? 'block' : 'none' },
    };
}

export default useFormValidation;
