'use client';

import RentalsPage from '@/app/rentals/page';
import BookingNavigationButton from '../_components/BookingNavigationButton';
import BookingStep from '../_components/BookingStep';

const BookingProductPage = () => {
    return (
        <div>
            <BookingStep currentStep={3} disableNavigation={false} />
            <BookingNavigationButton currentStep={3} />

            <RentalsPage />

        </div>
    );
};

export default BookingProductPage;
