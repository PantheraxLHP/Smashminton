'use client';

import ProductPage from '@/app/products/page';
import BookingStepper from '../_components/BookingStepper';

const BookingProductPage = () => {
    return (
        <div>
            <BookingStepper currentStep={2} />

            <ProductPage />
        </div>
    );
};

export default BookingProductPage;
