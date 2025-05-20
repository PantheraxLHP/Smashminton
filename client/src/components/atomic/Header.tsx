import { ChevronDown, Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../ui/button';
import ProfileIcon from './ProfileIcon';

interface MenuItem {
    label: string;
    link?: string;
    subMenu?: MenuItem[];
}

interface HeaderProps {
    role: string;
    menuItems: MenuItem[];
    showLoginButton?: boolean;
}

export default function Header({ menuItems = [], showLoginButton }: HeaderProps) {
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const handleMenuClick = (label: string) => {
        setOpenMenu(openMenu === label ? null : label);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        setOpenMenu(null);
    };

    const isActive = (link: string | undefined) => {
        if (!link) return false;
        return pathname.startsWith(link);
    };

    return (
        <div className="sticky top-0 z-50 w-full">
            {/* Main Header */}
            <header className="flex items-center justify-between bg-black p-4 text-white">
                {/* Mobile Menu Button */}
                <button className="md:hidden" onClick={toggleMobileMenu} aria-label="Toggle menu">
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>

                {/* Logo */}
                <div className="flex items-center">
                    <Link href="/" className="rounded hover:bg-gray-800">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={40}
                            height={40}
                            style={{ width: 'auto', height: 'auto' }}
                        />
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden w-full max-w-lg justify-between md:flex">
                    <nav className="flex w-full justify-between">
                        {menuItems.map((item, index) => (
                            <div key={index} className="relative">
                                {item.subMenu ? (
                                    <button
                                        onClick={() => handleMenuClick(item.label)}
                                        className={`flex cursor-pointer items-center gap-1 hover:text-gray-400 ${
                                            openMenu === item.label ? 'border-primary-500 border-b-2' : ''
                                        }`}
                                    >
                                        {item.label}
                                        <ChevronDown className="h-4 w-4 transition-transform duration-300" />
                                    </button>
                                ) : (
                                    <Link
                                        href={item.link || '#'}
                                        className={`hover:text-gray-400 ${
                                            isActive(item.link) ? 'border-b-2 border-green-500' : ''
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>

                {/* Auth Button */}
                <div className="flex md:block">
                    {showLoginButton ? (
                        <Button asChild className="md:w-auto">
                            <Link href="/signin">Đăng nhập</Link>
                        </Button>
                    ) : (
                        <ProfileIcon />
                    )}
                </div>
            </header>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="bg-black md:hidden">
                    <nav className="flex flex-col space-y-4 bg-gray-800 p-4">
                        {menuItems.map((item, index) => (
                            <div key={index}>
                                {item.subMenu ? (
                                    <div>
                                        <button
                                            onClick={() => handleMenuClick(item.label)}
                                            className="flex w-full items-center justify-between text-white"
                                        >
                                            {item.label}
                                            <ChevronDown className="h-4 w-4" />
                                        </button>
                                        {openMenu === item.label && (
                                            <div className="mt-2 ml-4 flex flex-col space-y-2">
                                                {item.subMenu.map((sub, i) => (
                                                    <Link
                                                        key={i}
                                                        href={sub.link || '#'}
                                                        className="text-gray-300 hover:text-white"
                                                    >
                                                        {sub.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link
                                        href={item.link || '#'}
                                        className={`block text-white hover:text-gray-300 ${
                                            isActive(item.link) ? 'border-b-2 border-green-500' : ''
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>
            )}
        </div>
    );
}
