'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { signupSchema, SignupSchema } from '../auth.schema';
import { useRouter } from 'next/navigation';
import { handleSignup } from '@/services/auth.service';

const SignupForm = () => {
    const [selectedFile, setSelectedFile] = useState<File[]>([]);
    const [isStudent, setIsStudent] = useState(false);
    const router = useRouter();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(Array.from(event.target.files).slice(0, 2));
        }
    };

    const handleRemoveFile = (index: number) => {
        setSelectedFile((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const form = useForm<SignupSchema>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            dob: '1990-01-01T00:00:00Z',
            phonenumber: undefined,
        },
    });

    const {
        handleSubmit,
        control,
        formState: { isSubmitting },
    } = form;

    const onSubmit = async (signupData: SignupSchema) => {
        const formData = new FormData();
        Object.entries(signupData).forEach(([key, value]) => {
            formData.append(key, value);
        });

        if (isStudent && selectedFile.length > 0) {
            selectedFile.forEach((file) => {
                formData.append('studentCard', file);
            });
        }

        const response = await handleSignup(formData);

        if (response.ok) {
            toast.success('Đăng ký thành công!');
            router.push('/signin');
        } else {
            toast.error('Đăng ký thất bại, vui lòng thử lại! ');
        }
    };

    return (
            <div
                className="
                    w-[95%] 
                    max-w-[600px] 
                    bg-white/90 
                    rounded-lg 
                    p-6 sm:p-8 
                    shadow-lg 
                    backdrop-blur-sm 
                    mt-5 mb-5

                    mx-auto 
                    lg:ml-[-30%] lg:mr-0 
                "
            >

            <h2 className="mb-6 text-center text-2xl font-semibold text-primary-600">Đăng ký thành viên</h2>

            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {[
                        { label: 'Tên đăng nhập*', name: 'username', type: 'text' },
                        { label: 'Mật khẩu*', name: 'password', type: 'password' },
                        { label: 'Xác nhận mật khẩu*', name: 'repassword', type: 'password' },
                        { label: 'Họ và Tên', name: 'fullname', type: 'text' },
                        { label: 'Ngày sinh', name: 'dob', type: 'date' },
                        { label: 'Số điện thoại', name: 'phonenumber', type: 'text' },
                        { label: 'Địa chỉ', name: 'address', type: 'text' },
                    ].map(({ label, name, type }, index) => (
                        <FormField
                            key={index}
                            control={control}
                            name={name as keyof SignupSchema}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{label}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type={type}
                                            placeholder={`Nhập ${label.toLowerCase()}`}
                                            {...field}
                                            value={field.value}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is-student"
                            checked={isStudent}
                            onChange={(e) => setIsStudent(e.target.checked)}
                            className="peer focus:ring-primary-500 h-4 w-4 border-gray-300 accent-green-600"
                        />
                        <label htmlFor="is-student" className="text-sm font-medium text-black">
                            Tôi là học sinh/sinh viên
                        </label>
                    </div>

                    {isStudent && (
                        <div className="mb-4">
                            <label className="mb-2 block text-sm font-medium text-black">
                                TẢI LÊN ẢNH THẺ HỌC SINH - SINH VIÊN ( Mặt trước và mặt sau )
                            </label>
                            <div className="flex flex-col gap-4">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="upload-file"
                                    multiple
                                />
                                <label
                                    htmlFor="upload-file"
                                    className="cursor-pointer rounded-md border border-gray-300 bg-gray-300 px-4 py-2 hover:bg-gray-100 hover:text-black"
                                >
                                    📂 Chọn ảnh
                                </label>

                                {selectedFile.length > 0 && (
                                    <div className="flex flex-wrap gap-4">
                                        {selectedFile.map((file, index) => (
                                            <div key={index} className="flex flex-col items-center">
                                                <Image
                                                    src={URL.createObjectURL(file)}
                                                    alt={`Ảnh ${index + 1}`}
                                                    width={100}
                                                    height={100}
                                                    className="rounded-md border border-gray-300 object-contain"
                                                />
                                                <button
                                                    onClick={() => handleRemoveFile(index)}
                                                    className="mt-1 rounded-md px-2 text-red-500 transition hover:bg-red-500 hover:text-white"
                                                >
                                                    x
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Đang xử lý...' : 'ĐĂNG KÝ'}
                    </Button>

                    <p className="mt-4 text-center text-sm text-black">
                        Bạn đã có tài khoản?{' '}
                        <Button asChild variant="link">
                            <Link href="/signin">Đăng nhập ngay</Link>
                        </Button>
                    </p>
                </form>
            </Form>
        </div>
    );
};

export default SignupForm;
