import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface Filters {
    zone?: string;
    date?: string;
    duration?: number;
    startTime?: string;
    fixedCourt?: boolean;
}

interface BookingFilterProps {
    onFilterChange: (filters: Filters) => void;
}

const BookingFilter: React.FC<BookingFilterProps> = ({ onFilterChange }) => {
    const [selectedZone, setSelectedZone] = useState('A');
    const [date, setDate] = useState(new Date());
    const [duration, setDuration] = useState(2);
    const [startTime, setStartTime] = useState('09:00');

    // Format YYYY-MM-DD
    const getLocalDateString = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // months are zero-based
        const day = String(date.getDate()).padStart(2, '0');
      
        return `${year}-${month}-${day}`;
      }

    // Cập nhật filters và gửi về BookingPage
    useEffect(() => {
        const filters: Filters = {
            zone: selectedZone,
            date: getLocalDateString(date), 
            duration,
            startTime,
        };
        onFilterChange(filters);
    }, [selectedZone, date, duration, startTime, onFilterChange]);

    const zones = ['A', 'B', 'C'];
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
    const disabledTimes = ['08:30', '12:30', '15:30', '18:30']; // Giờ bị disable

    return (
        <div className="w-full max-w-sm rounded-lg border bg-white p-4 shadow-md">
            {/* Chọn khu vực sân */}
            <div>
                <h3 className="text-sm font-semibold">Chọn khu vực sân</h3>
                <div className="mt-2 grid grid-cols-3 gap-2">
                    {zones.map((zone) => (
                        <button
                            key={zone}
                            onClick={() => setSelectedZone(zone)}
                            className={`rounded-lg border px-3 py-1 text-sm ${
                                selectedZone === zone
                                    ? 'bg-primary-500 text-white'
                                    : 'hover:bg-primary-200 cursor-pointer border-gray-300 bg-gray-100 text-gray-700'
                            } transition`}
                        >
                            Zone {zone}
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
                            onChange={(value) => value && setDate(value as Date)}
                            value={date}
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
                            onClick={() => setDuration(d)}
                            className={`rounded-lg border px-3 py-1 text-sm ${
                                duration === d
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
                    {times.map((time) => (
                        <button
                            key={time}
                            onClick={() => setStartTime(time)}
                            disabled={disabledTimes.includes(time)}
                            className={`rounded-lg border px-3 py-1 text-sm ${
                                disabledTimes.includes(time)
                                    ? 'cursor-not-allowed bg-gray-200 text-gray-400 line-through'
                                    : startTime === time
                                      ? 'bg-primary-500 text-white'
                                      : 'hover:bg-primary-200 cursor-pointer border-gray-300 bg-gray-100 text-gray-700'
                            } transition`}
                        >
                            {time}
                        </button>
                    ))}
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
