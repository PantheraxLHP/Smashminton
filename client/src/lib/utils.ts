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
    return new Intl.NumberFormat('vi-VN').format(numPrice) + ' VND';
};
