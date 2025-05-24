'use client';

import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import MoreActionsMenu from './MoreActionsMenu';

export interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    align?: 'left' | 'center' | 'right';
    className?: (item: T) => string; // ✅ added
}

export interface FilterConfig {
    type: 'search' | 'checkbox' | 'range';
    key: string;
    title?: string;
    options?: string[]; // For checkbox
    min?: number;       // For range
    max?: number;       // For range
    placeholder?: string; // For search
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    renderImage?: (item: T) => React.ReactNode;
    filterConfig?: FilterConfig[];
    filters?: Record<string, any>;
    setFilters?: (f: Record<string, any>) => void;
}

export default function DataTable<T extends Record<string, any>>({
    columns,
    data,
    renderImage,
    filterConfig = [],
    filters,
    setFilters,
}: DataTableProps<T>) {
    const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

    const handleCheckboxChange = (key: string, value: string) => {
        if (!setFilters || !filters) return;
        const current = filters[key] || [];
        setFilters({
            ...filters,
            [key]: current.includes(value)
                ? current.filter((v: string) => v !== value)
                : [...current, value],
        });
    };

    const handleInputChange = (key: string, value: any) => {
        if (!setFilters || !filters) return;
        setFilters({ ...filters, [key]: value });
    };

    const applyFilters = (item: T): boolean => {
        if (!filterConfig || !filters) return true;

        return filterConfig.every((config) => {
            const val = item[config.key];
            const filterVal = filters[config.key];
            if (!filterVal) return true;

            switch (config.type) {
                case 'search':
                    return typeof val === 'string' && val.toLowerCase().includes(filterVal.toLowerCase());
                case 'checkbox':
                    return filterVal.length === 0 || filterVal.includes(val);
                case 'range':
                    return val >= filterVal[0] && val <= filterVal[1];
                default:
                    return true;
            }
        });
    };

    const filteredData = filters ? data.filter(applyFilters) : data;

    return (
        <div className="p-4 sm:p-6 space-y-4">
            {/* Filter form (nếu có) */}
            {filterConfig.length > 0 && filters && setFilters && (
                <div className="rounded border p-4 bg-white space-y-4 text-sm">
                    {filterConfig.map((config) => {
                        if (config.type === 'search') {
                            return (
                                <input
                                    key={config.key}
                                    type="text"
                                    placeholder={config.placeholder}
                                    className="w-full border px-2 py-1 rounded"
                                    value={filters[config.key] || ''}
                                    onChange={(e) => handleInputChange(config.key, e.target.value)}
                                />
                            );
                        }

                        if (config.type === 'checkbox') {
                            return (
                                <div key={config.key}>
                                    <h4 className="font-semibold">{config.title}</h4>
                                    <div className="space-y-1 mt-1">
                                        {config.options?.map((opt) => (
                                            <label key={opt} className="flex items-center space-x-2 text-sm">
                                                <input
                                                    type="checkbox"
                                                    checked={(filters[config.key] || []).includes(opt)}
                                                    onChange={() => handleCheckboxChange(config.key, opt)}
                                                />
                                                <span>{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            );
                        }

                        if (config.type === 'range') {
                            const val = filters[config.key] || [config.min, config.max];
                            return (
                                <div key={config.key}>
                                    <h4 className="font-semibold">{config.title}</h4>
                                    <div className="flex gap-2 mt-1">
                                        <input
                                            type="number"
                                            value={val[0]}
                                            min={config.min}
                                            max={val[1]}
                                            className="w-full border px-2 py-1 rounded"
                                            onChange={(e) =>
                                                handleInputChange(config.key, [Number(e.target.value), val[1]])
                                            }
                                        />
                                        <input
                                            type="number"
                                            value={val[1]}
                                            min={val[0]}
                                            max={config.max}
                                            className="w-full border px-2 py-1 rounded"
                                            onChange={(e) =>
                                                handleInputChange(config.key, [val[0], Number(e.target.value)])
                                            }
                                        />
                                    </div>
                                </div>
                            );
                        }

                        return null;
                    })}
                </div>
            )}

            {/* Table */}
            <div className="max-w-[calc(100vw-70px)] overflow-x-auto rounded border border-primary-200">
                <table className="w-full text-sm">
                    <thead className="bg-primary-50 text-left text-gray-700">
                        <tr>
                            {renderImage && <th className="px-3 py-2"></th>}
                            {columns.map((col, i) => (
                                <th
                                    key={i}
                                    className={`px-3 py-2 font-medium ${col.align === 'right'
                                            ? 'text-right'
                                            : col.align === 'center'
                                                ? 'text-center'
                                                : 'text-left'
                                        }`}
                                >
                                    {col.header}
                                </th>
                            ))}
                            <th className="px-3 py-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item, idx) => (
                            <tr key={idx} className="border-t hover:bg-gray-50 transition">
                                {renderImage && (
                                    <td className="px-3 py-3">
                                        {renderImage(item)}
                                    </td>
                                )}
                                {columns.map((col, i) => {
                                    let value: React.ReactNode;

                                    if (typeof col.accessor === 'function') {
                                        try {
                                            value = col.accessor(item);
                                        } catch (err) {
                                            console.error('Error evaluating accessor:', err);
                                            value = '—';
                                        }
                                    } else {
                                        const raw = item[col.accessor];
                                        value = raw !== undefined && raw !== null ? String(raw) : '—';
                                    }
                                    
                                    const cellClass = col.className?.(item) || '';

                                    return (
                                        <td
                                            key={i}
                                            className={`px-3 py-3 ${col.align === 'right'
                                                    ? 'text-right'
                                                    : col.align === 'center'
                                                        ? 'text-center'
                                                        : ''
                                                } ${cellClass}`}
                                        >
                                            {value}
                                        </td>
                                    );
                                })}
                                <td className="px-3 py-3 text-right relative">
                                    <button
                                        className="text-gray-500 hover:text-gray-700"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            setSelectedItemIndex(idx);
                                            setMenuPosition({ x: rect.left - 40, y: rect.bottom + 5 });
                                        }}
                                    >
                                        <MoreVertical size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
