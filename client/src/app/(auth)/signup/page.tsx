'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function SignUp() {
    const [showRoleSelection, setShowRoleSelection] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        // Reset input file bằng cách tạo một tham chiếu đến input và reset nó
        const fileInput = document.getElementById('upload-file') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    return (
        <div
            className={`flex flex-col bg-gray-200 transition-all duration-300 ${showRoleSelection ? 'min-h-[140vh]' : 'min-h-screen'}`}
        >
            {/* Background section */}
            <div className="relative flex flex-1 items-center justify-center bg-black">
                <Image
                    src="/signupbg.png"
                    alt="Background Image"
                    fill
                    priority
                    className="absolute inset-0 h-full w-full object-cover opacity-100"
                />

                {/* Signup form */}
                <div className="absolute top-1/2 left-1/8 w-[600px] -translate-y-1/2 transform rounded-lg bg-white/90 p-8 shadow-lg">
                    <h2 className="text-primary-600 mb-6 text-center text-2xl font-semibold">Đăng ký thành viên</h2>

                    <form className="space-y-4">
                        {['Họ và Tên', 'Số điện thoại', 'Ngày sinh', 'Địa chỉ', 'Mật khẩu', 'Xác nhận mật khẩu'].map(
                            (label, index) => (
                                <div key={index} className="relative w-full">
                                    <label className="absolute top-0 left-0 text-sm text-black">{label}</label>
                                    <input
                                        type={label.includes('Mật khẩu') ? 'password' : 'text'}
                                        className="focus:border-primary-400 mt-3 w-full border-b border-gray-400 bg-transparent py-2 leading-tight text-black/60 focus:outline-none"
                                    />
                                </div>
                            ),
                        )}

                        {/* Checkbox để hiển thị role selection */}
                        <div className="flex items-center gap-2">
                            <label htmlFor="toggleRoleSelection" className="text-black">
                                Học sinh / sinh viên
                            </label>
                            <input
                                type="checkbox"
                                id="toggleRoleSelection"
                                checked={showRoleSelection}
                                onChange={() => setShowRoleSelection(!showRoleSelection)}
                                className="accent-primary-500 h-5 w-5"
                            />
                        </div>

                        {/* Hiệu ứng xuất hiện với Framer Motion */}
                        <AnimatePresence>
                            {showRoleSelection && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="rounded-md border border-black p-4"
                                >
                                    <div className="mb-4">
                                        <label className="mb-2 block text-sm font-medium text-gray-600">Tôi là:</label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center">
                                                <input type="radio" name="role" className="accent-primary-500 mr-2" />{' '}
                                                Sinh viên
                                            </label>
                                            <label className="flex items-center">
                                                <input type="radio" name="role" className="accent-primary-500 mr-2" />{' '}
                                                Học sinh
                                            </label>
                                        </div>
                                    </div>

                                    {/* Upload Student Card */}
                                    <div className="mb-4">
                                        <label className="mb-2 block text-sm font-medium text-black">
                                            TẢI LÊN ẢNH THẺ HỌC SINH - SINH VIÊN
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                id="upload-file"
                                            />
                                            <label
                                                htmlFor="upload-file"
                                                className="cursor-pointer rounded-md border border-gray-300 bg-gray-400 px-4 py-2 hover:bg-gray-100 hover:text-black"
                                            >
                                                📂 Chọn ảnh
                                            </label>

                                            {/* Hiển thị tên file ảnh */}
                                            {selectedFile && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-500">{selectedFile.name}</span>
                                                    <button
                                                        onClick={handleRemoveFile}
                                                        className="rounded-md px-2 py-1 text-red-600 transition hover:bg-red-600 hover:text-white"
                                                    >
                                                        X
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Hiển thị ảnh đã chọn */}
                                        {selectedFile && (
                                            <div className="mt-4">
                                                <Image
                                                    src={URL.createObjectURL(selectedFile)}
                                                    alt="Ảnh đã chọn"
                                                    width={200}
                                                    height={200}
                                                    className="rounded-md border border-gray-300"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <Button className="w-full">ĐĂNG KÝ</Button>

                        <p className="mt-4 text-center text-sm text-black">
                            Bạn đã có tài khoản?{' '}
                            <Button asChild variant="link">
                                <Link href="/signin">Đăng nhập ngay</Link>
                            </Button>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
