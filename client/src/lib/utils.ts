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
    return numPrice
        .toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
        })
        .replace('₫', 'VND');
};

export const formatNumber = (num: number | string) => {
    let number: number;
    if (typeof num === 'string') {
        // Remove all non-digit characters
        number = parseFloat(num.replace(/[^\d.-]/g, ''));
        if (isNaN(number)) number = 0;
    } else {
        number = num;
    }
    return number.toLocaleString('vi-VN');
}

export const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatDateTime = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
};

export const formatMonthYear = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('vi-VN', {
        month: '2-digit',
        year: 'numeric',
    });
};

export const formatDateString = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
};

export const formatRole = (role: string) => {
    switch (role) {
        case 'admin':
            return 'Quản trị viên';
        case 'employee':
            return 'Quản lý sân';
        case 'wh_manager':
            return 'Quản lý kho hàng';
        case 'hr_manager':
            return 'Quản lý nhân sự';
    }
};

export const formatEmployeeType = (employee_type: string) => {
    switch (employee_type) {
        case 'Full-time':
            return 'Toàn thời gian';
        case 'Part-time':
            return 'Bán thời gian';
    }
};
