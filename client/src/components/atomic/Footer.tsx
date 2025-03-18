'use client';

import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="w-full bg-black py-6 text-white">
      <div className="container mx-auto flex flex-col items-center justify-between px-6 md:flex-row">
        {/* Logo Section */}
        <div>
          <Image src="/logo.png" alt="Logo" width={80} height={80} />
        </div>

        {/* Contact Information */}
        <div className="text-center md:text-left">
          <h3 className="text-base font-semibold">THÔNG TIN LIÊN HỆ</h3>
          <p>227 Đ. Nguyễn Văn Cừ, Phường 4, Quận 5, TP.HCM</p>
          <p>badmintonhub18@gmail.com</p>
          <p>+88015-88888-9999</p>
        </div>

        {/* Quick Links */}
        <div className="text-center md:text-left">
          <h3 className="text-base font-semibold">LIÊN KẾT NHANH</h3>
          <ul className="space-y-1">
            <li>
              <Link href="/faq" className="hover:text-gray-400">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-gray-400">
                Chính sách bảo mật
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-gray-400">
                Các điều khoản và điều kiện
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gray-400">
                Liên hệ
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
