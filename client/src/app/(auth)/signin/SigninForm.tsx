'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { handleSignin } from '@/services/auth.service';
import { signinSchema, SigninSchema } from '../auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function SigninForm() {
    const form = useForm<SigninSchema>({
        resolver: zodResolver(signinSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const {
        handleSubmit,
        control,
        formState: { isSubmitting },
    } = form;

    const onSubmit = async (signinData: SigninSchema) => {
        const response = await handleSignin(signinData);

        if (response.ok) {
            toast.success('Đăng nhập thành công!');
            await new Promise((resolve) => setTimeout(resolve, 300));
            window.location.reload();
            window.location.href = '/';
        } else {
            toast.error('Đăng nhập thất bại, vui lòng thử lại! ');
        }
    };

    return (
        <div className="absolute top-1/2 left-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white/90 p-6 shadow-xl backdrop-blur-sm sm:p-8 lg:left-[12.5%] lg:translate-x-0">
            <h2 className="text-primary-600 mb-6 text-center text-2xl font-bold">Đăng nhập</h2>

            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên đăng nhập</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nhập tên đăng nhập" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mật khẩu</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Nhập mật khẩu" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="text-right text-sm text-gray-500 underline hover:text-blue-600">
                        <a href="#">Quên mật khẩu?</a>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Đang xử lý...' : 'ĐĂNG NHẬP'}
                    </Button>

                    <p className="text-center text-sm text-gray-600">
                        Bạn chưa có tài khoản?{' '}
                        <Button asChild variant="link">
                            <Link href="/signup">Đăng ký ngay</Link>
                        </Button>
                    </p>
                </form>
            </Form>
        </div>
    );
}
