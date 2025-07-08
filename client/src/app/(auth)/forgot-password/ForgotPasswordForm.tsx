'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { handleForgotPassword } from '@/services/auth.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { forgotPasswordSchema, ForgotPasswordSchema } from '../auth.schema';

const ForgotPasswordForm = () => {
    const form = useForm<ForgotPasswordSchema>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { input: '' },
    });

    const {
        handleSubmit,
        control,
        formState: { isSubmitting },
    } = form;

    const onSubmit = async (data: ForgotPasswordSchema) => {
        const response = await handleForgotPassword(data);
        if (response.ok) {
            toast.success('Nếu email/Tên đăng nhập tồn tại, hướng dẫn đặt lại mật khẩu đã được gửi!');
        } else {
            toast.error(response.message);
        }
    };

    return (
        <div className="flex min-h-[60vh] w-full items-center justify-center">
            <div className="w-full max-w-xl rounded-lg bg-white p-8 shadow-2xl">
                <h2 className="text-primary-600 mb-4 text-center text-3xl font-bold drop-shadow-sm">Quên mật khẩu</h2>
                <p className="mb-8 text-center text-base text-gray-600">
                    Xin chào, Bạn vui lòng nhập <span className="font-semibold">Tên đăng nhập hoặc Email</span> của mình
                    vào ô bên dưới, chúng tôi sẽ gửi cho Bạn một email kèm theo liên kết để Bạn có thể thay đổi mật khẩu
                    của mình.
                    <br />
                    Nếu gặp vấn đề liên quan đến đăng nhập vào hệ thống vui lòng liên hệ{' '}
                    <span className="font-semibold">support.smashminton@gmail.com</span>.
                </p>
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
                            <FormField
                                control={control}
                                name="input"
                                render={({ field }) => (
                                    <FormItem className="w-full sm:w-2/3">
                                        <div className="relative">
                                            <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
                                                <Mail size={18} />
                                            </span>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="Nhập email/Tên đăng nhập"
                                                    className="focus:border-primary-500 focus:ring-primary-500 rounded-md border-gray-500 py-3 pl-10 text-base"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" variant="outline" disabled={isSubmitting}>
                                {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default ForgotPasswordForm;
