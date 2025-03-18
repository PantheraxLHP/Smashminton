import type { Metadata } from 'next';
import './globals.css';
import Footer from '@/components/atomic/Footer';
import Header from '@/components/atomic/Header';
import { menus } from '@/lib/menus';

type UserRole = keyof typeof menus;
const userRole: UserRole = (process.env.USER_ROLE as UserRole) || 'guest';

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
        <Header
          role={userRole.toUpperCase()}
          menuItems={menus[userRole]}
          showLoginButton={userRole === ('guest' as string)}
        />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
