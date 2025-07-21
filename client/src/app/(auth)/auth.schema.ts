import { z } from 'zod';
import {
    usernameSchema,
    passwordSchema,
    emailSchema,
    nameSchema,
    phoneNumberSchema,
    addressSchema,
    signupDobSchema,
} from '@/lib/validation.schema';

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
        password: passwordSchema,
        repassword: passwordSchema,
        email: emailSchema,
        fullname: z
            .string()
            .optional()
            .refine(
                (value) => {
                    if (!value || value.trim() === '') return true;
                    try {
                        nameSchema.parse(value);
                        return true;
                    } catch {
                        return false;
                    }
                },
                {
                    message: 'Tên chỉ được chứa chữ cái và khoảng trắng',
                },
            ),
        dob: signupDobSchema,
        phonenumber: z
            .string()
            .optional()
            .refine(
                (value) => {
                    if (!value || value.trim() === '') return true;
                    try {
                        phoneNumberSchema.parse(value);
                        return true;
                    } catch {
                        return false;
                    }
                },
                {
                    message: 'Số điện thoại không hợp lệ (phải là số Việt Nam và có 10-11 chữ số)',
                },
            ),
        address: addressSchema,
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
