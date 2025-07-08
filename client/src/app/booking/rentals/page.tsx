'use client';

import RentalPage from '@/app/rentals/page';
import BookingStepper from '../_components/BookingStepper';

const BookingRentalPage = () => {
    return (
        <div>
            <div className="p-4">
                <BookingStepper currentStep={3} />
            </div>

            <RentalPage />
        </div>
    );
};

export default BookingRentalPage;
