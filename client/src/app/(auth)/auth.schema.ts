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
        fullName: z.string().min(1, 'Vui lòng nhập họ và tên'),
        phoneNumber: z.string().regex(/^\d{10,11}$/, 'Số điện thoại phải có 10-11 chữ số'),
        birthDate: z.string().optional(),
        address: z.string().optional(),
        username: z.string().min(1, 'Vui lòng nhập tên đăng nhập'),
        password: z.string().min(1, 'Mật khẩu phải có ít nhất 1 ký tự'),
        repassword: z.string().min(1, 'Mật khẩu xác nhận phải có ít nhất 1 ký tự'),
    })
    .refine((data) => data.password === data.repassword, {
        message: 'Mật khẩu và mật khẩu xác nhận không khớp',
        path: ['repassword'], // Highlight the confirmPassword field
    });

// Export the type for TypeScript usage
export type SignupSchema = z.infer<typeof signupSchema>;
