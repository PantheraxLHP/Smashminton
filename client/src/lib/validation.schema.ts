import { z } from 'zod';

// Validation pattern for Vietnamese phone numbers (10-11 digits)
const vietnamesePhoneRegex = /^(0[3-9][0-9]{8}|\+84[3-9][0-9]{8}|84[3-9][0-9]{8})$/;

// Basic validation schemas - all optional with basic validation when present
export const phoneNumberSchema = z
    .string()
    .optional()
    .refine((val) => {
        if (!val || val.trim() === '') return true; // Allow empty
        return vietnamesePhoneRegex.test(val.trim());
    }, 'Số điện thoại không hợp lệ (phải là số Việt Nam và có 10-11 chữ số)')
    .transform((val) => val?.trim());

// Required phone number schema for payment
export const requiredPhoneNumberSchema = z
    .string()
    .min(1, 'Số điện thoại không được để trống')
    .regex(vietnamesePhoneRegex, 'Số điện thoại không hợp lệ')
    .transform((val) => val.trim());

export const emailSchema = z
    .string()
    .optional()
    .refine((val) => {
        if (!val || val.trim() === '') return true; // Allow empty
        return z.string().email().safeParse(val.trim()).success;
    }, 'Email không hợp lệ')
    .transform((val) => val?.trim().toLowerCase());

export const nameSchema = z
    .string()
    .optional()
    .refine((val) => {
        if (!val || val.trim() === '') return true; // Allow empty
        return val.trim().length <= 100;
    }, 'Tên quá dài (tối đa 100 ký tự)')
    .transform((val) => val?.trim());

export const passwordSchema = z.string().min(3, 'Mật khẩu phải có ít nhất 3 ký tự');

// Address is optional and not required
export const addressSchema = z
    .string()
    .optional()
    .transform((val) => val?.trim());

// Date of birth validation - basic check for reasonable date
export const dobSchema = z
    .string()
    .optional()
    .refine((val) => {
        if (!val || val.trim() === '') return true; // Allow empty
        const date = new Date(val);
        const now = new Date();
        const minDate = new Date(now.getFullYear() - 100, 0, 1); // 100 years ago
        const maxDate = new Date(now.getFullYear() - 16, now.getMonth(), now.getDate()); // 16 years ago
        return date >= minDate && date <= maxDate;
    }, 'Ngày sinh không hợp lệ (phải từ 16-100 tuổi)');

// Simple form schemas
export const profileEditSchema = z.object({
    fullname: nameSchema,
    email: emailSchema,
    phonenumber: phoneNumberSchema,
    address: addressSchema,
    dob: dobSchema,
    gender: z.enum(['Nam', 'Nữ', 'Khác']).optional(),
});

// Validation error handling helper
export const getValidationErrors = (error: z.ZodError): Record<string, string> => {
    const errors: Record<string, string> = {};
    error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
    });
    return errors;
};
