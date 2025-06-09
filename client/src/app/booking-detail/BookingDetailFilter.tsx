import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useState } from 'react';

const BookingDetailFilter = () => {
    const zones = ['A', 'B', 'C'];
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedZone, setSelectedZone] = useState<string>(zones[0]);

    return (
        <div className="w-full max-w-xs rounded-lg border p-4 shadow-md flex flex-col gap-5 h-full">
            <div className="flex flex-col gap-2">
                <span className="font-semibold text-lg">Chọn ngày</span>
                <div className="">
                    <div className="custom-calendar-wrapper">
                        <Calendar
                            value={selectedDate}
                            onChange={(value) => setSelectedDate(value as Date)}
                            locale="vi-VN"
                            minDate={new Date("2000-01-01")}
                            className="custom-calendar"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <span className="text-lg font-semibold">Chọn khu vực sân</span>
                <div className="grid grid-cols-3 gap-2">
                    {zones.map((zone) => (
                        <button
                            key={zone}
                            onClick={() => setSelectedZone(zone)}
                            className={`rounded-lg border px-3 py-1 text-sm ${selectedZone === zone
                                ? 'bg-primary-500 text-white'
                                : 'hover:bg-primary-200 cursor-pointer border-gray-300 bg-gray-100 text-gray-700'
                                } transition`}
                        >
                            Zone {zone}
                        </button>
                    ))}
                </div>
            </div>

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
}

export default BookingDetailFilter;