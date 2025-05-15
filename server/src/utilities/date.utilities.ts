import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export function calculateEndTimeCache(date: string, starttime: string, duration: number): string {
    const fullStart = `${date} ${starttime}`;
    const start = dayjs(fullStart, 'YYYY-MM-DD HH:mm');
    return start.add(duration, 'hour').format('HH:mm');
}

export function getEnglishDayName(dateInput: Date | string): string {
    const date = new Date(dateInput);
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return weekdays[date.getDay()];
}

export function calculateEndTime_HHMM(starttime: string, duration: number): string {
    const start = dayjs(starttime, 'HH:mm'); // ngày giả để giữ định dạng
    const end = start.add(duration, 'hour');
    return end.format('HH:mm'); // changed to match the format
}


export function calculateEndTime_Date(starttime: string, duration: number): string {
    const start = dayjs(starttime, 'YYYY-MM-DD HH:mm'); // changed to match the format
    const end = start.add(duration, 'hour');
    return end.format('YYYY-MM-DD HH:mm'); // changed to match the format
}

export function convertVNToUTC(vnTimeStr: string): Date {
    return dayjs.tz(vnTimeStr, 'Asia/Ho_Chi_Minh').utc().toDate();
}

export function convertUTCToVNTime(utcTimeStr: string): string {
    // Chuyển đổi từ UTC sang múi giờ Việt Nam và định dạng lại
    return dayjs.utc(utcTimeStr).tz('Asia/Ho_Chi_Minh').format('HH:mm');
}