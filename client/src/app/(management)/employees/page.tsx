'use client'

import Filter, { FilterConfig } from '@/components/atomic/Filter';

const filters: FilterConfig[] = [
    {filterid: 1, filterlabel: "keyword", filtertype: "search"},
    {filterid: 2, filterlabel: "checkbox", filtertype: "checkbox", filteroptions: [
        { optionlabel: "Option 1", optionvalue: "option1value" }, 
        { optionlabel: "Option 2", optionvalue: "option2value" }, 
        { optionlabel: "Option 3", optionvalue: "option3value" },
    ]},
    {filterid: 3, filterlabel: "selectedFilter", filtertype: "selectedFilter"},
    {filterid: 4, filterlabel: "range", filtertype: "range", rangemin: 0, rangemax: 10000},
    {filterid: 5, filterlabel: "monthyear", filtertype: "monthyear", month: 12, year: 2023},
]

const values: Record<string, any> = {};

const EmployeesPage = () => {
    return (
        <div>
            <Filter 
                filters={filters}
                values={values}
                onChange={() => {}}
            />
            <h1>Test Filter</h1>
        </div>
    );
}

export default EmployeesPage;