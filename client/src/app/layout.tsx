import { AuthProvider } from '@/context/AuthContext';
import type { Metadata } from 'next';
import './globals.css';
import ClientLayoutWrapper from './LayoutContent';

export const metadata: Metadata = {
    title: 'Smashminton',
    description: 'Smashminton Application',
    icons: {
        icon: '/icon.png',
        shortcut: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="vi,en" className="font-roboto">
            <body>
                <AuthProvider>
                    <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
                </AuthProvider>
            </body>
        </html>
    );
}
