'use client';
import BookingDetailFilter from "./BookingDetailFilter";
import BookingDetailCourtList from "./BookingDetailCourtList";

const BookingDetailPage = () => {

    return (
        <div className="flex flex-col sm:flex-row items-center sm:items-start p-4 gap-4">
            <BookingDetailFilter />
            <BookingDetailCourtList />
        </div>
    );
}

export default BookingDetailPage;