import { z } from 'zod';

// Define the schema for login
export const signinSchema = z.object({
    username: z.string().min(1, 'Vui lòng nhập tên đăng nhập'),
    password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

// Export the type for TypeScript usage
export type SigninSchema = z.infer<typeof signinSchema>;

// Define the schema for signup
export const signupSchema = z
    .object({
        username: z.string().min(1, 'Vui lòng nhập tên đăng nhập'),
        password: z.string().min(1, 'Mật khẩu phải có ít nhất 1 ký tự'),
        repassword: z.string().min(1, 'Mật khẩu xác nhận phải có ít nhất 1 ký tự'),
        email: z.string().email('Email không hợp lệ'),
        fullname: z.string().optional(),
        dob: z
            .string()
            .optional()
            .refine(
                (date) => {
                    if (!date) return true;
                    const dob = new Date(date);
                    if (isNaN(dob.getTime())) return false;
                    const today = new Date();
                    const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate()); // 100 tuổi
                    const maxDate = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate()); // 10 tuổi
                    return dob >= minDate && dob <= maxDate;
                },
                {
                    message: 'Ngày sinh không hợp lệ (độ tuổi phải từ 10 đến 100)',
                },
            ),
        phonenumber: z.string().optional(),
        address: z.string().optional(),
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
