import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from 'next/image';

export default function SignInPage() {
  return (
    <div className="bg-gray-200 min-h-screen flex flex-col">
      {/* Background section */}
      <div className="relative flex-1 flex items-center justify-center bg-black">
        <Image
          src="/loginbg.png"
          alt="Badminton"
          fill
          priority
          className="absolute inset-0 w-full h-full object-cover opacity-100"
        />

        {/* Login form */}
        <div className="absolute top-2/5 left-1/8 transform -translate-y-1/2 bg-white/90 p-8 rounded-lg shadow-lg w-[500px] ">
          <h2 className="text-xl font-bold text-green-600 text-center mb-6">Đăng nhập</h2>

          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">Nhập số điện thoại</label>
              <input
                type="text"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="mb-1">
              <label className="block text-sm font-medium text-gray-600">Nhập mật khẩu</label>
              <input
                type="password"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="text-right mb-2 underline">
              <a href="#" className="text-sm text-gray-500 hover:text-green-600">
                Quên mật khẩu?
              </a>
            </div>

            <div className="flex justify-between items-center mb-6">
              <Button className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition">
                ĐĂNG NHẬP
              </Button>
            </div>

            <p className="text-center text-sm text-gray-600 mt-4">
              Bạn chưa có tài khoản?{" "}
              <Link href="/signup" className="text-black-600 font-semibold underline hover:text-green-600">
                Đăng ký ngay
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
