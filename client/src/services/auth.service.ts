import type { SigninSchema } from '@/app/(auth)/auth.schema';
import { ServiceResponse } from '@/lib/serviceResponse';

export async function handleSignin(signinData: SigninSchema) {
    try {
        const response = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
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

export async function handleSignout() {
    try {
        const response = await fetch('/api/auth/signout', {
            method: 'POST',
            credentials: 'include',
        });

        if (!response.ok) {
            return ServiceResponse.error('Đăng xuất thất bại');
        }

        return ServiceResponse.success(null, 'Đăng xuất thành công');
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Đăng xuất thất bại');
    }
}
