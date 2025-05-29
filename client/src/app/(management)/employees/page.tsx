'use client';

import { useState } from 'react';
import Filter, { FilterConfig } from '@/components/atomic/Filter';
import EmployeeList from './EmployeeList';

const filters: FilterConfig[] = [
    { filterid: "search", filterlabel: "Tìm kiếm tên/mã nhân viên", filtertype: "search" },
    { filterid: "selectedFilter", filterlabel: "selectedFilter", filtertype: "selectedFilter" },
    {
        filterid: "checkbox1", filterlabel: "VAI TRÒ", filtertype: "checkbox", filteroptions: [
            { optionlabel: "Quản lý sân", optionvalue: "employee" },
            { optionlabel: "Quản lý kho hàng", optionvalue: "wh_manager" },
        ]
    },
    {
        filterid: "checkbox2", filterlabel: "LOẠI NHÂN VIÊN", filtertype: "checkbox", filteroptions: [
            { optionlabel: "Toàn thời gian", optionvalue: "fulltime" },
            { optionlabel: "Bán thời gian", optionvalue: "parttime" },
        ]
    },
    {
        filterid: "checkbox3", filterlabel: "SINH TRẮC HỌC VÂN TAY", filtertype: "checkbox", filteroptions: [
            { optionlabel: "Đã thêm", optionvalue: "true" },
            { optionlabel: "Chưa thêm", optionvalue: "false" },
        ]
    },
]

const EmployeesPage = () => {
    const [filterValues, setFilterValues] = useState<Record<string, any>>({});

    return (
        <div className="flex gap-5 p-4">
            <Filter filters={filters} values={filterValues} setFilterValues={setFilterValues} />
            <EmployeeList />
        </div>
    );
};

export default EmployeesPage;
