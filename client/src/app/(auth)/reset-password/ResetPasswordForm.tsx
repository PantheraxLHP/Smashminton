'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { handleResetPassword } from '@/services/auth.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { resetPasswordSchema, ResetPasswordSchema } from '../auth.schema';

const ResetPasswordForm = () => {
    const form = useForm<ResetPasswordSchema>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { password: '', repassword: '' },
    });

    const token = useSearchParams().get('token') || '';
    const router = useRouter();
    const {
        handleSubmit,
        control,
        formState: { isSubmitting },
    } = form;

    const onSubmit = async (data: ResetPasswordSchema) => {
        const response = await handleResetPassword(data, token);
        if (response.ok) {
            toast.success('Mật khẩu đã được đặt lại thành công!');
            router.push('/signin');
        } else {
            toast.error(response.message);
        }
    };

    return (
        <div className="flex min-h-[60vh] w-full items-center justify-center">
            <div className="w-full max-w-xl rounded-lg bg-white p-8 shadow-2xl">
                <h2 className="text-primary-600 mb-4 text-center text-3xl font-bold drop-shadow-sm">
                    Đặt lại mật khẩu
                </h2>
                <p className="mb-8 text-center text-base text-gray-600">
                    Vui lòng nhập mật khẩu mới cho tài khoản của bạn. Hãy chắc chắn rằng mật khẩu đủ mạnh và bạn sẽ nhớ
                    nó!
                </p>
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mật khẩu mới</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Nhập mật khẩu mới" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="repassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Xác nhận mật khẩu</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Nhập lại mật khẩu mới" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default ResetPasswordForm;
