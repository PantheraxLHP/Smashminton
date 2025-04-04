'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSignIn } from '@/hooks/useSignIn';

export default function SignInForm() {
    const { username, setUsername, password, setPassword, error, formErrors, onSubmit } = useSignIn();

    return (
        <div className="absolute top-2/5 left-1/8 w-[500px] -translate-y-1/2 transform rounded-lg bg-white/90 p-8 shadow-lg">
            <h2 className="text-primary-600 mb-6 text-center text-xl font-bold">Đăng nhập</h2>

            <form onSubmit={onSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600">Tên đăng nhập</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                        }}
                        className={`mt-1 w-full rounded-md border px-4 py-2 focus:outline-none ${
                            formErrors.username
                                ? 'border-red-500'
                                : 'focus:ring-primary-500 border-gray-300 focus:ring-2'
                        }`}
                    />
                    {formErrors.username && <p className="mt-1 text-sm text-red-500">{formErrors.username}</p>}
                </div>

                <div className="mb-1">
                    <label className="block text-sm font-medium text-gray-600">Mật khẩu</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        className={`mt-1 w-full rounded-md border px-4 py-2 focus:outline-none ${
                            formErrors.password
                                ? 'border-red-500'
                                : 'focus:ring-primary-500 border-gray-300 focus:ring-2'
                        }`}
                    />
                    {formErrors.password && <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>}
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <div className="mb-2 text-right underline">
                    <a href="#" className="hover:text-primary-600 text-sm text-gray-500">
                        Quên mật khẩu?
                    </a>
                </div>

                <div className="mb-6 flex items-center justify-between">
                    <Button type="submit" className="w-full">
                        ĐĂNG NHẬP
                    </Button>
                </div>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Bạn chưa có tài khoản?{' '}
                    <Button asChild variant="link">
                        <Link href="/signup">Đăng ký ngay</Link>
                    </Button>
                </p>
            </form>
        </div>
    );
}
