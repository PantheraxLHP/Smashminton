import { z } from 'zod';

// Common validation patterns
const phoneRegex = /^[0-9]{10,11}$/;
const vietnamesePhoneRegex = /^(0|\+84)[3-9][0-9]{8}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Base validation schemas
export const phoneNumberSchema = z
    .string()
    .min(1, 'Số điện thoại không được để trống')
    .regex(vietnamesePhoneRegex, 'Số điện thoại không hợp lệ (phải là số Việt Nam và có 10-11 chữ số)')
    .transform((val) => val.trim());

export const emailSchema = z
    .string()
    .min(1, 'Email không được để trống')
    .email('Email không hợp lệ')
    .max(255, 'Email quá dài')
    .transform((val) => val.trim().toLowerCase());

export const passwordSchema = z
    .string()
    .min(3, 'Mật khẩu phải có ít nhất 3 ký tự')
    .max(50, 'Mật khẩu không được quá 50 ký tự');

export const nameSchema = z
    .string()
    .min(1, 'Tên không được để trống')
    .max(255, 'Tên quá dài')
    .regex(/^[a-zA-ZÀ-ỹ\s]+$/, 'Tên chỉ được chứa chữ cái và khoảng trắng')
    .transform((val) => val.trim());

export const usernameSchema = z
    .string()
    .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
    .max(30, 'Tên đăng nhập không được quá 30 ký tự')
    .regex(/^[a-zA-Z0-9_]+$/, 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới')
    .transform((val) => val.trim());

export const addressSchema = z
    .string()
    .max(500, 'Địa chỉ quá dài')
    .optional()
    .transform((val) => val?.trim());

// For profile editing (more lenient)
export const dobSchema = z
    .string()
    .optional()
    .refine(
        (date) => {
            if (!date) return true;
            const dob = new Date(date);
            if (isNaN(dob.getTime())) return false;
            const today = new Date();
            const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
            const maxDate = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate());
            return dob >= minDate && dob <= maxDate;
        },
        {
            message: 'Ngày sinh không hợp lệ (độ tuổi phải từ 10 đến 100)',
        },
    );

// For signup (stricter - must be 16+)
export const signupDobSchema = z
    .string()
    .optional()
    .refine(
        (date) => {
            if (!date) return true;
            const dob = new Date(date);
            if (isNaN(dob.getTime())) return false;
            const today = new Date();
            const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
            const maxDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
            return dob >= minDate && dob <= maxDate;
        },
        {
            message: 'Ngày sinh không hợp lệ (độ tuổi phải từ 16 đến 100)',
        },
    );

export const priceSchema = z
    .number()
    .min(0, 'Giá không hợp lệ')
    .max(1000000000, 'Giá vượt quá giới hạn')
    .refine((val) => val >= 0, {
        message: 'Giá không hợp lệ. Vui lòng nhập giá lớn hơn hoặc bằng 0.',
    });

export const quantitySchema = z
    .number()
    .int('Số lượng phải là số nguyên')
    .min(1, 'Số lượng phải lớn hơn 0')
    .max(1000, 'Số lượng không được vượt quá 1000');

export const discountSchema = z.number().min(0, 'Giảm giá không hợp lệ').max(100, 'Giảm giá không được vượt quá 100%');

// Booking validation schemas
export const dateSchema = z
    .string()
    .min(1, 'Ngày không được để trống')
    .refine(
        (date) => {
            const selectedDate = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return selectedDate >= today;
        },
        {
            message: 'Ngày đặt sân không được trong quá khứ',
        },
    );

export const timeSchema = z
    .string()
    .min(1, 'Giờ không được để trống')
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Định dạng giờ không hợp lệ (HH:MM)');

export const durationSchema = z
    .number()
    .min(0.5, 'Thời lượng phải ít nhất 30 phút')
    .max(8, 'Thời lượng không được vượt quá 8 giờ')
    .refine((val) => val % 0.5 === 0, {
        message: 'Thời lượng phải là bội số của 30 phút',
    });

export const zoneSchema = z
    .string()
    .min(1, 'Vui lòng chọn khu vực sân')
    .regex(/^[1-9]\d*$/, 'Khu vực không hợp lệ');

// Payment validation schemas
export const paymentMethodSchema = z.enum(['momo', 'payos'], {
    errorMap: () => ({ message: 'Vui lòng chọn phương thức thanh toán hợp lệ' }),
});

export const customerPhoneSchema = z
    .string()
    .min(1, 'Số điện thoại khách hàng không được để trống')
    .regex(vietnamesePhoneRegex, 'Số điện thoại khách hàng không hợp lệ')
    .transform((val) => val.trim());

// File validation schemas
export const imageFileSchema = z
    .any()
    .refine((file) => file instanceof File, 'Vui lòng chọn một file')
    .refine((file) => file?.size <= 5 * 1024 * 1024, 'Kích thước file không được vượt quá 5MB')
    .refine(
        (file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file?.type),
        'File phải là định dạng ảnh (JPEG, PNG, WebP)',
    );

// Composite validation schemas for forms
export const bookingFiltersSchema = z.object({
    zone: zoneSchema,
    date: dateSchema,
    duration: durationSchema,
    startTime: timeSchema,
});

export const profileEditSchema = z.object({
    fullname: nameSchema.optional(),
    email: emailSchema.optional(),
    phonenumber: phoneNumberSchema.optional(),
    address: addressSchema,
    dob: dobSchema,
    gender: z.enum(['Nam', 'Nữ', 'Khác']).optional(),
});

export const passwordChangeSchema = z
    .object({
        newPassword: passwordSchema,
        confirmPassword: z.string().min(1, 'Xác nhận mật khẩu không được để trống'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Mật khẩu xác nhận không khớp',
        path: ['confirmPassword'],
    });

export const paymentFormSchema = z.object({
    customerPhone: customerPhoneSchema.optional(),
    paymentMethod: paymentMethodSchema,
    voucherId: z.string().optional(),
});

// Input sanitization helpers
export const sanitizeString = (input: string): string => {
    return input
        .trim()
        .replace(/[<>'"&]/g, '') // Remove potentially harmful characters
        .replace(/\s+/g, ' '); // Replace multiple spaces with single space
};

export const sanitizeNumber = (input: string | number): number | null => {
    const num = typeof input === 'string' ? parseFloat(input) : input;
    return isNaN(num) ? null : num;
};

export const sanitizeEmail = (email: string): string => {
    return email
        .trim()
        .toLowerCase()
        .replace(/[<>'"&]/g, '');
};

export const sanitizePhone = (phone: string): string => {
    return phone.replace(/[^\d+]/g, '').trim();
};

// Validation error handling helper
export const getValidationErrors = (error: z.ZodError): Record<string, string> => {
    const errors: Record<string, string> = {};
    error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
    });
    return errors;
};
