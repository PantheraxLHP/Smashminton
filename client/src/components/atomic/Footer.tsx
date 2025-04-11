import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="w-full bg-black py-6 text-white">
            <div className="container mx-auto flex flex-col items-center justify-between gap-8 px-4 sm:px-6 md:flex-row md:gap-4">
                {/* Logo Section */}
                <div className="flex flex-col items-center md:items-start">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={80}
                        height={80}
                        style={{ width: 'auto', height: 'auto' }}
                        className="mb-4 md:mb-0"
                    />
                </div>

                {/* Contact Information */}
                <div className="text-center md:text-left">
                    <h3 className="mb-3 text-base font-semibold">THÔNG TIN LIÊN HỆ</h3>
                    <div className="space-y-2">
                        <p className="text-sm sm:text-base">227 Đ. Nguyễn Văn Cừ, Phường 4, Quận 5, TP.HCM</p>
                        <p className="text-sm sm:text-base">badmintonhub18@gmail.com</p>
                        <p className="text-sm sm:text-base">+88015-88888-9999</p>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="text-center md:text-left">
                    <h3 className="mb-3 text-base font-semibold">LIÊN KẾT NHANH</h3>
                    <ul className="space-y-2">
                        <li>
                            <Link href="/faq" className="text-sm hover:text-gray-400 sm:text-base">
                                FAQ
                            </Link>
                        </li>
                        <li>
                            <Link href="/privacy-policy" className="text-sm hover:text-gray-400 sm:text-base">
                                Chính sách bảo mật
                            </Link>
                        </li>
                        <li>
                            <Link href="/terms" className="text-sm hover:text-gray-400 sm:text-base">
                                Các điều khoản và điều kiện
                            </Link>
                        </li>
                        <li>
                            <Link href="/contact" className="text-sm hover:text-gray-400 sm:text-base">
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
