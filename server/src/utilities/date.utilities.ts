import dayjs from 'dayjs';

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

export function calculateEndTime(starttime: string, duration: number): string {
    const start = dayjs(starttime, 'HH:mm'); // ngày giả để giữ định dạng
    const end = start.add(duration, 'hour');
    return end.format('HH:mm'); // changed to match the format
}