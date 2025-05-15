'use client';

import ProductPage from '@/app/products/page';
import BookingStepper from '../_components/BookingStepper';

const BookingProductPage = () => {
    return (
        <div>
            <div className="p-4">
                <BookingStepper currentStep={2} />
            </div>

            <ProductPage />
        </div>
    );
};

export default BookingProductPage;
