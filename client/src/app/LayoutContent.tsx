'use client';

import Footer from '@/components/atomic/Footer';
import Header from '@/components/atomic/Header';
import { Toaster } from '@/components/ui/sonner';
import { useAuth } from '@/context/AuthContext';
import { menus } from '@/lib/menus';

export default function LayoutContent({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, user } = useAuth();
    const userRole = (user?.role || 'guest') as keyof typeof menus; // Default to 'guest' if not logged in

    return (
        <>
            <Header role={userRole.toUpperCase()} menuItems={menus[userRole]} showLoginButton={!isAuthenticated} />
            <main className="min-h-screen">{children}</main>
            <Toaster richColors expand={false} position="bottom-right" />
            <Footer />
        </>
    );
}
