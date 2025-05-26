import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

const discountCodes = [
    { value: "STUDENT10", label: "Giảm 10% - Học sinh" },
    { value: "FREESHIP", label: "Miễn phí vận chuyển" },
    { value: "SAVE20", label: "Giảm 20k" },
];

export function DiscountCodeSelector() {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[220px] justify-between border-black text-black border-1 rounded-md hover:bg-primary-50 hover:text-black hover:border-black"
                >
                    {value
                        ? discountCodes.find((code) => code.value === value)?.label
                        : "Chọn mã giảm giá"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[220px] p-0">
                <Command>
                    <CommandList>
                        <CommandGroup>
                            {discountCodes.map((code) => (
                                <CommandItem
                                    key={code.value}
                                    value={code.value}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue);
                                        setOpen(false);
                                    }}
                                >
                                    {code.label}
                                    <Check
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            value === code.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
