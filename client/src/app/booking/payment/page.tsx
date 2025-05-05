'use client';

import Payment from '@/app/payment/page';
import BookingStepper from '../_components/BookingStepper';

const BookingProductPage = () => {
    return (
        <div>
            <BookingStepper currentStep={4} />
            <Payment />
        </div>
    );
};

export default BookingProductPage;
