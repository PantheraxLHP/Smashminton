'use client';

import Footer from '@/components/atomic/Footer';
import Header from '@/components/atomic/Header';
import { Toaster } from '@/components/ui/sonner';
import { useAuth } from '@/context/AuthContext';
import { menus } from '@/lib/menus';
import Loading from './loading';

export default function LayoutContent({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, user, isLoading } = useAuth();

    // Nếu đang loading, render component Loading
    if (isLoading || isAuthenticated === undefined) {
        return <Loading />;
    }

    const userRole = (user?.role || 'guest') as keyof typeof menus;

    return (
        <>
            <Header
                role={isAuthenticated ? userRole.toUpperCase() : 'GUEST'}
                menuItems={menus[isAuthenticated ? userRole : 'guest']}
                showLoginButton={!isAuthenticated}
            />
            <main className="min-h-screen w-full">{children}</main>
            <Toaster richColors expand={false} position="top-left" closeButton />
            <Footer />
        </>
    );
}
