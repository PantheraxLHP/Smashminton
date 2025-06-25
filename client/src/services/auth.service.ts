import type { ForgotPasswordSchema, ResetPasswordSchema, SigninSchema } from '@/app/(auth)/auth.schema';
import { ServiceResponse } from '@/lib/serviceResponse';

export async function handleSignin(signinData: SigninSchema) {
    try {
        const response = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signinData),
            credentials: 'include',
        });

        const result = await response.json();

        if (!response.ok) {
            return ServiceResponse.error(result.message);
        }

        return ServiceResponse.success(result.data);
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Đăng nhập thất bại');
    }
}

export async function handleSignup(signupFormData: FormData) {
    try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            body: signupFormData,
            credentials: 'include',
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('Signup error:', result);
            return ServiceResponse.error(result.message || 'Đăng ký thất bại');
        }

        return ServiceResponse.success(result.data);
    } catch (error) {
        console.error('Signup error:', error);
        return ServiceResponse.error(error instanceof Error ? error.message : 'Đăng ký thất bại');
    }
}

export async function handleSignout() {
    try {
        const response = await fetch('/api/auth/signout', {
            method: 'POST',
            credentials: 'include',
        });
        const result = await response.json();

        if (!response.ok) {
            return ServiceResponse.error(result.message);
        }

        return ServiceResponse.success(null, 'Đăng xuất thành công');
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Đăng xuất thất bại');
    }
}

export async function handleForgotPassword(forgotPasswordData: ForgotPasswordSchema) {
    try {
        const response = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(forgotPasswordData),
            credentials: 'include',
        });

        const result = await response.json();

        if (!response.ok) {
            return ServiceResponse.error(result.message);
        }

        return ServiceResponse.success(result.data);
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Quên mật khẩu thất bại');
    }
}

export async function handleResetPassword(resetPasswordData: ResetPasswordSchema) {
    try {
        const response = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(resetPasswordData),
            credentials: 'include',
        });

        const result = await response.json();

        if (!response.ok) {
            return ServiceResponse.error(result.message);
        }

        return ServiceResponse.success(result.data);
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Đặt lại mật khẩu thất bại');
    }
}
