import PaginationComponent from '@/components/atomic/PaginationComponent';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getEmployees } from '@/services/employees.service';
import { Accounts, Employees } from '@/types/types';
import { Icon } from '@iconify/react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { toast } from 'sonner';
import EmployeeAddForm from './EmployeeAddForm';
import EmployeeDetails from './EmployeeDetails';

export interface EmployeesProps extends Employees, Accounts {
    cccd: string;
}

interface EmployeeListProps {
    filterValue: Record<string, any>;
}

const EmployeeList = ({ filterValue }: EmployeeListProps) => {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(10);
    const [pageSize, setPageSize] = useState(12);
    const [employees, setEmployees] = useState<EmployeesProps[]>([]);

    const [selectedEmployees, setSelectedEmployees] = useState<Employees[]>([]);
    const [currentPageSelectAll, setCurrentPageSelectAll] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const fetchEmployees = async () => {
        const result = await getEmployees(page, pageSize);
        if (!result.ok) {
            setEmployees([]);
        } else {
            setEmployees(result.data.data);
            setTotalPages(result.data.pagination.totalPages);
            setPage(result.data.pagination.page);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, [filterValue, page, pageSize]);

    useEffect(() => {
        if (employees.length === 0) {
            setCurrentPageSelectAll(false);
            return;
        }

        const allSelected = employees.every((employee) =>
            selectedEmployees.some((selected) => selected.employeeid === employee.employeeid),
        );

        setCurrentPageSelectAll(allSelected);
    }, [employees, selectedEmployees]);

    const handleSelectAllChange = (checked: boolean) => {
        if (checked) {
            setSelectedEmployees((prev) => {
                const currentIds = new Set(prev.map((e) => e.employeeid));
                const newSelected = [...prev];

                employees.forEach((employee) => {
                    if (!currentIds.has(employee.employeeid)) {
                        newSelected.push(employee);
                    }
                });

                return newSelected;
            });
        } else {
            setSelectedEmployees((prev) => {
                const currentIds = new Set(employees.map((e) => e.employeeid));
                return prev.filter((employee) => !currentIds.has(employee.employeeid));
            });
        }
    };

    const handleSingleCheckboxChange = (employee: Employees, checked: boolean) => {
        if (checked) {
            setSelectedEmployees((prev) => {
                const currentIds = new Set(prev.map((e) => e.employeeid));
                if (!currentIds.has(employee.employeeid)) {
                    return [...prev, employee];
                }
                return prev;
            });
        } else {
            setSelectedEmployees((prev) => {
                return prev.filter((selected) => selected.employeeid !== employee.employeeid);
            });
        }
    };

    return (
        <div className="flex w-full flex-col gap-4 overflow-x-auto">
            <span className="w-full min-w-max text-2xl font-semibold">Danh sách nhân viên</span>
            <div className="flex w-full min-w-max flex-col overflow-x-auto">
                {/* Table Header - 8 cols*/}
                <div className="grid w-full min-w-max grid-cols-[50px_repeat(5,_minmax(150px,_1fr))_100px_150px] items-center border-b-2 border-gray-400 pb-2">
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
                    <span className="flex justify-center text-center text-sm font-semibold">Xem chi tiết</span>
                    <span className="flex justify-center text-center text-sm font-semibold">
                        Sinh trắc học vân tay (Nhấn để thêm)
                    </span>
                </div>
                {/* Table Content - 8 cols - 12 rows */}
                <div className="grid w-full min-w-max grid-cols-[50px_repeat(5,_minmax(150px,_1fr))_100px_150px] grid-rows-12 items-center border-b-2 border-gray-400">
                    {employees.map((employee) => (
                        <Fragment key={`employee-${employee.employeeid}`}>
                            <div className="flex h-14 items-center border-b-2 border-gray-200 py-2">
                                <Checkbox
                                    checked={selectedEmployees.some(
                                        (selected) => selected.employeeid === employee.employeeid,
                                    )}
                                    onCheckedChange={(checked) =>
                                        handleSingleCheckboxChange(employee, Boolean(checked))
                                    }
                                    className="size-5 cursor-pointer"
                                />
                            </div>
                            <div className="flex h-14 items-center border-b-2 border-gray-200 py-2 text-sm">
                                {employee.employeeid}
                            </div>
                            <div className="flex h-14 items-center border-b-2 border-gray-200 py-2 text-sm">
                                {employee.fullname}
                            </div>
                            <div className="flex h-14 items-center border-b-2 border-gray-200 py-2 text-sm">
                                {employee.role}
                            </div>
                            <div className="flex h-14 items-center border-b-2 border-gray-200 py-2 text-sm">
                                {employee.employee_type}
                            </div>
                            <div className="flex h-14 items-center border-b-2 border-gray-200 py-2 text-sm">
                                {employee.createdat
                                    ? new Date(employee.createdat).toLocaleDateString('vi-VN', {
                                          year: 'numeric',
                                          month: '2-digit',
                                          day: '2-digit',
                                      })
                                    : ''}
                            </div>
                            <div className="flex h-14 items-center justify-center border-b-2 border-gray-200 py-2">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Icon
                                            icon="material-symbols:info-outline-rounded"
                                            className="text-primary-300 hover:text-primary-500 size-8 cursor-pointer"
                                        />
                                    </DialogTrigger>
                                    <DialogContent className="!flex h-[80vh] !max-w-[80vw] flex-col gap-2 overflow-y-auto">
                                        <DialogHeader className="!h-1">
                                            <DialogTitle className="!h-fit">
                                                <VisuallyHidden>
                                                    {`Chi tiết thông tin của nhân viên ${employee.accounts?.fullname || 'chưa có tên'}`}
                                                </VisuallyHidden>
                                            </DialogTitle>
                                        </DialogHeader>
                                        <EmployeeDetails employee={employee} />
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <div className="flex h-14 items-center justify-center border-b-2 border-gray-200 py-2 text-sm">
                                <Button
                                    variant={employee.fingerprintid ? 'default' : 'outline_destructive'}
                                    className={`w-full ${employee.fingerprintid ? 'cursor-default' : ''}`}
                                    onClick={() => {
                                        if (!employee.fingerprintid) {
                                            router.push(
                                                `/fingerprint?employeeid=${employee.employeeid}&fullname=${encodeURIComponent(employee.fullname || '')}`,
                                            );
                                        }
                                    }}
                                >
                                    {employee.fingerprintid ? 'Đã thêm' : 'Chưa thêm'}
                                </Button>
                            </div>
                        </Fragment>
                    ))}
                </div>
            </div>
            {/*Số lượng nhân viên được chọn, phân trang, hành động thêm/xóa nhân viên */}
            <div className="flex w-full min-w-max items-center justify-between gap-5">
                <span className="text-primary">
                    Đã chọn <b>{selectedEmployees.length}</b> nhân viên
                </span>
                <div>
                    <PaginationComponent page={page} setPage={setPage} totalPages={totalPages} />
                </div>
                <div className="flex gap-4">
                    {/* Dialog khi nhấn nút xóa nhân sự */}
                    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <Button
                            variant="outline_destructive"
                            className="w-30"
                            onClick={() => {
                                if (selectedEmployees.length > 0) {
                                    setIsDeleteDialogOpen(true);
                                } else {
                                    toast.error('Vui lòng chọn ít nhất một nhân sự để xóa.');
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
                                <Button variant="secondary" onClick={() => setIsDeleteDialogOpen(false)}>
                                    Thoát
                                </Button>
                                <Button variant="outline_destructive" onClick={() => {}}>
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
                                <Button variant="secondary" onClick={() => setIsAddDialogOpen(false)}>
                                    Thoát
                                </Button>
                                <Button variant="outline" onClick={() => {}}>
                                    Thêm
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default EmployeeList;
