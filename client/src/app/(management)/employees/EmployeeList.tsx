import PaginationComponent from "@/components/atomic/PaginationComponent";
import EmployeeAddForm from "./EmployeeAddForm";
import EmployeeDetails from "./EmployeeDetails";
import { Fragment, useState, useEffect } from "react";
import { Employees } from "@/types/types";
import { useRouter } from "next/navigation";
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

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
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

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
            setSelectedEmployees(prev => {
                const currentIds = new Set(employees.map(e => e.employeeid));
                return prev.filter(employee => !currentIds.has(employee.employeeid));
            });
        }
    };

    const handleSingleCheckboxChange = (employee: Employees, checked: boolean) => {
        if (checked) {
            setSelectedEmployees(prev => {
                const currentIds = new Set(prev.map(e => e.employeeid));
                if (!currentIds.has(employee.employeeid)) {
                    return [...prev, employee];
                }
                return prev;
            });
        } else {
            setSelectedEmployees(prev => {
                return prev.filter(selected => selected.employeeid !== employee.employeeid);
            });
        }
    }

    return (
        <div className="flex flex-col gap-4 w-full overflow-x-auto">
            <span className="text-2xl font-semibold w-full min-w-max">Danh sách nhân viên</span>
            <div className="flex flex-col w-full min-w-max overflow-x-auto">
                {/* Table Header - 8 cols*/}
                <div className="grid grid-cols-[50px_repeat(5,_minmax(150px,_1fr))_100px_150px] min-w-max items-center pb-2 border-b-2 border-gray-400 w-full">
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
                {/* Table Content - 8 cols - 12 rows */}
                <div className="grid grid-cols-[50px_repeat(5,_minmax(150px,_1fr))_100px_150px] grid-rows-12 min-w-max items-center border-b-2 border-gray-400 w-full">
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
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Icon
                                            icon="material-symbols:info-outline-rounded"
                                            className="size-8 text-primary-300 cursor-pointer hover:text-primary-500"
                                        />
                                    </DialogTrigger>
                                    <DialogContent className="!max-w-[80vw] h-[80vh] overflow-y-auto !flex flex-col gap-2">
                                        <DialogHeader className="!h-1">
                                            <DialogTitle className="!h-fit">
                                                <VisuallyHidden>
                                                    {`Chi tiết thông tin của nhân viên ${employee.accounts?.fullname || "chưa có tên"}`}
                                                </VisuallyHidden>
                                            </DialogTitle>
                                        </DialogHeader>
                                        <EmployeeDetails />
                                    </DialogContent>
                                </Dialog>
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
            {/*Số lượng nhân viên được chọn, phân trang, hành động thêm/xóa nhân viên */}
            <div className="flex justify-between items-center gap-5 w-full min-w-max">
                <span className="text-primary">Đã chọn <b>{selectedEmployees.length}</b> nhân viên</span>
                <div>
                    <PaginationComponent
                        page={page}
                        setPage={setPage}
                        totalPages={totalPages}
                    />
                </div>                
                <div className="flex gap-4">
                    {/* Dialog khi nhấn nút xóa nhân sự */}
                    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <Button
                            variant="outline_destructive"
                            className="w-30"
                            onClick={() => {
                                if (selectedEmployees.length > 0) {
                                    setIsDeleteDialogOpen(true)
                                } else {
                                    toast.error("Vui lòng chọn ít nhất một nhân sự để xóa.");
                                }
                            }}
                        >
                            Xóa nhân sự
                        </Button>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Xác nhận xóa</DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col">
                                Bạn có chắc chắn muốn xóa {selectedEmployees.length} nhân sự đã chọn không?
                                <span className="text-red-500">Hành động này không thể hoàn tác.</span>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="secondary"
                                    onClick={() => setIsDeleteDialogOpen(false)}
                                >
                                    Thoát
                                </Button>
                                <Button
                                    variant="outline_destructive"
                                    onClick={() => { }}
                                >
                                    Xóa
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    {/* Dialog khi nhấn nút thêm nhân sự */}
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-30">
                                Thêm nhân sự
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Thêm nhân sự mới</DialogTitle>
                            </DialogHeader>
                            <EmployeeAddForm />
                            <DialogFooter>
                                <Button
                                    variant="secondary"
                                    onClick={() => setIsAddDialogOpen(false)}
                                >
                                    Thoát
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => { }}
                                >
                                    Thêm
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}

export default EmployeeList;