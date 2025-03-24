"use client";

import * as RadixTooltip from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

export function Tooltip({ children }: { children: React.ReactNode }) {
    return (
        <RadixTooltip.Provider delayDuration={0}>
            {children}
        </RadixTooltip.Provider>
    );
}

export function TooltipRoot({
    children,
    open,
    onOpenChange,
}: {
    children: React.ReactNode;
    open?: boolean; // Thêm prop open để kiểm soát trạng thái mở/đóng
    onOpenChange?: (open: boolean) => void; // Callback khi trạng thái thay đổi
}) {
    return (
        <RadixTooltip.Root open={open} onOpenChange={onOpenChange}>
            {children}
        </RadixTooltip.Root>
    );
}

export function TooltipTrigger({ children }: { children: React.ReactNode }) {
    return <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>;
}

export function TooltipContent({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <RadixTooltip.Portal>
            <RadixTooltip.Content
                side="top"
                align="end"
                className={cn(
                    "bg-white text-sm text-black shadow-lg rounded-md px-3 py-2 max-w-xs",
                    "border border-gray-200",
                    "animate-fadeIn",
                    className
                )}
            >
                {children}
                <RadixTooltip.Arrow className="fill-white" />
            </RadixTooltip.Content>
        </RadixTooltip.Portal>
    );
}
