'use client';

import { useState } from 'react';
import Filter, { FilterConfig } from '@/components/atomic/Filter';
import EmployeeList from './EmployeeList';

const filters: FilterConfig[] = [
    { filterid: 'search', filterlabel: 'Tìm kiếm tên/mã nhân viên', filtertype: 'search' },
    { filterid: 'selectedFilter', filterlabel: 'selectedFilter', filtertype: 'selectedFilter' },
    {
        filterid: 'role',
        filterlabel: 'VAI TRÒ',
        filtertype: 'checkbox',
        filteroptions: [
            { optionlabel: 'Quản lý nhân sự', optionvalue: 'hr_manager' },
            { optionlabel: 'Quản lý sân', optionvalue: 'employee' },
            { optionlabel: 'Quản lý kho hàng', optionvalue: 'wh_manager' },
        ],
    },
    {
        filterid: 'employee_type',
        filterlabel: 'LOẠI NHÂN VIÊN',
        filtertype: 'checkbox',
        filteroptions: [
            { optionlabel: 'Toàn thời gian', optionvalue: 'Full-time' },
            { optionlabel: 'Bán thời gian', optionvalue: 'Part-time' },
        ],
    },
    {
        filterid: 'fingerprintid',
        filterlabel: 'SINH TRẮC HỌC VÂN TAY',
        filtertype: 'checkbox',
        filteroptions: [
            { optionlabel: 'Đã thêm', optionvalue: 'notnull' },
            { optionlabel: 'Chưa thêm', optionvalue: 'null' },
        ],
    },
];

const EmployeesPage = () => {
    const [filterValues, setFilterValues] = useState<Record<string, any>>({});

    return (
        <div className="flex w-full gap-5 p-4">
            <Filter filters={filters} values={filterValues} setFilterValues={setFilterValues} />
            <EmployeeList filterValue={filterValues} />
        </div>
    );
};

export default EmployeesPage;
