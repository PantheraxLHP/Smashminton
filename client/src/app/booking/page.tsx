import { redirect } from 'next/navigation';

export default function BookingPage() {
    if (typeof window !== 'undefined') {
        window.location.href = '/booking/courts';
        return null;
    }
    redirect('/booking/courts');
}
