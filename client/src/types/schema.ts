import { z } from 'zod';

// Define the schema for login
export const loginSchema = z.object({
    username: z.string().min(1, 'Vui lòng nhập tên đăng nhập'),
    password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

// Export the type for TypeScript usage
export type LoginSchema = z.infer<typeof loginSchema>;
