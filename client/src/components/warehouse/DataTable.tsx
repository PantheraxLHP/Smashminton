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
    filterid: string;
    filterlabel: string;
    filtertype: 'search' | 'checkbox' | 'range';
    filteroptions?: string[];
    rangemin?: number;
    rangemax?: number;
    placeholder?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    renderImage?: (item: T) => React.ReactNode;
    filterConfig?: FilterConfig[];
    filters?: Record<string, any>;
    setFilters?: (f: Record<string, any>) => void;
    onEdit?: (index: number) => void;
    onDelete?: (index: number) => void;
    onOrder?: (index: number) => void;
    showOptions?: boolean;
    showMoreOption?: boolean;
    showHeader?: boolean;
}

export default function DataTable<T extends Record<string, any>>({
    columns,
    data,
    renderImage,
    filterConfig = [],
    filters,
    setFilters,
    onEdit,
    onDelete,
    onOrder,
    showOptions,
    showMoreOption,
    showHeader,
}: DataTableProps<T>) {
    const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

    const handleCheckboxChange = (filterid: string, value: string) => {
        if (!setFilters || !filters) return;
        const current = filters[filterid] || [];
        setFilters({
            ...filters,
            [filterid]: current.includes(value)
                ? current.filter((v: string) => v !== value)
                : [...current, value],
        });
    };


    const handleInputChange = (filterid: string, value: any) => {
        if (!setFilters || !filters) return;
        setFilters({ ...filters, [filterid]: value });
    };


    const applyFilters = (item: T): boolean => {
        if (!filterConfig || !filters) return true;

        return filterConfig.every((config) => {
            const val = item[config.filterid];
            const filterVal = filters[config.filterid];
            if (!filterVal) return true;

            switch (config.filtertype) {
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
        <div className="space-y-4">
            {/* Filter form (nếu có) */}
            {filterConfig.length > 0 && filters && setFilters && (
                <div className="space-y-4 rounded border bg-white p-4 text-sm">
                    {filterConfig.map((config) => {
                        if (config.filtertype === 'search') {
                            return (
                                <input
                                    key={config.filterid}
                                    type="text"
                                    placeholder={config.placeholder}
                                    className="w-full border px-2 py-1 rounded"
                                    value={filters[config.filterid] || ''}
                                    onChange={(e) => handleInputChange(config.filterid, e.target.value)}
                                />
                            );
                        }

                        if (config.filtertype === 'checkbox') {
                            return (
                                <div key={config.filterid}>
                                    <h4 className="font-semibold">{config.filterlabel}</h4>
                                    <div className="space-y-1 mt-1">
                                        {config.filteroptions?.map((opt) => (
                                            <label key={opt} className="flex items-center space-x-2 text-sm">
                                                <input
                                                    type="checkbox"
                                                    checked={(filters[config.filterid] || []).includes(opt)}
                                                    onChange={() => handleCheckboxChange(config.filterid, opt)}
                                                />
                                                <span>{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            );
                        }

                        if (config.filtertype === 'range') {
                            const val = filters[config.filterid] || [config.rangemin, config.rangemax];
                            return (
                                <div key={config.filterid}>
                                    <h4 className="font-semibold">{config.filterlabel}</h4>
                                    <div className="flex gap-2 mt-1">
                                        <input
                                            type="number"
                                            value={val[0]}
                                            min={config.rangemin}
                                            max={val[1]}
                                            className="w-full rounded border px-2 py-1"
                                            onChange={(e) =>
                                                handleInputChange(config.filterid, [Number(e.target.value), val[1]])
                                            }
                                        />
                                        <input
                                            type="number"
                                            value={val[1]}
                                            min={val[0]}
                                            max={config.rangemax}
                                            className="w-full border px-2 py-1 rounded"
                                            onChange={(e) =>
                                                handleInputChange(config.filterid, [val[0], Number(e.target.value)])
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
            <div
                className={`border-primary-200 max-w-[calc(100vw-6vw)] overflow-x-auto border
                ${!showHeader ? 'border-t-0' : ''} mx-auto`}
            >
                <table className="w-full text-sm">
                    {showHeader && (
                        <thead className="bg-primary-50 text-center text-gray-700">
                            <tr>
                                {renderImage && <th className="px-3 py-2"></th>}
                                {columns.map((col, i) => (
                                    <th
                                        key={i}
                                        className={`px-3 py-2 font-semibold ${col.align === 'right'
                                            ? 'text-right'
                                            : col.align === 'center'
                                                ? 'text-center'
                                                : 'text-left'
                                            }`}
                                    >
                                        {col.header}
                                    </th>
                                ))}
                                {showMoreOption && <th className="px-3 py-2"></th>}
                            </tr>
                        </thead>
                    )}
                    <tbody>
                        {filteredData.map((item, idx) => (
                            <tr key={idx} className="border-t transition hover:bg-gray-50">
                                {renderImage && <td className="px-3 py-3">{renderImage(item)}</td>}
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
                                {showMoreOption && (
                                    <td className="relative px-3 py-3 text-right">
                                        <button
                                            className="text-gray-500 hover:text-gray-700"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                setSelectedItemIndex(idx);
                                                setMenuPosition({ x: rect.left - 32, y: rect.bottom + window.scrollY });
                                            }}
                                        >
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                )}
                                {showMoreOption && menuPosition !== null && selectedItemIndex !== null && (
                                    <MoreActionsMenu
                                        position={menuPosition}
                                        onClose={() => {
                                            setMenuPosition(null);
                                            setSelectedItemIndex(null);
                                        }}
                                        onEdit={() => {
                                            if (onEdit && selectedItemIndex !== null) {
                                                onEdit(selectedItemIndex);
                                            }
                                        }}
                                        onDelete={() => {
                                            if (onDelete && selectedItemIndex !== null) {
                                                onDelete(selectedItemIndex);
                                            }
                                        }}
                                        onOrder={() => {
                                            if (onOrder && selectedItemIndex !== null) {
                                                onOrder(selectedItemIndex);
                                            }
                                        }}
                                        showOptions={showOptions}
                                    />
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
