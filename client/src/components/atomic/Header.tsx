'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, User } from 'lucide-react';
import { Button } from '../ui/button';
import { redirect } from 'next/dist/server/api-utils';
import { handleSignout } from '@/services/auth.service';

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

    const handleMenuClick = (label: string) => {
        setOpenMenu(openMenu === label ? null : label);
    };

    return (
        <div className="container mx-auto max-w-full">
            {/* Main Header */}
            <header className="flex items-center justify-between bg-black p-4 text-white">
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

                {/* Navigation */}
                <div className="hidden w-full max-w-lg justify-between md:flex">
                    <nav className="flex w-full justify-between">
                        {menuItems &&
                            menuItems.map((item, index) => (
                                <div key={index} className="relative">
                                    {item.subMenu ? (
                                        <button
                                            onClick={() => handleMenuClick(item.label)}
                                            className={`flex cursor-pointer items-center gap-1 ${openMenu === item.label ? 'border-primary-500 border-b-2' : ''}`}
                                        >
                                            {item.label}
                                            <ChevronDown className="h-4 w-4 transition-transform duration-300" />
                                        </button>
                                    ) : (
                                        <Link href={item.link || '#'} className="hover:text-gray-400">
                                            {item.label}
                                        </Link>
                                    )}
                                </div>
                            ))}
                    </nav>
                </div>

                <Button onClick={handleSignout}>Đăng xuất</Button>
                {showLoginButton ? (
                    <Button asChild>
                        <Link href="/signin">Đăng nhập</Link>
                    </Button>
                ) : (
                    <div className="rounded-full bg-white p-2">
                        <User className="text-primary-500" size={20} />
                    </div>
                )}
            </header>

            {/* Submenu (Expanding Below Header) */}
            {menuItems &&
                menuItems.map(
                    (item, index) =>
                        item.subMenu &&
                        openMenu === item.label && (
                            <div key={index} className="flex justify-center gap-6 bg-gray-100 p-4 shadow-md">
                                {item.subMenu.map((sub, i) => (
                                    <Link key={i} href={sub.link || '#'} className="hover:text-primary-600">
                                        {sub.label}
                                    </Link>
                                ))}
                            </div>
                        ),
                )}
        </div>
    );
}
