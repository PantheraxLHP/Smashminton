import { z } from 'zod';

// Define auth-specific required schemas (for registration/login)
const authEmailSchema = z
    .string()
    .min(1, 'Email không được để trống')
    .email('Email không hợp lệ')
    .transform((val) => val.trim().toLowerCase());

const authPasswordSchema = z.string().min(3, 'Mật khẩu phải có ít nhất 3 ký tự');

const authNameSchema = z
    .string()
    .max(100, 'Tên quá dài')
    .transform((val) => val.trim());

// Validation pattern for Vietnamese phone numbers
const vietnamesePhoneRegex = /^(0|\+84)[3-9][0-9]{8}$/;

const authAddressSchema = z
    .string()
    .optional()
    .transform((val) => val?.trim());

// Optional phone schema for signup (allows empty)
const signupPhoneNumberSchema = z
    .string()
    .optional()
    .refine((val) => {
        if (!val || val.trim() === '') return true; // Allow empty
        return vietnamesePhoneRegex.test(val.trim());
    }, 'Số điện thoại không hợp lệ')
    .transform((val) => val?.trim());

// Define missing schemas inline
const usernameSchema = z
    .string()
    .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
    .max(30, 'Tên đăng nhập không được quá 30 ký tự')
    .regex(/^[a-zA-Z0-9_]+$/, 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới')
    .transform((val) => val.trim());

const signupDobSchema = z
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

// Define the schema for login
export const signinSchema = z.object({
    username: usernameSchema,
    password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

// Export the type for TypeScript usage
export type SigninSchema = z.infer<typeof signinSchema>;

// Define the schema for signup
export const signupSchema = z
    .object({
        username: usernameSchema,
        password: authPasswordSchema,
        repassword: authPasswordSchema,
        email: authEmailSchema,
        fullname: authNameSchema.optional(),
        dob: signupDobSchema,
        phonenumber: signupPhoneNumberSchema,
        address: authAddressSchema.optional(),
        accounttype: z.string().optional(),
        studentCard: z.any().optional(),
    })
    .refine((data) => data.password === data.repassword, {
        message: 'Mật khẩu và mật khẩu xác nhận không khớp',
        path: ['repassword'],
    });

// Export the type for TypeScript usage
export type SignupSchema = z.infer<typeof signupSchema>;

// Forgot password schema
export const forgotPasswordSchema = z.object({
    input: z.string().min(1, 'Vui lòng nhập tên đăng nhập hoặc email'),
});

// Export the type for TypeScript usage
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

// Reset password schema
export const resetPasswordSchema = z
    .object({
        password: z.string().min(1, 'Mật khẩu phải có ít nhất 1 ký tự'),
        repassword: z.string().min(1, 'Mật khẩu xác nhận phải có ít nhất 1 ký tự'),
    })
    .refine((data) => data.password === data.repassword, {
        message: 'Mật khẩu và mật khẩu xác nhận không khớp',
        path: ['repassword'],
    });

// Export the type for TypeScript usage
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
