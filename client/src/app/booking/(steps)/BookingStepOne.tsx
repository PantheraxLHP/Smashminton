import BookingFilter from '../(court-booking)/BookingFilter';
import BookingCourtList from '../(court-booking)/BookingCourtList';
import { Filters, SelectedCourt, CourtsWithPrice } from '../page';

interface BookingStepOneProps {
    courts: CourtsWithPrice[];
    selectedCourts: SelectedCourt[];
    filters: Filters;
    onFilterChange: (filters: Filters) => void;
    onToggleChange: (isFixed: boolean) => void;
    onAddCourt: (court: SelectedCourt) => void;
    onRemoveCourt: (court: SelectedCourt) => void;
}

export default function BookingStepOne({
    courts,
    selectedCourts,
    filters,
    onFilterChange,
    onToggleChange,
    onAddCourt,
    onRemoveCourt,
}: BookingStepOneProps) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap justify-center gap-4">
                <BookingFilter onFilterChange={onFilterChange} />
                <div className="flex-1">
                    <BookingCourtList
                        courts={courts}
                        selectedCourts={selectedCourts}
                        filters={filters}
                        onToggleChange={onToggleChange}
                        onAddCourt={onAddCourt}
                        onRemoveCourt={onRemoveCourt}
                    />
                </div>
            </div>
        </div>
    );
}
