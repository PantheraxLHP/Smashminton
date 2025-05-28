import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Range } from "react-range";
import { formatPrice } from "@/lib/utils";

export type FilterType = "search" | "selectedFilter" | "checkbox" | "range" | "monthyear"

export interface FilterOption {
    optionlabel: string;
    optionvalue: string | number;
}

export interface FilterConfig {
    filterid: string;
    filterlabel: string;
    filtertype: FilterType;
    filteroptions?: FilterOption[];
    rangemin?: number;
    rangemax?: number;
    month?: number;
    year?: number;
}
interface FilterProps {
    filters: FilterConfig[];
    values: Record<string, any>;
    setFilterValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}


const Filter: React.FC<FilterProps> = ({
    filters,
    values,
    setFilterValues
}) => {
    // Render các Badge/Tag giá trị filter đã chọn
    const renderSelectedFilterValue = (filters: FilterConfig[], values: Record<string, any>) => {
        const selectedFilters: React.ReactNode[] = [];

        filters.forEach((filter) => {
            const value = values[filter.filterid];

            if (filter.filtertype === "search" && value) {
                selectedFilters.push(
                    <Button
                        key={`search-${filter.filterid}`}
                        variant="default"
                        size="xs"
                        className="rounded-lg"
                        onClick={() => {
                            handleRemoveFilter(filter.filterid);
                        }}
                    >
                        {value}
                        <Icon
                            icon="streamline:delete-1-solid"
                            className="size-2.5"
                        />
                    </Button>
                );
            }
            else if (filter.filtertype === "checkbox" && Array.isArray(value) && value.length > 0) {
                value.forEach((optionvalue: string | number) => {
                    selectedFilters.push(
                        <Button
                            key={`checkbox-${filter.filterid}-${optionvalue}`}
                            variant="default"
                            size="xs"
                            className="rounded-lg"
                            onClick={() => {
                                handleRemoveFilter(filter.filterid, optionvalue);
                            }}
                        >
                            {optionvalue}
                            <Icon
                                icon="streamline:delete-1-solid"
                                className="size-2.5"
                            />
                        </Button>
                    );
                });
            }
            else if (filter.filtertype === "range" && Array.isArray(value)) {
                selectedFilters.push(
                    <Button
                        key={`range-${filter.filterid}`}
                        variant="default"
                        size="xs"
                        className="rounded-lg"
                        onClick={() => {
                            handleRemoveFilter(filter.filterid);
                        }}
                    >
                        {`${formatPrice(value[0])} - ${formatPrice(value[1])}`}
                        <Icon
                            icon="streamline:delete-1-solid"
                            className="size-2.5"
                        />
                    </Button>
                );
            }
            else if (filter.filtertype === "monthyear" && value) {
                selectedFilters.push(
                    <Button
                        key={`month-${filter.filterid}`}
                        variant="default"
                        size="xs"
                        className="rounded-lg"
                        onClick={() => {
                            handleRemoveFilter(filter.filterid);
                        }}
                    >
                        {`Tháng ${value.month} - Năm ${value.year}`}
                        <Icon
                            icon="streamline:delete-1-solid"
                            className="size-2.5"
                        />
                    </Button>
                );
            }
        });
        return selectedFilters;
    };

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

    const handleRemoveAllFilters = () => {
        filters.forEach((filter) => {
            if (filter.filtertype === "checkbox" && Array.isArray(values[filter.filterid])) {
                values[filter.filterid].forEach((optionvalue: string | number) => {
                    handleRemoveFilter(filter.filterid, optionvalue);
                });
            } else if (
                filter.filtertype === "search" ||
                filter.filtertype === "range" ||
                filter.filtertype === "monthyear"
            ) {
                if (values[filter.filterid] !== undefined && values[filter.filterid] !== null) {
                    handleRemoveFilter(filter.filterid);
                }
            }
        });
    }

    return (
        <div className="flex flex-col gap-5 max-w-xs p-4 border-2 rounded-lg border-gray-200">
            {filters.map((filter) => {
                const value = values[filter.filterid];

                switch (filter.filtertype) {
                    case "search":
                        return (
                            <div
                                key={`filter-${filter.filterid}`}
                                className="relative w-full"
                            >
                                <Icon
                                    icon="material-symbols:search-rounded"
                                    className="absolute left-3 top-1/2 -translate-y-1/2 size-5"
                                />
                                <Input
                                    name="search_rulename"
                                    type="text"
                                    placeholder={filter.filterlabel}
                                    value={value || ""}
                                    className="pl-10 w-full"
                                    onChange={(e) => {
                                        const searchValue = e.target.value;
                                        handleFilterChange(filter.filterid, searchValue);
                                    }}
                                />
                            </div>
                        );
                    case "selectedFilter":
                        return (
                            <div
                                key={`filter-${filter.filterid}`}
                                className="flex flex-col gap-2"
                            >
                                <div
                                    className="flex items-center justify-between"
                                >
                                    <span className="text-lg text-primary font-semibold">
                                        Bạn chọn
                                    </span>
                                    <Button
                                        variant="link"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveAllFilters();
                                        }}
                                    >
                                        Bỏ chọn tất cả
                                        <Icon
                                            icon="streamline:delete-1-solid"
                                            className="size-3"
                                        />
                                    </Button>
                                </div>
                                {Object.keys(values).length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {renderSelectedFilterValue(filters, values)}
                                    </div>
                                )}
                                <div className="border-1 border-gray-300"></div>
                            </div>
                        );
                    case "checkbox":
                        return (
                            <div
                                key={`filter-${filter.filterid}`}
                                className="flex flex-col gap-2"
                            >
                                <div className="font-semibold">
                                    {filter.filterlabel}
                                </div>
                                {(filter.filteroptions?.length || 0) > 0 && (
                                    <div
                                        key={`checkbox-${filter.filterid}`}
                                        className="flex flex-col gap-2 mb-4"
                                    >
                                        {filter.filteroptions?.map((option) => (
                                            <div
                                                key={option.optionvalue}
                                                className="flex gap-2 items-center"
                                            >
                                                <Checkbox
                                                    id={`checkbox-${filter.filterid}-${option.optionvalue}`}
                                                    checked={Array.isArray(value) ? value.includes(option.optionvalue) : false}
                                                    onCheckedChange={(checked) => {
                                                        handleFilterChange(filter.filterid, option.optionvalue);
                                                    }}
                                                    className="size-5 cursor-pointer"
                                                />
                                                <Label htmlFor={`checkbox-${filter.filterid}-${option.optionvalue}`}>
                                                    {option.optionlabel}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="border-1 border-gray-300"></div>
                            </div>
                        );
                    case "range":
                        return (
                            <div
                                key={`filter-${filter.filterid}`}
                                className="w-full flex flex-col gap-2"
                            >
                                <span className="font-semibold">{filter.filterlabel}</span>

                                {/* Input boxes for direct value entry */}
                                <div className="flex items-center justify-between">
                                    <div className="w-full">
                                        <Input
                                            type="number"
                                            min={filter.rangemin}
                                            max={filter.rangemax}
                                            value={Array.isArray(values[filter.filterid])
                                                ? values[filter.filterid][0]
                                                : filter.rangemin}
                                            onChange={(e) => {
                                                const newMin = Number(e.target.value);
                                                const currentMax = Array.isArray(values[filter.filterid])
                                                    ? values[filter.filterid][1]
                                                    : filter.rangemax;
                                                handleFilterChange(filter.filterid, [newMin, currentMax]);
                                            }}
                                            className="text-sm"
                                        />
                                    </div>

                                    <div className="mx-2 bg-gray-500 w-5 h-1"></div>

                                    <div className="w-full">
                                        <Input
                                            type="number"
                                            min={filter.rangemin}
                                            max={filter.rangemax}
                                            value={Array.isArray(values[filter.filterid])
                                                ? values[filter.filterid][1]
                                                : filter.rangemax}
                                            onChange={(e) => {
                                                const newMax = Number(e.target.value);
                                                const currentMin = Array.isArray(values[filter.filterid])
                                                    ? values[filter.filterid][0]
                                                    : filter.rangemin;
                                                handleFilterChange(filter.filterid, [currentMin, newMax]);
                                            }}
                                            className="text-sm"
                                        />
                                    </div>
                                </div>

                                {/* React Range with two thumbs */}
                                <div className="py-2">
                                    <Range
                                        values={
                                            Array.isArray(values[filter.filterid])
                                                ? values[filter.filterid]
                                                : [filter.rangemin || 0, filter.rangemax || 100]
                                        }
                                        step={1}
                                        min={filter.rangemin || 0}
                                        max={filter.rangemax || 100}
                                        onChange={(newValues) => {
                                            handleFilterChange(filter.filterid, newValues);
                                        }}
                                        renderTrack={({ props, children }) => (
                                            <div
                                                {...props}
                                                className="w-full h-3 rounded bg-primary-50"
                                                style={{
                                                    ...props.style,
                                                }}
                                            >
                                                {children}
                                            </div>
                                        )}
                                        renderThumb={({ props, index }) => {
                                            const { key, ...thumbProps } = props;

                                            return (
                                                <div
                                                    key={key}
                                                    {...thumbProps}
                                                    className="h-5 w-5 rounded-full bg-primary border-2 border-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                                    style={{
                                                        ...thumbProps.style,
                                                        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.3)",
                                                    }}
                                                />
                                            );
                                        }}
                                    />
                                </div>

                                {/* Chú thích Range (giá trị min-max) */}
                                <div className="flex justify-between text-xs text-gray-500 mb-4">
                                    <span>{filter.rangemin != null && formatPrice(filter.rangemin)}</span>
                                    <span>{filter.rangemax != null && formatPrice(filter.rangemax)}</span>
                                </div>
                                <div className="border-1 border-gray-300"></div>
                            </div>
                        );
                    case "monthyear":
                        return (
                            <div
                                className="flex flex-col gap-2"
                                key={`filter-${filter.filterid}`}
                            >
                                <span className="font-semibold">
                                    {filter.filterlabel}
                                </span>
                                <div className="flex gap-5 items-center mb-4">
                                    <div className="flex flex-col gap-1 w-full">
                                        <Label className="text-sm">
                                            Tháng
                                        </Label>
                                        <Select
                                            value={`${value?.month || new Date().getMonth() + 1}`}
                                            onValueChange={(newMonth) => {
                                                handleFilterChange(filter.filterid, {
                                                    month: Number(newMonth),
                                                    year: value?.year || new Date().getFullYear(),
                                                });
                                            }}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Chọn tháng" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.from({ length: 12 }, (_, i) => (
                                                    <SelectItem
                                                        key={`Month-${i + 1}`}
                                                        value={`${i + 1}`}
                                                    >
                                                        Tháng {i + 1}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex flex-col gap-1 w-full">
                                        <Label className="text-sm">
                                            Năm
                                        </Label>
                                        <Select
                                            value={`${value?.year || new Date().getFullYear()}`}
                                            onValueChange={(newYear) => {
                                                handleFilterChange(filter.filterid, {
                                                    month: value?.month || new Date().getMonth() + 1,
                                                    year: Number(newYear),
                                                });
                                            }}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Chọn năm" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.from({ length: (new Date().getFullYear() - 2000 + 1) }, (_, i) => (
                                                    <SelectItem
                                                        key={`Year-${2000 + i}`}
                                                        value={`${2000 + i}`}
                                                    >
                                                        Năm {2000 + i}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="border-1 border-gray-300"></div>
                            </div>
                        );
                    default:
                        return null;
                }
            })}
        </div>
    );
}

export default Filter;