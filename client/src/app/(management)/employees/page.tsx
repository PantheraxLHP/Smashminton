'use client'

import { useState } from 'react';
import Filter, { FilterConfig } from '@/components/atomic/Filter';
import EmployeeList from './EmployeeList';

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

    return (
        <div className="p-4 flex gap-5">
            <Filter 
                filters={filters}
                values={filterValues}
                setFilterValues={setFilterValues}
            />
            <EmployeeList/>
        </div>
    );
}

export default EmployeesPage;