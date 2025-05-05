'use client';

import RentalsPage from '@/app/rentals/page';
import BookingStepper from '../_components/BookingStepper';

const BookingProductPage = () => {
    return (
        <div>
            <BookingStepper currentStep={3} />

            <RentalsPage />
        </div>
    );
};

export default BookingProductPage;
