'use client'

import { useState } from 'react';
import Filter, { FilterConfig } from '@/components/atomic/Filter';
import ApprovalList from './ApprovalList';

const filters: FilterConfig[] = [
    { filterid: "search", filterlabel: "Tìm kiếm tên/mã nhân viên", filtertype: "search" },
    { filterid: "selectedFilter", filterlabel: "selectedFilter", filtertype: "selectedFilter" },
    {
        filterid: "monthYear", filterlabel: "THÁNG - NĂM", filtertype: "monthyear"
    },
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
        filterid: "checkbox3", filterlabel: "TRẠNG THÁI", filtertype: "checkbox", filteroptions: [
            { optionlabel: "Đã phê duyệt", optionvalue: "approved" },
            { optionlabel: "Chờ phê duyệt", optionvalue: "pending" },
            { optionlabel: "Đã từ chối", optionvalue: "rejected" },
        ]
    },
];

const ApprovalsPage = () => {
    const [filterValues, setFilterValues] = useState<Record<string, any>>({});

    return (
        <div className="flex gap-5 p-4 w-full">
            <Filter filters={filters} values={filterValues} setFilterValues={setFilterValues} />
            <ApprovalList />
        </div>
    );
}

export default ApprovalsPage;