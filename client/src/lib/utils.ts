import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatPrice = (price: number | string) => {
    let numPrice: number;
    if (typeof price === 'string') {
        // Remove all non-digit characters
        numPrice = parseInt(price.replace(/[^\d]/g, ''), 10);
        if (isNaN(numPrice)) numPrice = 0;
    } else {
        numPrice = price;
    }
    return numPrice.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).replace('₫', ' VND');
};

export const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const formatDateTime = (date: Date | string) => {
    const d = (typeof date === 'string') ? new Date(date) : date;
    return d.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export const formatDate = (date: Date | string) => {
    const d = (typeof date === 'string') ? new Date(date) : date;
    return d.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
};

export const formatMonthYear = (date: Date | string) => {
    const d = (typeof date === 'string') ? new Date(date) : date;
    return d.toLocaleDateString('vi-VN', {
        month: '2-digit',
        year: 'numeric',
    });
}

export const formatDateString = (date: Date | string) => {
    const d = (typeof date === 'string') ? new Date(date) : date;
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
}