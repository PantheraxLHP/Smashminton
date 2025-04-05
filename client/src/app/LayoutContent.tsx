'use client';

import Footer from '@/components/atomic/Footer';
import Header from '@/components/atomic/Header';
import { Toaster } from '@/components/ui/sonner';
import { useAuth } from '@/context/AuthContext';
import { menus } from '@/lib/menus';
import './globals.css';
import { usePathname } from 'next/navigation';

function LayoutContent({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated } = useAuth();
    const userRole = (user?.role || 'guest') as keyof typeof menus; // Mặc định là 'guest' nếu chưa đăng nhập
    console.log('User:', user); // Debugging line

    return (
        <>
            <Header role={userRole.toUpperCase()} menuItems={menus[userRole]} showLoginButton={!isAuthenticated} />
            <main className="min-h-screen">{children}</main>
            <Toaster richColors expand={false} position="bottom-right" />
            <Footer />
        </>
    );
}

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname(); // Get the current route

    return <LayoutContent key={pathname}>{children}</LayoutContent>;
}
