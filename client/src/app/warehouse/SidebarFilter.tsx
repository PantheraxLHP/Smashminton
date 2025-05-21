'use client';

import React, { createElement as h } from 'react';
import { FilterConfig } from './DataTable';

export interface FilterSidebarProps<T extends Record<string, any>> {
    filters: T;
    setFilters: React.Dispatch<React.SetStateAction<T>>;
    config: FilterConfig[];
}

export default function FilterSidebar<T extends Record<string, any>>({
    filters,
    setFilters,
    config,
}: FilterSidebarProps<T>) {
    const handleToggle = (key: keyof T, value: string) => {
        setFilters((prev) => {
            const current = (prev[key] as string[]) ?? [];
            const newList = current.includes(value)
                ? current.filter((item) => item !== value)
                : [...current, value];
            return { ...prev, [key]: newList as T[keyof T] };
        });
    };

    const clearAll = () => {
        const reset = { ...filters };
        config.forEach((c) => {
            if (c.type === 'search') reset[c.key as keyof T] = '' as T[keyof T];
            if (c.type === 'checkbox') reset[c.key as keyof T] = [] as T[keyof T];
            if (c.type === 'range') reset[c.key as keyof T] = [c.min, c.max] as T[keyof T];
        });
        setFilters(reset);
    };

    const renderSelectedFilters = () => {
        const selected: React.ReactNode[] = [];

        config.forEach((filter) => {
            const key = filter.key as keyof T;
            const val = filters[key];

            if (filter.type === 'checkbox' && Array.isArray(val) && val.length > 0) {
                val.forEach((item: string) => {
                    selected.push(
                        h(
                            'span',
                            {
                                key: `${String(key)}-${item}`,
                                className:
                                    'bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded mr-2 mb-2 inline-flex items-center',
                            },
                            item,
                            h(
                                'button',
                                {
                                    className: 'ml-1 text-primary-600 hover:text-red-500',
                                    onClick: () => handleToggle(key, item),
                                },
                                '✕'
                            )
                        )
                    );
                });
            }

            if (filter.type === 'search' && val) {
                selected.push(
                    h(
                        'span',
                        {
                            key: String(key),
                            className:
                                'bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded mr-2 mb-2 inline-flex items-center',
                        },
                        val,
                        h(
                            'button',
                            {
                                className: 'ml-1 text-primary-600 hover:text-red-500',
                                onClick: () =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        [key]: '' as T[keyof T],
                                    })),
                            },
                            '✕'
                        )
                    )
                );
            }

            if (filter.type === 'range') {
                const [min, max] = (val || []) as [number, number];
                if (min !== filter.min || max !== filter.max) {
                    selected.push(
                        h(
                            'span',
                            {
                                key: String(key),
                                className:
                                    'bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded mr-2 mb-2 inline-flex items-center',
                            },
                            `${min.toLocaleString()} - ${max.toLocaleString()}₫`,
                            h(
                                'button',
                                {
                                    className: 'ml-1 text-primary-600 hover:text-red-500',
                                    onClick: () =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            [key]: [filter.min, filter.max] as T[keyof T],
                                        })),
                                },
                                '✕'
                            )
                        )
                    );
                }
            }
        });

        return h(
            'div',
            null,
            h(
                'div',
                { className: 'flex justify-between items-center mb-2' },
                h('h3', { className: 'text-primary-600 font-semibold text-lg' }, 'Bạn chọn'),
                selected.length > 0
                    ? h(
                        'button',
                        {
                            className: 'text-gray-600 text-sm hover:underline',
                            onClick: clearAll,
                        },
                        'Bỏ hết ✕'
                    )
                    : null
            ),
            h(
                'div',
                { className: 'flex flex-wrap text-gray-500 text-sm italic' },
                selected.length > 0 ? selected : 'Chưa chọn bộ lọc nào'
            ),
            h('hr', { className: 'my-4' })
        );
    };
    

    return h(
        'div',
        { className: 'w-full space-y-4' },
        h(
            'div',
            { className: 'rounded-lg border bg-white p-4 shadow-sm space-y-6 text-sm' },

            // Search input luôn nằm trên cùng
            ...config
                .filter((f) => f.type === 'search')
                .map((filter) => {
                    const key = filter.key as keyof T;
                    return h(
                        'div',
                        { key: filter.key, className: 'relative' },
                        h('span', {
                            className: 'absolute left-3 top-1/2 -translate-y-1/2 text-gray-400',
                            children: '🔍',
                        }),
                        h('input', {
                            type: 'text',
                            placeholder: filter.placeholder || 'Tìm kiếm',
                            className: 'w-full pl-10 pr-3 py-2 border rounded text-sm bg-gray-50',
                            value: filters[key] ?? '',
                            onChange: (e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    [key]: (e.target as HTMLInputElement).value,
                                })),
                        })
                    );
                }),

            // Luôn hiển thị phần "Bạn chọn"
            renderSelectedFilters(),

            // Các filter còn lại
            ...config
                .filter((f) => f.type !== 'search')
                .map((filter) => {
                    const key = filter.key as keyof T;

                    if (filter.type === 'checkbox' && filter.options) {
                        const selected = (filters[key] as string[]) ?? [];
                        return h(
                            'div',
                            { key: filter.key, className: 'border-b-2 border-gray-200 pb-3' },
                            h('h3', { className: 'mb-2 text-lg font-semibold' }, filter.title),
                            h(
                                'div',
                                { className: 'space-y-1' },
                                filter.options.map((option) =>
                                    h(
                                        'label',
                                        {
                                            key: option,
                                            className: 'flex items-center space-x-2 cursor-pointer',
                                        },
                                        h('input', {
                                            type: 'checkbox',
                                            checked: selected.includes(option),
                                            onChange: () => handleToggle(key, option),
                                            className: 'cursor-pointer',
                                        }),
                                        h('span', null, option)
                                    )
                                )
                            )
                        );
                    }

                    if (filter.type === 'range' && filter.min !== undefined && filter.max !== undefined) {
                        const [min, max] = (filters[key] as [number, number]) ?? [filter.min, filter.max];
                        return h(
                            'div',
                            { key: filter.key, className: 'border-b-2 border-gray-200 pb-3' },
                            h('h3', { className: 'mb-2 text-lg font-semibold' }, filter.title),
                            h(
                                'div',
                                { className: 'flex gap-2 mb-2' },
                                h('input', {
                                    type: 'number',
                                    placeholder: 'Từ',
                                    className: 'w-full border px-2 py-1 rounded',
                                    value: min,
                                    onChange: (e) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            [key]: [Number(e.target.value), max],
                                        })),
                                }),
                                h('input', {
                                    type: 'number',
                                    placeholder: 'Đến',
                                    className: 'w-full border px-2 py-1 rounded',
                                    value: max,
                                    onChange: (e) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            [key]: [min, Number(e.target.value)],
                                        })),
                                })
                            ),
                            h('input', {
                                type: 'range',
                                min: filter.min,
                                max: filter.max,
                                value: max,
                                onChange: (e) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        [key]: [min, Number(e.target.value)],
                                    })),
                                className: 'w-full accent-primary-500',
                            }),
                            h(
                                'div',
                                { className: 'flex justify-between text-xs mt-1' },
                                h('span', null, `${filter.min.toLocaleString()}VND`),
                                h('span', null, `${filter.max.toLocaleString()}VND`)
                            )
                        );
                    }

                    return null;
                })
        )
    );
    
}