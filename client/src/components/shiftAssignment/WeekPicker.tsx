import React, { useState } from "react";
import { DropdownProps, DayPicker, DateRange, rangeIncludesDate, CalendarWeek } from "react-day-picker";
import { vi } from "date-fns/locale";
import "react-day-picker/style.css";
import { endOfWeek, getWeek, addMonths, startOfWeek } from "date-fns";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

function CustomSelectDropdown(props: DropdownProps) {
    const { options, value, onChange } = props;

    const handleValueChange = (newValue: string) => {
        if (onChange) {
            const syntheticEvent = {
                target: {
                    value: newValue
                }
            } as React.ChangeEvent<HTMLSelectElement>;

            onChange(syntheticEvent);
        }
    };

    return (
        <Select value={value?.toString()} onValueChange={handleValueChange}>
            <SelectTrigger className="p-1 text-[0.65rem]">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {options?.map((option) => (
                        <SelectItem
                            key={option.value}
                            value={option.value.toString()}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

export interface WeekPickerProps {
    selectedWeek?: DateRange;
    setSelectedWeek?: (week: DateRange) => void;
    weekNumber?: number;
    setWeekNumber?: (weekNumber: number) => void;
    year?: number;
    setYear?: (year: number) => void;
}

export const WeekPickerCalendar: React.FC<WeekPickerProps> = ({
    selectedWeek,
    setSelectedWeek,
    weekNumber,
    setWeekNumber,
    year,
    setYear,
}) => {
    const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
    const [month, setMonth] = useState(new Date());

    const handleCurrentWeekClick = () => {
        setSelectedWeek?.({
            from: startOfWeek(new Date(), { weekStartsOn: 1 }),
            to: endOfWeek(new Date(), { weekStartsOn: 1 })
        });
        setWeekNumber?.(getWeek(new Date(), { weekStartsOn: 1 }));
        setMonth(new Date());
        setSelectedDay(undefined);
    }

    const isClickableWeek = (week: CalendarWeek) => {
        const weekStart = week.days[0].date;
        const weekEnd = week.days[week.days.length - 1].date;
        const today = new Date();
        if (weekStart <= today || weekEnd <= today) {
            return true;
        }
        else {
            return false;
        }
    }

    const handleWeekNumberClick = (week: CalendarWeek) => {
        const weekStart = week.days[0].date;
        const weekEnd = week.days[week.days.length - 1].date;

        if (isClickableWeek(week)) {
            setSelectedWeek?.({
                from: weekStart,
                to: weekEnd
            });
            setYear?.(weekStart.getFullYear());
            setWeekNumber?.(week.weekNumber);
            setSelectedDay(undefined);
        }
    }

    return (
        <>
            <div className="w-full">
                <DayPicker className="custom-day-picker-format"
                    month={month}
                    onMonthChange={setMonth}
                    captionLayout="dropdown"
                    animate
                    ISOWeek
                    mode="single"
                    selected={selectedDay}
                    onSelect={setSelectedDay}
                    numerals="latn"
                    showOutsideDays
                    showWeekNumber
                    timeZone="Asia/Saigon"
                    locale={vi}
                    startMonth={new Date(2020, 0)}
                    endMonth={addMonths(new Date(), 12)}
                    disabled={{ after: new Date() }}
                    components={{
                        Dropdown: CustomSelectDropdown,
                        WeekNumber: ({ week }) => (
                            <td
                                className={`rdp-week_number ${week.weekNumber === weekNumber ? 'bg-primary-500 text-white' : ''} ${isClickableWeek(week) ? "cursor-pointer" : ""}`}
                                onClick={() => handleWeekNumberClick(week)}
                            >
                                {week.weekNumber}
                            </td>
                        )
                    }}
                    modifiers={{
                        selected: selectedWeek,
                        range_start: selectedWeek?.from,
                        range_end: selectedWeek?.to,
                        range_middle: (date: Date) =>
                            selectedWeek
                                ? rangeIncludesDate(selectedWeek, date, true,)
                                : false
                    }}
                    onDayClick={(day, modifiers) => {
                        if (modifiers.selected) {
                            return;
                        }
                        setSelectedWeek?.({
                            from: startOfWeek(day, { weekStartsOn: 1 }),
                            to: endOfWeek(day, { weekStartsOn: 1 })
                        });
                        setWeekNumber?.(getWeek(day, { weekStartsOn: 1 }));
                        setYear?.(day.getFullYear());
                    }}
                    footer={
                        <div className="flex flex-col items-end px-3 pb-3" >
                            <Button variant="link" className="text-xs p-0" onClick={handleCurrentWeekClick}>
                                Tuần hiện tại
                            </Button>
                        </div>
                    }
                />
            </div>
            <style>
                {`
                    .custom-day-picker-format {
                        --rdp-accent-color: var(--color-primary-500);
                        --rdp-accent-background-color: var(--color-primary-50);
                        --rdp-range_start-color: inherit;
                        --rdp-range_start-date-background-color: var(--rdp-accent-background-color);
                        --rdp-range_end-color: inherit;
                        --rdp-range_end-date-background-color: var(--rdp-accent-background-color);
                        --rdp-selected-border: 1px solid var(--rdp-accent-color);
                        --rdp-day-width: 1.5rem;
                        --rdp-day-height: 1.5rem;
                        --rdp-day_button-height: 1.5rem;
                        --rdp-day_button-width: 1.5rem;
                        width: 200px;
                    }


                    .rdp-range_middle .rdp-day_button {
                        border-top: var(--rdp-selected-border);
                        border-bottom: var(--rdp-selected-border);
                        color: var(--rdp-range_middle-color);
                    }

                    .rdp-range_start .rdp-day_button {
                        border: unset;
                        border-top: var(--rdp-selected-border);
                        border-bottom: var(--rdp-selected-border);
                        border-left: var(--rdp-selected-border);
                        border-radius: unset;
                        color: var(--rdp-range_middle-color);
                    }

                    .rdp-range_end .rdp-day_button {
                        border: unset;
                        border-top: var(--rdp-selected-border);
                        border-bottom: var(--rdp-selected-border);
                        border-right: var(--rdp-selected-border);
                        border-radius: unset;
                        color: var(--rdp-range_middle-color);
                    }

                    .rdp-day {
                        font-size: 0.65rem;
                    }

                    .rdp-weekday {
                        font-size: 0.65rem;
                    }

                    .rdp-week_number {
                        font-size: 0.65rem;
                    }

                    .rdp-button_next, .rdp-button_previous {
                        width: 1rem;
                        height: 1rem;
                    }

                    .rdp-month_caption {
                        padding: 5px;
                    }
                `}
            </style>
        </>
    );
}

const WeekPicker: React.FC<WeekPickerProps> = ({
    selectedWeek,
    setSelectedWeek,
    weekNumber,
    setWeekNumber,
    year,
    setYear,
}) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-[200px] text-lg">
                    <>
                        {weekNumber && year ? (
                            <div>
                                {`Tuần ${weekNumber}, ${year}`}
                            </div>
                        ) : (
                            <div>Chọn tuần</div>
                        )}
                    </>
                    <Icon icon="mdi:calendar-outline" className="size-5" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 !z-1" sideOffset={5}>
                <WeekPickerCalendar
                    selectedWeek={selectedWeek}
                    setSelectedWeek={setSelectedWeek}
                    weekNumber={weekNumber}
                    setWeekNumber={setWeekNumber}
                    year={year}
                    setYear={setYear}
                />
            </PopoverContent>
        </Popover>
    );
}

export default WeekPicker;