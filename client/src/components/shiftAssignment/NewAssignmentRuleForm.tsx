'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';

const formSchema = z.object({
    rulename: z.string().min(1),
    rulestatus: z.boolean().default(true).optional(),
    ruledescription: z.string().optional(),
    ruleappliedfor: z.string(),
    ruletype: z.string().min(1),
    rulevalue: z.string().min(1),
    rulesql: z.string(),
    ctename: z.string().min(1),
    columnname: z.string().min(1),
    condition: z.string().min(1),
});

export default function NewAssignmentRuleForm() {
    const ruleappliedfor = [
        {
            label: 'Nhân viên',
            value: 'Employee',
        },
        {
            label: 'Ca làm việc',
            value: 'Shift',
        },
    ] as const;
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            console.log(values);
            toast(
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(values, null, 2)}</code>
                </pre>,
            );
        } catch (error) {
            console.error('Form submission error', error);
            toast.error('Không thể tạo quy tắc phân công mới, vui lòng thử lại sau');
        }
    }

    return (
        <Form {...form}>
            <form
                id="new-assignment-rule-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="mx-auto mt-2 w-full space-y-5"
            >
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="rulename"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên quy tắc</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Quy tắc phân công mới" type="text" {...field} />
                                    </FormControl>
                                    <FormDescription>Tên hiển thị của quy tắc</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="rulestatus"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Áp dụng ngay</FormLabel>
                                        <FormDescription>
                                            Dùng để chỉnh trạng thái áp dụng của quy tắc mới thêm
                                        </FormDescription>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name="ruledescription"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mô tả quy tắc</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Dùng để ..." className="resize-none" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="ruleappliedfor"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Quy tắc áp dụng cho</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                                'w-[200px] justify-between',
                                                !field.value && 'text-muted-foreground',
                                            )}
                                        >
                                            {field.value
                                                ? ruleappliedfor.find((forobj) => forobj.value === field.value)?.label
                                                : 'Chọn đối tượng áp dụng'}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Tìm kiếm đối tượng" />
                                        <CommandList>
                                            <CommandEmpty>Không tìm thấy đối tượng</CommandEmpty>
                                            <CommandGroup>
                                                {ruleappliedfor.map((forobj) => (
                                                    <CommandItem
                                                        value={forobj.label}
                                                        key={forobj.value}
                                                        onSelect={() => {
                                                            form.setValue('ruleappliedfor', forobj.value);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                'mr-2 h-4 w-4',
                                                                forobj.value === field.value
                                                                    ? 'opacity-100'
                                                                    : 'opacity-0',
                                                            )}
                                                        />
                                                        {forobj.label}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <FormDescription>Đối tượng được áp dụng quy tắc</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="ruletype"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Loại quy tắc</FormLabel>
                            <FormControl>
                                <Input placeholder="WHERE, WHERE, ORDER" type="text" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="rulevalue"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Giá trị của quy tắc</FormLabel>
                            <FormControl>
                                <Input placeholder="2, 10, ASC" type="text" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end">
                    <Button type="button" variant="outline">
                        Kiểm tra quy tắc
                    </Button>
                </div>

                <FormField
                    control={form.control}
                    name="rulesql"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Định nghĩa quy tắc (SQL dưới dạng Common Table Expression)</FormLabel>
                            <FormControl>
                                <Textarea placeholder="newCTE AS (...)" className="resize-none" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="ctename"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tên CTE</FormLabel>
                            <FormControl>
                                <Input placeholder="newCTE ncte" type="text" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="columnname"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tên cột chứa giá trị cần so sánh</FormLabel>
                            <FormControl>
                                <Input placeholder="ncte.comparecolumn" type="text" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="condition"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cấu trúc áp dụng của quy tắc</FormLabel>
                            <FormControl>
                                <Input placeholder="comparecolumn < rulevalue" type="text" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}
