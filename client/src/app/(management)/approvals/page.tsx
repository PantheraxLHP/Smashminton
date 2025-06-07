'use client';

import { useState } from 'react';
import Filter, { FilterConfig } from '@/components/atomic/Filter';
import ApprovalList from './ApprovalList';

const filters: FilterConfig[] = [
    { filterid: 'search', filterlabel: 'Tìm kiếm tên/mã nhân viên', filtertype: 'search' },
    { filterid: 'selectedFilter', filterlabel: 'selectedFilter', filtertype: 'selectedFilter' },
    {
        filterid: 'monthyear',
        filterlabel: 'THÁNG - NĂM',
        filtertype: 'monthyear',
    },
    {
        filterid: 'role',
        filterlabel: 'VAI TRÒ',
        filtertype: 'checkbox',
        filteroptions: [
            { optionlabel: 'Quản lý sân', optionvalue: 'employee' },
            { optionlabel: 'Quản lý kho hàng', optionvalue: 'wh_manager' },
            { optionlabel: 'Quản lý nhân sự', optionvalue: 'hr_manager' },
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
        filterid: 'rewardrecordstatus',
        filterlabel: 'TRẠNG THÁI',
        filtertype: 'checkbox',
        filteroptions: [
            { optionlabel: 'Đã phê duyệt', optionvalue: 'approved' },
            { optionlabel: 'Chờ phê duyệt', optionvalue: 'pending' },
            { optionlabel: 'Đã từ chối', optionvalue: 'rejected' },
        ],
    },
];

const ApprovalsPage = () => {
    const [filterValues, setFilterValues] = useState<Record<string, any>>({});

    return (
        <div className="flex w-full gap-5 p-4">
            <Filter filters={filters} values={filterValues} setFilterValues={setFilterValues} />
            <ApprovalList filterValue={filterValues} />
        </div>
    );
};

export default ApprovalsPage;
