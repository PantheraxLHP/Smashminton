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
        fullname: z.string().optional(),
        dob: z.string().optional(),
        phonenumber: z.string()
            .regex(/^\d{10,11}$/, 'Số điện thoại phải có 10-11 chữ số')
            .optional(),
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
