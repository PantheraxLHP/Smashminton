import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function SignUp() {
    return (
        <div className="bg-gray-200 min-h-screen flex flex-col">
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
                <div className="absolute top-1/2 left-1/8 transform -translate-y-1/2 bg-white/90 p-8 rounded-lg shadow-lg w-[600px]">
                    <h2 className="text-2xl font-semibold text-green-600 text-center mb-6">
                        Đăng ký thành viên
                    </h2>

                    <form className="space-y-4">
                        {/** Custom Input Fields **/}
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

                        {/* Role Selection */}
                        <div className="border-1 border-black p-4 rounded-md">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-600 mb-2">Tôi là:</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center">
                                        <input type="radio" name="role" className="mr-2" /> Sinh viên
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="role" className="mr-2" /> Học sinh
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="role" className="mr-2" /> Không
                                    </label>
                                </div>
                            </div>

                            {/* Upload Student Card */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-black mb-2">TẢI LÊN ẢNH THẺ HỌC SINH - SINH VIÊN</label>
                                <div className="flex items-center gap-4">
                                    <Button className="px-4 py-2 border bg-gray-400 border-gray-300 rounded-md hover:bg-gray-100 hover:text-black">
                                        📂 Chọn ảnh
                                    </Button>
                                    <span className="text-gray-500 text-sm">Chưa có tệp nào được chọn</span>
                                </div>
                            </div>
                        </div>

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
