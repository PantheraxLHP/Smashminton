"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from 'next/image';

export default function SignInPage() {
  // useState phải nằm trong component
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Ngăn chặn reload trang

    try {
      const response = await fetch("http://localhost:5555/api/login", { // Đổi URL phù hợp với backend của bạn
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);
        // Lưu token nếu có
        localStorage.setItem("token", data.token);
        // Chuyển hướng sau khi đăng nhập thành công
        window.location.href = "/home";
      } else {
        setError(data.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      setError("Lỗi kết nối đến server");
      console.error("Error during login:", error);
    }
  };

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
        <div className="absolute top-2/5 left-1/8 transform -translate-y-1/2 bg-white/90 p-8 rounded-lg shadow-lg w-[500px]">
          <h2 className="text-xl font-bold text-green-600 text-center mb-6">Đăng nhập</h2>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">Nhập số điện thoại</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="mb-1">
              <label className="block text-sm font-medium text-gray-600">Nhập mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="text-right mb-2 underline">
              <a href="#" className="text-sm text-gray-500 hover:text-green-600">
                Quên mật khẩu?
              </a>
            </div>

            <div className="flex justify-between items-center mb-6">
              <Button type="submit" className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition">
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
