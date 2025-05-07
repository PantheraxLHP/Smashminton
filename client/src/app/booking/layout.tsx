'use client';

import { BookingProvider } from '@/context/BookingContext';
import { ReactNode } from 'react';

export default function BookingLayout({ children }: { children: ReactNode }) {
    return <BookingProvider>{children}</BookingProvider>;
}
