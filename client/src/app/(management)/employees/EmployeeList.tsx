import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Checkbox } from "@/components/ui/checkbox";
import PaginationComponent from "@/components/atomic/PaginationComponent";
import { Fragment, useState, useEffect } from "react";
import { Employees } from "@/types/types";
import { useRouter } from "next/navigation";

const EmployeeList = () => {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(10);
    const [pageSize, setPageSize] = useState(12);
    const [employees, setEmployees] = useState<Employees[]>([
        {
            employeeid: 1,
            role: "Quản lý sân",
            employee_type: "Bán thời gian",
            fingerprintid: 1,
            accounts: {
                accountid: 1,
                fullname: "Nguyễn Văn A",
                createdat: new Date("2023-01-01"),
            }
        },
        {
            employeeid: 2,
            role: "Quản lý kho hàng",
            employee_type: "Toàn thời gian",
            accounts: {
                accountid: 2,
                fullname: "Trần Thị B",
                createdat: new Date("2023-02-01"),
            }
        }
    ]);

    const [selectedEmployees, setSelectedEmployees] = useState<Employees[]>([]);

    const [currentPageSelectAll, setCurrentPageSelectAll] = useState(false);

    useEffect(() => {
        if (employees.length === 0) {
            setCurrentPageSelectAll(false);
            return;
        }

        const allSelected = employees.every(employee =>
            selectedEmployees.some(selected => selected.employeeid === employee.employeeid)
        );

        setCurrentPageSelectAll(allSelected);
    }, [employees, selectedEmployees]);

    const handleSelectAllChange = (checked: boolean) => {
        if (checked) {
            setSelectedEmployees(prev => {
                const currentIds = new Set(prev.map(e => e.employeeid));
                const newSelected = [...prev];

                employees.forEach(employee => {
                    if (!currentIds.has(employee.employeeid)) {
                        newSelected.push(employee);
                    }
                });

                return newSelected;
            });
        } else {
            setSelectedEmployees(prev =>
                prev.filter(selected =>
                    !employees.some(e => e.employeeid === selected.employeeid)
                )
            );
        }
    };

    const handleSingleCheckboxChange = (employee: Employees, checked: boolean) => {
        if (checked) {
            setSelectedEmployees(prev => [...prev, employee]);
        } else {
            setSelectedEmployees(prev => prev.filter(emp => emp.employeeid !== employee.employeeid));
        }
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            <span className="text-2xl font-semibold">Danh sách nhân viên</span>
            <div className="flex flex-col w-full">
                <div className="grid grid-cols-[50px_repeat(5,_minmax(150px,_1fr))_100px_150px] w-full items-center pb-2 border-b-2 border-gray-400">
                    <Checkbox
                        className="size-5 cursor-pointer"
                        checked={currentPageSelectAll}
                        onCheckedChange={(checked) => handleSelectAllChange(Boolean(checked))}
                    />
                    <span className="text-sm font-semibold">Mã nhân viên</span>
                    <span className="text-sm font-semibold">Tên nhân viên</span>
                    <span className="text-sm font-semibold">Vai trò</span>
                    <span className="text-sm font-semibold">Loại nhân viên</span>
                    <span className="text-sm font-semibold">Ngày bắt đầu làm việc</span>
                    <span className="text-sm font-semibold flex justify-center text-center">Xem chi tiết</span>
                    <span className="text-sm font-semibold flex justify-center text-center">Sinh trắc học vân tay (Nhấn để thêm)</span>
                </div>
                <div className="grid grid-cols-[50px_repeat(5,_minmax(150px,_1fr))_100px_150px] grid-rows-12 w-full items-center border-b-2 border-gray-400">
                    {employees.map((employee) => (
                        <Fragment key={`employee-${employee.employeeid}`}>
                            <div className="flex items-center py-2 h-14 border-b-2 border-gray-200">
                                <Checkbox
                                    checked={selectedEmployees.some(selected => selected.employeeid === employee.employeeid)}
                                    onCheckedChange={(checked) => handleSingleCheckboxChange(employee, Boolean(checked))}
                                    className="size-5 cursor-pointer"
                                />
                            </div>
                            <div className="flex items-center text-sm py-2 h-14 border-b-2 border-gray-200">{employee.employeeid}</div>
                            <div className="flex items-center text-sm py-2 h-14 border-b-2 border-gray-200">{employee.accounts?.fullname}</div>
                            <div className="flex items-center text-sm py-2 h-14 border-b-2 border-gray-200">{employee.role}</div>
                            <div className="flex items-center text-sm py-2 h-14 border-b-2 border-gray-200">{employee.employee_type}</div>
                            <div className="flex items-center text-sm py-2 h-14 border-b-2 border-gray-200">{(employee.accounts?.createdat)?.toLocaleDateString("vi-VN", {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            })}</div>
                            <div className="flex items-center justify-center py-2 h-14 border-b-2 border-gray-200">
                                <Icon
                                    icon="material-symbols:info-outline-rounded"
                                    className="size-8 text-primary-300 cursor-pointer hover:text-primary-500"
                                />
                            </div>
                            <div className="flex items-center justify-center text-sm py-2 h-14 border-b-2 border-gray-200">
                                <Button
                                    variant={employee.fingerprintid ? "default" : "outline_destructive"}
                                    className={`w-full ${employee.fingerprintid ? "cursor-default" : ""}`}
                                    onClick={() => {
                                        if (!employee.fingerprintid) {
                                            router.push(`/fingerprint?employeeid=${employee.employeeid}&fullname=${encodeURIComponent(employee.accounts?.fullname || "")}`);
                                        }
                                    }}
                                >
                                    {employee.fingerprintid ? "Đã thêm" : "Chưa thêm"}
                                </Button>
                            </div>
                        </Fragment>
                    ))}
                </div>
            </div>
            <div className="flex justify-between items-center w-full">
                <span className="text-primary">Đã chọn <b>{selectedEmployees.length}</b> nhân viên</span>
                <div>
                    <PaginationComponent
                        page={page}
                        setPage={setPage}
                        totalPages={totalPages}
                    />
                </div>
                <div className="flex gap-4">
                    <Button variant="outline_destructive">
                        Xóa nhân sự
                    </Button>
                    <Button variant="outline">
                        Thêm nhân sự
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default EmployeeList;