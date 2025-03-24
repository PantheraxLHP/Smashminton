'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function SignInPage() {
    // useState phải nằm trong component
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // Ngăn chặn reload trang

        try {
            const response = await fetch('http://localhost:5555/api/login', {
                // Đổi URL phù hợp với backend của bạn
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, password }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Login successful:', data);
                // Lưu token nếu có
                localStorage.setItem('token', data.token);
                // Chuyển hướng sau khi đăng nhập thành công
                window.location.href = '/home';
            } else {
                setError(data.message || 'Đăng nhập thất bại');
            }
        } catch (error) {
            setError('Lỗi kết nối đến server');
            console.error('Error during login:', error);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-gray-200">
            {/* Background section */}
            <div className="relative flex flex-1 items-center justify-center bg-black">
                <Image
                    src="/loginbg.png"
                    alt="Badminton"
                    fill
                    priority
                    className="absolute inset-0 h-full w-full object-cover opacity-100"
                />

                {/* Login form */}
                <div className="absolute top-2/5 left-1/8 w-[500px] -translate-y-1/2 transform rounded-lg bg-white/90 p-8 shadow-lg">
                    <h2 className="mb-6 text-center text-xl font-bold text-green-600">Đăng nhập</h2>

                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Nhập số điện thoại</label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                            />
                        </div>

                        <div className="mb-1">
                            <label className="block text-sm font-medium text-gray-600">Nhập mật khẩu</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                            />
                        </div>

                        {error && <p className="text-sm text-red-500">{error}</p>}

                        <div className="mb-2 text-right underline">
                            <a href="#" className="text-sm text-gray-500 hover:text-green-600">
                                Quên mật khẩu?
                            </a>
                        </div>

                        <div className="mb-6 flex items-center justify-between">
                            <Button
                                type="submit"
                                className="w-full rounded-md bg-green-500 py-2 text-white transition hover:bg-green-600"
                            >
                                ĐĂNG NHẬP
                            </Button>
                        </div>

                        <p className="mt-4 text-center text-sm text-gray-600">
                            Bạn chưa có tài khoản?{' '}
                            <Link
                                href="/signup"
                                className="text-black-600 font-semibold underline hover:text-green-600"
                            >
                                Đăng ký ngay
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
