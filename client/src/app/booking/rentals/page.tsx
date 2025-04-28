'use client'

import BookingStep from "../(court-booking)/BookingStep";
import BookingNavigationButton from "../(court-booking)/BookingNavigationButton";

const BookingRentalPage = () => {
    return (
        <div>
            <BookingStep currentStep={3} disableNavigation={false} />

            <div>
                <h1>Booking Rental Page </h1>
                <p> This is the booking rental page.</p>
            </div>

            <BookingNavigationButton currentStep={3} />
        </div>
    )
}

export default BookingRentalPage;