// app/layout.tsx
import { AuthProvider } from '@/context/AuthContext';
import { BookingProvider } from '@/context/BookingContext';
import { WebSocketProvider } from '@/context/WebSocketContext';
import type { Metadata } from 'next';
import './globals.css';
import LayoutContent from './LayoutContent';

export const metadata: Metadata = {
    title: 'Smashminton',
    description: 'Smashminton Application',
    icons: {
        icon: '/logo.png',
        shortcut: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },
};
export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="vi, en" className="font-roboto">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </head>
            <body>
                <AuthProvider>
                    <WebSocketProvider>
                        <LayoutContent>{children}</LayoutContent>
                    </WebSocketProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
