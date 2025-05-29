import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Icon } from '@iconify/react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    RadioGroup,
    RadioGroupItem,
} from '@/components/ui/radio-group';
import { Range } from 'react-range';
import { formatPrice } from '@/lib/utils';

export type FilterType = 'search' | 'selectedFilter' | 'checkbox' | 'radio' | 'range' | 'monthyear';

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

const Filter: React.FC<FilterProps> = ({ filters, values, setFilterValues }) => {
    // Render các Badge/Tag giá trị filter đã chọn
    const renderSelectedFilterValue = (filters: FilterConfig[], values: Record<string, any>) => {
        const selectedFilters: React.ReactNode[] = [];

        filters.forEach((filter) => {
            const value = values[filter.filterid];

            if (filter.filtertype === 'search' && value) {
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
                        <Icon icon="streamline:delete-1-solid" className="size-2.5" />
                    </Button>,
                );
            } else if (
                (filter.filtertype === 'checkbox' || filter.filtertype === 'radio') &&
                Array.isArray(value) &&
                value.length > 0
            ) {
                value.forEach((optionvalue: string | number) => {
                    const optionlabel = filter.filteroptions?.find(
                        (opt) => opt.optionvalue === optionvalue,
                    )?.optionlabel;

                    selectedFilters.push(
                        <Button
                            key={`${filter.filtertype}-${filter.filterid}-${optionvalue}`}
                            variant="default"
                            size="xs"
                            className="rounded-lg"
                            onClick={() => {
                                handleRemoveFilter(filter.filterid, optionvalue);
                            }}
                        >
                            {optionlabel || optionvalue}
                            <Icon icon="streamline:delete-1-solid" className="size-2.5" />
                        </Button>,
                    );
                });
            } else if (filter.filtertype === 'range' && Array.isArray(value)) {
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
                        <Icon icon="streamline:delete-1-solid" className="size-2.5" />
                    </Button>,
                );
            } else if (filter.filtertype === 'monthyear' && value) {
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
                        <Icon icon="streamline:delete-1-solid" className="size-2.5" />
                    </Button>,
                );
            }
        });
        return selectedFilters;
    };

    const handleFilterChange = (filterid: string, value: any) => {
        const type = filters.find((f) => f.filterid === filterid)?.filtertype;
        setFilterValues((prev) => {
            const updated = { ...prev };
            if (type === 'search' || type === 'range' || type === 'monthyear') {
                updated[filterid] = value;
            } else if (type === 'checkbox') {
                const arr = Array.isArray(prev[filterid]) ? [...prev[filterid]] : [];
                const idx = arr.indexOf(value);
                if (idx > -1) {
                    arr.splice(idx, 1);
                } else {
                    arr.push(value);
                }
                updated[filterid] = arr;
            } else if (type === 'radio') {
                // For radio, only allow single selection
                updated[filterid] = [value];
            }
            return updated;
        });
    };

    const handleRemoveFilter = (filterid: string, removeValue?: string | number) => {
        const type = filters.find((f) => f.filterid === filterid)?.filtertype;
        setFilterValues((prev) => {
            const updated = { ...prev };
            if (type === 'search' || type === 'range' || type === 'monthyear') {
                updated[filterid] = undefined;
            } else if (type === 'checkbox' || type === 'radio') {
                const arr = Array.isArray(prev[filterid]) ? [...prev[filterid]] : [];
                const idx = arr.indexOf(removeValue);
                if (idx > -1) {
                    arr.splice(idx, 1);
                }
                updated[filterid] = arr.length > 0 ? arr : undefined;
            }
            return updated;
        });
    };

    const handleRemoveAllFilters = () => {
        filters.forEach((filter) => {
            if (
                (filter.filtertype === 'checkbox' || filter.filtertype === 'radio') &&
                Array.isArray(values[filter.filterid])
            ) {
                values[filter.filterid].forEach((optionvalue: string | number) => {
                    handleRemoveFilter(filter.filterid, optionvalue);
                });
            } else if (
                filter.filtertype === 'search' ||
                filter.filtertype === 'range' ||
                filter.filtertype === 'monthyear'
            ) {
                if (values[filter.filterid] !== undefined && values[filter.filterid] !== null) {
                    handleRemoveFilter(filter.filterid);
                }
            }
        });
    };

    return (
        <div className="flex w-full max-w-xs flex-col gap-5 rounded-lg border-2 border-gray-200 p-4">
            {filters.map((filter) => {
                const value = values[filter.filterid];

                switch (filter.filtertype) {
                    case 'search':
                        return (
                            <div key={`filter-${filter.filterid}`} className="relative w-full">
                                <Icon
                                    icon="material-symbols:search-rounded"
                                    className="absolute top-1/2 left-3 size-5 -translate-y-1/2"
                                />
                                <Input
                                    name="search_rulename"
                                    type="text"
                                    placeholder={filter.filterlabel}
                                    value={value || ''}
                                    className="w-full pl-10"
                                    onChange={(e) => {
                                        const searchValue = e.target.value;
                                        handleFilterChange(filter.filterid, searchValue);
                                    }}
                                />
                            </div>
                        );
                    case 'selectedFilter':
                        return (
                            <div key={`filter-${filter.filterid}`} className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-primary text-lg font-semibold">Bạn chọn</span>
                                    <Button
                                        variant="link"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveAllFilters();
                                        }}
                                    >
                                        Bỏ hết
                                        <Icon icon="streamline:delete-1-solid" className="size-3" />
                                    </Button>
                                </div>
                                {Object.keys(values).length > 0 && (
                                    <div className="mb-4 flex flex-wrap gap-1">
                                        {renderSelectedFilterValue(filters, values)}
                                    </div>
                                )}
                                <div className="border-1 border-gray-300"></div>
                            </div>
                        );
                    case 'checkbox':
                        return (
                            <div key={`filter-${filter.filterid}`} className="flex flex-col gap-2">
                                <div className="font-semibold">{filter.filterlabel}</div>
                                {(filter.filteroptions?.length || 0) > 0 && (
                                    <div key={`checkbox-${filter.filterid}`} className="mb-4 flex flex-col gap-2">
                                        {filter.filteroptions?.map((option) => (
                                            <div key={option.optionvalue} className="flex items-center gap-2">
                                                <Checkbox
                                                    id={`checkbox-${filter.filterid}-${option.optionvalue}`}
                                                    checked={
                                                        Array.isArray(value)
                                                            ? value.includes(option.optionvalue)
                                                            : false
                                                    }
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
                    case 'radio':
                        return (
                            <div key={`filter-${filter.filterid}`} className="flex flex-col gap-2">
                                <div className="font-semibold">{filter.filterlabel}</div>
                                {(filter.filteroptions?.length || 0) > 0 && (
                                    <div
                                        key={`radio-${filter.filterid}`} className="mb-4 flex flex-col gap-2"
                                    >
                                        <RadioGroup
                                            value={`${value[0]}`}
                                            onValueChange={(newValue) => {
                                                handleFilterChange(filter.filterid, Number(newValue));
                                            }}
                                        >
                                            {filter.filteroptions?.map((option) => (
                                                <div
                                                    key={`radio-${filter.filterid}-${option.optionvalue}`} className="flex items-center gap-2"
                                                >
                                                    <RadioGroupItem
                                                        id={`${option.optionvalue}`}
                                                        value={`${option.optionvalue}`}
                                                        className="cursor-pointer"
                                                    />
                                                    <Label
                                                        htmlFor={`${option.optionvalue}`}
                                                        className="cursor-pointer"
                                                    >
                                                        {option.optionlabel}
                                                    </Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    </div>
                                )}
                                <div className="border-1 border-gray-300"></div>
                            </div>
                        );
                    case 'range':
                        return (
                            <div key={`filter-${filter.filterid}`} className="flex w-full flex-col gap-2">
                                <span className="font-semibold">{filter.filterlabel}</span>

                                {/* Input boxes for direct value entry */}
                                <div className="flex items-center justify-between">
                                    <div className="w-full">
                                        <Input
                                            type="number"
                                            min={filter.rangemin}
                                            max={filter.rangemax}
                                            value={
                                                Array.isArray(values[filter.filterid])
                                                    ? values[filter.filterid][0]
                                                    : filter.rangemin
                                            }
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

                                    <div className="mx-2 h-1 w-5 bg-gray-500"></div>

                                    <div className="w-full">
                                        <Input
                                            type="number"
                                            min={filter.rangemin}
                                            max={filter.rangemax}
                                            value={
                                                Array.isArray(values[filter.filterid])
                                                    ? values[filter.filterid][1]
                                                    : filter.rangemax
                                            }
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
                                                className="bg-primary-50 h-3 w-full rounded"
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
                                                    className="bg-primary focus:ring-primary h-5 w-5 rounded-full border-2 border-white focus:ring-2 focus:ring-offset-2 focus:outline-none"
                                                    style={{
                                                        ...thumbProps.style,
                                                        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.3)',
                                                    }}
                                                />
                                            );
                                        }}
                                    />
                                </div>

                                {/* Chú thích Range (giá trị min-max) */}
                                <div className="mb-4 flex justify-between text-xs text-gray-500">
                                    <span>{filter.rangemin != null && formatPrice(filter.rangemin)}</span>
                                    <span>{filter.rangemax != null && formatPrice(filter.rangemax)}</span>
                                </div>
                                <div className="border-1 border-gray-300"></div>
                            </div>
                        );
                    case 'monthyear':
                        return (
                            <div className="flex flex-col gap-2" key={`filter-${filter.filterid}`}>
                                <span className="font-semibold">{filter.filterlabel}</span>
                                <div className="mb-4 flex items-center gap-5">
                                    <div className="flex w-full flex-col gap-1">
                                        <Label className="text-sm">Tháng</Label>
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
                                                    <SelectItem key={`Month-${i + 1}`} value={`${i + 1}`}>
                                                        Tháng {i + 1}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex w-full flex-col gap-1">
                                        <Label className="text-sm">Năm</Label>
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
                                                {Array.from({ length: new Date().getFullYear() - 2000 + 1 }, (_, i) => (
                                                    <SelectItem key={`Year-${2000 + i}`} value={`${2000 + i}`}>
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
};

export default Filter;
