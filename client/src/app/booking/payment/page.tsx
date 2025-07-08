'use client';

import Payment from '@/app/payment/page';
import BookingStepper from '../_components/BookingStepper';

const BookingPaymentPage = () => {
    return (
        <div>
            <div className="p-4">
                <BookingStepper currentStep={4} />
            </div>
            <Payment />
        </div>
    );
};

export default BookingPaymentPage;
