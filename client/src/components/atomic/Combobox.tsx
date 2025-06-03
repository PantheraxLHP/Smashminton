"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export interface ComboboxItem {
    cblabel: string,
    cbvalue: string | number,
}

interface ComboboxProps {
    cbSearchLabel: string,
    items: ComboboxItem[],
    selectedValue?: string | number | null | undefined,
    onSelect: React.Dispatch<React.SetStateAction<string | number | null | undefined>>,
}

const Combobox: React.FC<ComboboxProps> = ({
    cbSearchLabel,
    items,
    selectedValue,
    onSelect,
}) => {
    const [open, setOpen] = React.useState(false)
    const [triggerWidth, setTriggerWidth] = React.useState<number>(0)
    const triggerRef = React.useRef<HTMLButtonElement>(null)

    React.useEffect(() => {
        if (triggerRef.current) {
            setTriggerWidth(triggerRef.current.offsetWidth)
        }
    }, [open])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    ref={triggerRef}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {selectedValue
                        ? items.find((item) => item.cbvalue === selectedValue)?.cblabel
                        : `Chọn ${cbSearchLabel} ...`}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="p-0"
                style={{ width: triggerWidth || 'auto' }}
            >
                <Command>
                    <CommandInput placeholder={`Chọn ${cbSearchLabel} ...`} className="h-9" />
                    <CommandList>
                        <CommandEmpty>{`Không tìm thấy ${cbSearchLabel}`}</CommandEmpty>
                        <CommandGroup>
                            {items.map((item) => (
                                <CommandItem
                                    key={item.cbvalue}
                                    value={(item.cbvalue).toString()}
                                    onSelect={(newValue) => {
                                        onSelect(newValue === selectedValue ? undefined : newValue)
                                        setOpen(false)
                                    }}
                                >
                                    {item.cblabel}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            selectedValue === item.cbvalue ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default Combobox;