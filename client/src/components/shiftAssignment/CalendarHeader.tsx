import { DateRange } from 'react-day-picker';

interface CalendarHeaderProps {
    selectedWeek: DateRange;
    weekNumber: number;
    year: number;
}

const getDatesInRange = (startDate: Date, endDate: Date): Date[] => {
    const dates: Date[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
};

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ selectedWeek, weekNumber, year }) => {
    const { from, to } = selectedWeek;

    const dates = from && to ? getDatesInRange(from, to) : [];

    const weekDayNames = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
    const currentWeekDay = new Date().getDay();
    return (
        <div className="grid min-w-max grid-cols-[100px_repeat(7,minmax(165px,_1fr))] rounded-t-lg border-t border-r border-l">
            <div className="border-r border-b p-2">
                <div className="bg-primary flex h-full w-full flex-col items-center justify-center rounded-lg text-white">
                    <div className="text-xs">{year}</div>
                    <div className="text-xl font-semibold">Tuần {weekNumber}</div>
                </div>
            </div>
            {dates.map((date, index) => (
                <div
                    key={`date-${index}`}
                    className={`flex flex-col border-b p-4 ${index !== dates.length - 1 ? 'border-r' : ''} ${date.getDay() === currentWeekDay ? 'bg-primary-50' : ''}`}
                >
                    <div className="text-xs">{weekDayNames[index]}</div>
                    <div className="text-xl font-semibold">{date.getDate()}</div>
                </div>
            ))}
        </div>
    );
};

export default CalendarHeader;
