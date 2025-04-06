'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { handleSignin } from '@/services/auth.service';
import { signinSchema, SigninSchema } from '../auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function SigninForm() {
    const router = useRouter();

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

    const onSubmit = async (values: SigninSchema) => {
        const res = await handleSignin(values);
        if (res.success) {
            toast.success('Đăng nhập thành công!');
            router.push('/');
        } else {
            toast.error('Đăng nhập thất bại, vui lòng thử lại!');
        }
    };

    return (
        <div className="absolute top-2/5 left-1/8 w-[500px] -translate-y-1/2 transform rounded-lg bg-white/90 p-8 shadow-lg">
            <h2 className="text-primary-600 mb-6 text-center text-xl font-bold">Đăng nhập</h2>

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

                    <div className="hover:text-primary-600 text-right text-sm text-gray-500 underline">
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
