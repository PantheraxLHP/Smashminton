'use client'

import { useState } from 'react';
import Filter, { FilterConfig } from '@/components/atomic/Filter';

const filters: FilterConfig[] = [
    { filterid: "search", filterlabel: "Tìm kiếm tên/mã nhân viên", filtertype: "search" },
    {
        filterid: "checkbox", filterlabel: "Vai trò", filtertype: "checkbox", filteroptions: [
        { optionlabel: "Option 1", optionvalue: "option1value" }, 
        { optionlabel: "Option 2", optionvalue: "option2value" }, 
        { optionlabel: "Option 3", optionvalue: "option3value" },
    ]},
    { filterid: "selectedFilter", filterlabel: "selectedFilter", filtertype: "selectedFilter" },
    { filterid: "pricerange", filterlabel: "Khoảng giá", filtertype: "range", rangemin: 0, rangemax: 99999999 },
    { filterid: "yearMonth", filterlabel: "Tháng - Năm", filtertype: "monthyear", month: 12, year: 2023 },
]

const EmployeesPage = () => {
    const [filterValues, setFilterValues] = useState<Record<string, any>>({
        "search": "abc",
        "checkbox": ["option1value", "option2value"],
        "pricerange": [1000, 69000000],
        "yearMonth": { month: 12, year: 2023 },
    });

    const handleFilterChange = (filterid: string, value: any) => {
        const type = filters.find(f => f.filterid === filterid)?.filtertype;
        setFilterValues(prev => {
            let updated = { ...prev };
            if (type === "search" || type === "range" || type === "monthyear") {
                updated[filterid] = value;
            } else if (type === "checkbox") {
                const arr = Array.isArray(prev[filterid]) ? [...(prev[filterid])] : [];
                const idx = arr.indexOf(value);
                if (idx > -1) {
                    arr.splice(idx, 1);
                } else {
                    arr.push(value);
                }
                updated[filterid] = arr;
            }
            return updated;
        });
    }

    const handleRemoveFilter = (filterid: string, removeValue?: string | number) => {
        const type = filters.find(f => f.filterid === filterid)?.filtertype;
        setFilterValues(prev => {
            let updated = { ...prev };
            if (type === "search" || type === "range" || type === "monthyear") {
                updated[filterid] = undefined;
            } else if (type === "checkbox") {
                const arr = Array.isArray(prev[filterid]) ? [...(prev[filterid])] : [];
                const idx = arr.indexOf(removeValue);
                if (idx > -1) {
                    arr.splice(idx, 1);
                }
                updated[filterid] = arr.length > 0 ? arr : undefined;
            }
            return updated;
        });
    }

    return (
        <div className="p-4 flex gap-10">
            <Filter 
                filters={filters}
                values={filterValues}
                onRemoveFilter={handleRemoveFilter}
                onChange={handleFilterChange}
            />
            <h1>Test Filter</h1>
        </div>
    );
}

export default EmployeesPage;