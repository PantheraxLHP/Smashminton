'use client'

import BookingStep from "../(court-booking)/BookingStep";
import BookingNavigationButton from "../(court-booking)/BookingNavigationButton";

const BookingProductPage = () => {
    return (
        <div>
            <BookingStep currentStep={2} disableNavigation={false} />

            <div>
                <h1>Booking Product Page </h1>
                <p> This is the booking product page.</p>
            </div>

            <BookingNavigationButton currentStep={2} />
        </div>
    )
}

export default BookingProductPage;