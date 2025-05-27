import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react";
import { Fragment, useState } from "react";
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
    onChange: (filterid: string, value: any) => void;
}

const renderSelectedFilterValue = (filters: FilterConfig[], values: Record<string, any>) => {
    // Return an array of filter elements instead of just the first one
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
                        // Handle click to reset search value
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
                            // Handle click to remove this value
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
                        // Handle click to reset range
                    }}
                >
                    {`${value[0]} - ${value[1]}`}
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
                        // Handle click to reset month
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

    console.log("Selected Filters:", selectedFilters);
    return selectedFilters;
};

const Filter: React.FC<FilterProps> = ({
    filters,
    values,
    onChange
}) => {
    const [selectedMonthData, setSelectedMonthData] = useState({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    });

    return (
        <div className="flex flex-col gap-5 max-w-xs w-full p-4 border-2 rounded-lg border-gray-200">
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
                                    defaultValue={value || ""}
                                    className="pl-10 w-full"
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
                                            onChange(filter.filterid.toString(), [])
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
                                    <div className="flex flex-wrap gap-2">
                                        {renderSelectedFilterValue(filters, values)}
                                    </div>
                                )}
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
                                        className="flex flex-col gap-2"
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
                                                        const newValue = Array.isArray(value)
                                                            ? checked
                                                                ? [...value, option.optionvalue]
                                                                : value.filter((v: string | number) => v !== option.optionvalue)
                                                            : checked
                                                                ? [option.optionvalue]
                                                                : [];
                                                        onChange(filter.filterid.toString(), newValue);
                                                    }}
                                                    className="size-5"
                                                />
                                                <Label htmlFor={`checkbox-${filter.filterid}-${option.optionvalue}`}>
                                                    {option.optionlabel}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                                                onChange(filter.filterid.toString(), [newMin, currentMax]);
                                            }}
                                            className="text-sm text-center"
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
                                                onChange(filter.filterid.toString(), [currentMin, newMax]);
                                            }}
                                            className="text-sm text-center"
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
                                        allowOverlap
                                        onChange={(newValues) => {
                                            onChange(filter.filterid.toString(), newValues);
                                        }}
                                        renderTrack={({ props, children }) => (
                                            <div
                                                {...props}
                                                className="w-full h-[10px] rounded bg-primary-50"
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
                                                    className="h-4 w-4 rounded-full bg-primary border-2 border-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                                    style={{
                                                        ...thumbProps.style,
                                                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
                                                    }}
                                                />
                                            );
                                        }}
                                    />
                                </div>

                                {/* Range labels */}
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>{filter.rangemin != null && formatPrice(filter.rangemin)}</span>
                                    <span>{filter.rangemax != null && formatPrice(filter.rangemax)}</span>
                                </div>
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
                                <div className="flex gap-5 items-center">
                                    <div className="flex flex-col gap-1 w-full">
                                        <Label className="text-sm">
                                            Tháng
                                        </Label>
                                        <Select
                                            value={`${value.month || new Date().getMonth() + 1}`}
                                            onValueChange={(value) => {
                                                setSelectedMonthData(prev => ({ ...prev, month: Number(value) }));
                                                onChange(filter.filterid.toString(), value);
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
                                            value={`${value.year || new Date().getFullYear()}`}
                                            onValueChange={(value) => {
                                                setSelectedMonthData(prev => ({ ...prev, year: Number(value) }));
                                                onChange(filter.filterid.toString(), value);
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