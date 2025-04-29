'use client';

import Payment from '@/app/payment/page';
import BookingStep from '../_components/BookingStep';
import BookingNavigationButton from '../_components/BookingNavigationButton';

const BookingProductPage = () => {
    return (
        <div>
            <BookingStep currentStep={4} disableNavigation={false} />
            <BookingNavigationButton currentStep={4} />

            <Payment />
        </div>
    );
};

export default BookingProductPage;
