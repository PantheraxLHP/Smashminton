import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Smashminton',
  description: 'Smashminton Application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi,en">
      <body>
        <main className="font-roboto min-h-screen">{children}</main>
      </body>
    </html>
  );
}
