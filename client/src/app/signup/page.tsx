"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

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
        const fileInput = document.getElementById("upload-file") as HTMLInputElement;
        if (fileInput) {
            fileInput.value = "";
        }
    };

    return (
        <div className={`bg-gray-200 flex flex-col transition-all duration-300 ${showRoleSelection ? "min-h-[140vh]" : "min-h-screen"}`}>
            {/* Background section */}
            <div className="relative flex-1 flex items-center justify-center bg-black">
                <Image
                    src="/signupbg.png"
                    alt="Background Image"
                    fill
                    priority
                    className="absolute inset-0 w-full h-full object-cover opacity-100"
                />

                {/* Signup form */}
                <div className="absolute top-1/2 left-1/8 transform -translate-y-1/2 bg-white/90 p-8 rounded-lg shadow-lg w-[600px] ">
                    <h2 className="text-2xl font-semibold text-green-600 text-center mb-6">
                        Đăng ký thành viên
                    </h2>

                    <form className="space-y-4">
                        {["Họ và Tên", "Số điện thoại", "Ngày sinh", "Địa chỉ", "Mật khẩu", "Xác nhận mật khẩu"].map((label, index) => (
                            <div key={index} className="relative w-full">
                                <label className="absolute top-0 left-0 text-black text-sm">
                                    {label}
                                </label>
                                <input
                                    type={label.includes("Mật khẩu") ? "password" : "text"}
                                    className="w-full bg-transparent border-b border-gray-400 text-black/60 mt-3 focus:outline-none focus:border-green-400 leading-tight py-2"
                                />
                            </div>
                        ))}

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
                                className="w-5 h-5 accent-primary-500"
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
                                    className="border border-black p-4 rounded-md"
                                >
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">
                                            Tôi là:
                                        </label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center">
                                                <input type="radio" name="role" className="mr-2 accent-primary-500" /> Sinh viên
                                            </label>
                                            <label className="flex items-center">
                                                <input type="radio" name="role" className="mr-2 accent-primary-500" /> Học sinh
                                            </label>
                                        </div>
                                    </div>

                                    {/* Upload Student Card */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-black mb-2">
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
                                                className="px-4 py-2 border bg-gray-400 border-gray-300 rounded-md hover:bg-gray-100 hover:text-black cursor-pointer"
                                            >
                                                📂 Chọn ảnh
                                            </label>

                                            {/* Hiển thị tên file ảnh */}
                                            {selectedFile && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-500 text-sm">{selectedFile.name}</span>
                                                    <button
                                                        onClick={handleRemoveFile}
                                                        className="text-red-600 px-2 py-1 rounded-md hover:bg-red-600 hover:text-white transition"
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

                        <Button className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition">
                            ĐĂNG KÝ
                        </Button>

                        <p className="text-center text-sm text-black mt-4">
                            Bạn đã có tài khoản?{" "}
                            <Link href="/signin" className="text-black-600 font-semibold underline hover:text-green-600">
                                Đăng nhập ngay
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
