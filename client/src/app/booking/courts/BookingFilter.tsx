import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Filters } from './page';
import { FeatureZone, getZones } from '@/services/zones.service';
import { zoneSchema, dateSchema, durationSchema, timeSchema, sanitizeString } from '@/lib/validation.schema';
import { toast } from 'sonner';

interface BookingFilterProps {
    filters: Filters;
    onFilterChange: (filters: Filters) => void;
    disableTimes: string[];
}

const BookingFilter: React.FC<BookingFilterProps> = ({ onFilterChange, filters, disableTimes }) => {
    const [zones, setZones] = useState<FeatureZone[]>([]);

    useEffect(() => {
        const fetchZones = async () => {
            const response = await getZones();
            if (response.ok) {
                setZones(response.data.zones);
            }
        };
        fetchZones();
    }, []);

    // Format YYYY-MM-DD
    const getLocalDateString = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // months are zero-based
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    // Helper functions to handle filter changes with validation
    const handleZoneChange = (zone: string) => {
        try {
            const validatedZone = zoneSchema.parse(sanitizeString(zone));
            onFilterChange({ ...filters, zone: validatedZone });
        } catch (error) {
            toast.error('Khu vực sân không hợp lệ');
        }
    };

    const handleDateChange = (date: Date) => {
        try {
            const dateString = getLocalDateString(date);
            const validatedDate = dateSchema.parse(dateString);
            onFilterChange({ ...filters, date: validatedDate });
        } catch (error) {
            toast.error('Ngày đặt sân không hợp lệ');
        }
    };

    const handleDurationChange = (duration: number) => {
        try {
            const validatedDuration = durationSchema.parse(duration);
            onFilterChange({ ...filters, duration: validatedDuration });
        } catch (error) {
            toast.error('Thời lượng đánh không hợp lệ');
        }
    };

    const handleStartTimeChange = (startTime: string) => {
        try {
            const validatedTime = timeSchema.parse(sanitizeString(startTime));
            onFilterChange({ ...filters, startTime: validatedTime });
        } catch (error) {
            toast.error('Giờ bắt đầu không hợp lệ');
        }
    };

    const durations = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
    const times = [
        '06:00',
        '06:30',
        '07:00',
        '07:30',
        '08:00',
        '08:30',
        '09:00',
        '09:30',
        '10:00',
        '10:30',
        '11:00',
        '11:30',
        '12:00',
        '12:30',
        '13:00',
        '13:30',
        '14:00',
        '14:30',
        '15:00',
        '15:30',
        '16:00',
        '16:30',
        '17:00',
        '17:30',
        '18:00',
        '18:30',
        '19:00',
        '19:30',
        '20:00',
        '20:30',
        '21:00',
        '21:30',
    ];

    return (
        <div className="w-full max-w-sm rounded-lg border bg-white p-4 shadow-md">
            {/* Chọn khu vực sân */}
            <div>
                <h3 className="text-sm font-semibold">Chọn khu vực sân</h3>
                <div className="mt-2 grid grid-cols-3 gap-2">
                    {zones.map((zone) => (
                        <button
                            key={zone.zoneid}
                            onClick={() => handleZoneChange(zone.zoneid.toString())}
                            className={`rounded-lg border px-3 py-1 text-sm ${
                                filters.zone === zone.zoneid.toString()
                                    ? 'bg-primary-500 text-white'
                                    : 'hover:bg-primary-200 cursor-pointer border-gray-300 bg-gray-100 text-gray-700'
                            } transition`}
                        >
                            {zone.zonename}
                        </button>
                    ))}
                </div>
            </div>

            <hr className="my-3" />

            {/* Chọn ngày đánh */}
            <div>
                <h3 className="text-sm font-semibold">Chọn ngày đánh</h3>
                <div className="mt-2">
                    <div className="custom-calendar-wrapper">
                        <Calendar
                            onChange={(value) => value && handleDateChange(value as Date)}
                            value={filters.date ? new Date(filters.date) : new Date()}
                            locale="vi-VN"
                            minDate={new Date()}
                            className="custom-calendar"
                        />
                    </div>
                </div>
            </div>

            <hr className="my-3" />

            {/* Chọn thời lượng */}
            <div>
                <h3 className="text-sm font-semibold">Chọn thời lượng đánh</h3>
                <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-2">
                    {durations.map((d) => (
                        <button
                            key={d}
                            onClick={() => handleDurationChange(d)}
                            className={`rounded-lg border px-3 py-1 text-sm ${
                                filters.duration === d
                                    ? 'bg-primary-500 text-white'
                                    : 'hover:bg-primary-200 cursor-pointer border-gray-300 bg-gray-100 text-gray-700'
                            } transition`}
                        >
                            {d}h
                        </button>
                    ))}
                </div>
            </div>

            <hr className="my-3" />

            {/* Chọn giờ bắt đầu */}
            <div>
                <h3 className="text-sm font-semibold">Chọn giờ bắt đầu</h3>
                <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {times.map((time) => {
                        // Determine if disableTimes is loaded (not empty)
                        const disableTimesLoaded = Array.isArray(disableTimes) && disableTimes.length > 0;
                        // If not loaded, disable all times. If loaded, only disable those in disableTimes
                        const isDisabled = !disableTimesLoaded || disableTimes.includes(time);
                        return (
                            <button
                                key={time}
                                onClick={() => handleStartTimeChange(time)}
                                disabled={isDisabled}
                                className={`rounded-lg border px-3 py-1 text-sm ${
                                    isDisabled
                                        ? 'cursor-not-allowed bg-gray-200 text-gray-400 line-through'
                                        : filters.startTime === time
                                          ? 'bg-primary-500 text-white'
                                          : 'hover:bg-primary-200 cursor-pointer border-gray-300 bg-gray-100 text-gray-700'
                                } transition`}
                            >
                                {time}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* CSS Custom */}
            <style>
                {`
					/* Custom Calendar */
					.custom-calendar-wrapper {
						width: 100%;
						max-width: 100%;
						overflow-x: auto; /* Allow horizontal scrolling on small screens */
					}

					.custom-calendar {
						width: 100%;
						max-width: 100%;
						border: none;
						background-color: white;
						border-radius: 8px;
					}

					 /* Ensure calendar tiles are squares */
					.custom-calendar .react-calendar__tile {
						aspect-ratio: 1 / 1; /* Maintain square shape */
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 0.875rem;
					}

					@media (max-width: 480px) {
						.custom-calendar .react-calendar__tile {
							font-size: 0.75rem;
						}
					}

					/* Ngày được chọn */
					.custom-calendar .react-calendar__tile--active {
						background: #16a34a !important; /* Xanh lá đậm */
						color: white !important;
						border-radius: 6px;
					}

					/* Hôm nay */
					.custom-calendar .react-calendar__tile--now {
						background: #bbf7d0 !important; /* Xanh lá nhạt hơn */
						color: black !important;
						border-radius: 6px;
					}

					/* Hôm nay + Được chọn */
					.custom-calendar .react-calendar__tile--now.react-calendar__tile--active {
						background: linear-gradient(135deg, #16a34a 50%, #bbf7d0 50%) !important; /* Hiệu ứng chuyển màu */
						color: black !important;
						border-radius: 6px;
					}

					/* Ngày bị disable */
					.custom-calendar .react-calendar__tile:disabled {
						color: #d1d5db !important;
					}
				`}
            </style>
        </div>
    );
};

export default BookingFilter;
