import PaginationComponent from '@/components/atomic/PaginationComponent';
import ApprovalDetails from './ApprovalDetails';
import ApprovalAddForm from './ApprovalAddForm';
import { Fragment, useState, useEffect } from 'react';
import { RewardRecords, Employees } from '@/types/types';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from '@/components/ui/dialog';
import { formatDate, formatEmployeeType, formatMonthYear, formatPrice, formatRole } from '@/lib/utils';
import { approveRewards, getRewards, rejectRewards } from '@/services/rewards.service';

export const formatButtonVariant = (rc: RewardRecords) => {
    switch (rc.rewardrecordstatus?.toLocaleLowerCase()) {
        case 'pending':
            return 'secondary';
        case 'rejected':
            return 'destructive';
        case 'approved':
            return 'default';
    }
};

export const formatApprovalStatus = (status: string) => {
    switch (status.toLowerCase()) {
        case 'pending':
            return 'Chờ phê duyệt';
        case 'rejected':
            return 'Từ chối';
        case 'approved':
            return 'Xác nhận';
    }
};

interface ApprovalListProps {
    filterValue: Record<string, any>;
}

const ApprovalList = ({ filterValue }: ApprovalListProps) => {
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(10);
    const [pageSize, setPageSize] = useState(12);
    const [rewardRecords, setRewardRecords] = useState<RewardRecords[]>([]);

    const [selectedRewardRecords, setSelectedRewardRecords] = useState<RewardRecords[]>([]);
    const [currentPageSelectAll, setCurrentPageSelectAll] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const fetchRewardRecords = async () => {
        const result = await getRewards(page, pageSize, filterValue);
        if (!result.ok) {
            setRewardRecords([]);
        } else {
            setRewardRecords(
                result.data.data.sort((a: RewardRecords, b: RewardRecords) => a.rewardrecordid - b.rewardrecordid),
            );
            setTotalPages(result.data.pagination.totalPages);
            setPage(result.data.pagination.page);
        }
    };

    const getMarkedApprovingApproval = () => {
        const result = selectedRewardRecords.map((employee) => employee.rewardrecordid);
        return result;
    };

    const handleApprove = async () => {
        const result = await approveRewards(getMarkedApprovingApproval());
        if (result.ok) {
            toast.success('Phê duyệt thành công');
            fetchRewardRecords();
        } else {
            toast.error(result.message || 'Phê duyệt thất bại');
        }
    };

    const handleReject = async () => {
        const result = await rejectRewards(getMarkedApprovingApproval());
        if (result.ok) {
            toast.success('Từ chối thành công');
            fetchRewardRecords();
        } else {
            toast.error(result.message || 'Từ chối thất bại');
        }
    };

    useEffect(() => {
        fetchRewardRecords();
    }, [filterValue, page, pageSize]);

    useEffect(() => {
        if (rewardRecords.length === 0) {
            setCurrentPageSelectAll(false);
            return;
        }

        const allSelected = rewardRecords.every((rc) =>
            selectedRewardRecords.some((selected) => selected.rewardrecordid === rc.rewardrecordid),
        );

        setCurrentPageSelectAll(allSelected);
    }, [rewardRecords, selectedRewardRecords]);

    const handleSelectAllChange = (checked: boolean) => {
        if (checked) {
            setSelectedRewardRecords((prev) => {
                const currentIds = new Set(prev.map((rc) => rc.rewardrecordid));
                const newSelected = [...prev];

                rewardRecords.forEach((rc) => {
                    if (!currentIds.has(rc.rewardrecordid)) {
                        newSelected.push(rc);
                    }
                });

                return newSelected;
            });
        } else {
            setSelectedRewardRecords((prev) => {
                const currentIds = new Set(prev.map((rc) => rc.rewardrecordid));
                return prev.filter((rc) => !currentIds.has(rc.rewardrecordid));
            });
        }
    };

    const handleSingleCheckboxChange = (rc: RewardRecords, checked: boolean) => {
        if (checked) {
            setSelectedRewardRecords((prev) => {
                const currentIds = new Set(prev.map((rc) => rc.rewardrecordid));
                if (!currentIds.has(rc.rewardrecordid)) {
                    return [...prev, rc];
                }
                return prev;
            });
        } else {
            setSelectedRewardRecords((prev) => {
                return prev.filter((selected) => selected.rewardrecordid !== rc.rewardrecordid);
            });
        }
    };

    const employees: Employees[] = rewardRecords
        .map((rc) => rc.employees)
        .filter((employee): employee is Employees => employee !== undefined);

    return (
        <div className="flex w-full flex-col gap-4 overflow-x-auto">
            <span className="w-full min-w-max text-2xl font-semibold">Danh sách ghi chú</span>
            <div className="flex w-full min-w-max flex-col overflow-x-auto">
                {/* Table Header - 9 cols*/}
                <div className="grid w-full min-w-max grid-cols-[50px_repeat(6,_minmax(150px,_1fr))_100px_150px] items-center border-b-2 border-gray-400 pb-2">
                    <Checkbox
                        className="size-5 cursor-pointer"
                        checked={currentPageSelectAll}
                        onCheckedChange={(checked) => handleSelectAllChange(Boolean(checked))}
                    />
                    <span className="text-sm font-semibold">Mã nhân viên</span>
                    <span className="text-sm font-semibold">Tên nhân viên</span>
                    <span className="text-sm font-semibold">Vai trò</span>
                    <span className="text-sm font-semibold">Loại nhân viên</span>
                    <span className="text-sm font-semibold">Tháng - Năm</span>
                    <span className="text-sm font-semibold">Số tiền thưởng</span>
                    <span className="flex justify-center text-center text-sm font-semibold">Xem ghi chú</span>
                    <span className="flex justify-center text-center text-sm font-semibold">Tình trạng</span>
                </div>
                {/* Table Content - 9 cols - 12 rows */}
                <div className="grid w-full min-w-max grid-cols-[50px_repeat(6,_minmax(150px,_1fr))_100px_150px] grid-rows-12 items-center border-b-2 border-gray-400">
                    {rewardRecords.map((rc) => (
                        <Fragment key={`rc-${rc.rewardrecordid}`}>
                            <div className="flex h-14.5 items-center border-b-2 border-gray-200 py-2">
                                <Checkbox
                                    checked={selectedRewardRecords.some(
                                        (selected) => selected.rewardrecordid === rc.rewardrecordid,
                                    )}
                                    onCheckedChange={(checked) => handleSingleCheckboxChange(rc, Boolean(checked))}
                                    className="size-5 cursor-pointer"
                                />
                            </div>
                            <div className="flex h-14.5 items-center border-b-2 border-gray-200 py-2 text-sm">
                                {rc.employeeid}
                            </div>
                            <div className="flex h-14.5 items-center border-b-2 border-gray-200 py-2 text-sm">
                                {rc.employees?.accounts?.fullname}
                            </div>
                            <div className="flex h-14.5 items-center border-b-2 border-gray-200 py-2 text-sm">
                                {formatRole(rc.employees?.role || '')}
                            </div>
                            <div className="flex h-14.5 items-center border-b-2 border-gray-200 py-2 text-sm">
                                {formatEmployeeType(rc.employees?.employee_type || '')}
                            </div>
                            <div className="flex h-14.5 items-center border-b-2 border-gray-200 py-2 text-sm">
                                {rc.rewardapplieddate ? formatMonthYear(rc.rewardapplieddate) : ''}
                            </div>
                            <div className="flex h-14.5 items-center border-b-2 border-gray-200 py-2 text-sm">
                                {formatPrice(rc.finalrewardamount || 0)}
                            </div>
                            <div className="flex h-14.5 items-center justify-center border-b-2 border-gray-200 py-2">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Icon
                                            icon="clarity:note-line"
                                            className="text-primary-300 hover:text-primary-500 size-8 cursor-pointer"
                                        />
                                    </DialogTrigger>
                                    <DialogContent className="!flex h-[60vh] flex-col gap-2 overflow-y-auto">
                                        <DialogHeader className="flex !h-fit flex-col gap-0.5">
                                            <DialogTitle className="!h-fit">Chi tiết ghi chú</DialogTitle>
                                            <DialogDescription className="!h-fit">
                                                {`Nhân viên ${rc.employeeid} - ${rc.employees?.accounts?.fullname || 'chưa có tên'} ngày ` +
                                                    `${rc.rewardapplieddate ? formatDate(rc.rewardapplieddate) : ''}`}
                                            </DialogDescription>
                                        </DialogHeader>
                                        <ApprovalDetails record={rc} onSaveSuccess={fetchRewardRecords} />
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <div className="flex h-14.5 items-center justify-center border-b-2 border-gray-200 py-2 text-sm">
                                <Button variant={formatButtonVariant(rc)} className={`w-full`}>
                                    {formatApprovalStatus(rc.rewardrecordstatus || '')}
                                </Button>
                            </div>
                        </Fragment>
                    ))}
                </div>
            </div>
            {/*Số lượng nhân viên được chọn, phân trang, hành động duyệt/từ chối ghi chú và thêm ghi chú */}
            <div className="flex w-full min-w-max items-center justify-between gap-5">
                <span className="text-primary">
                    Đã chọn <b>{selectedRewardRecords.length}</b> ghi chú
                </span>
                <div>
                    <PaginationComponent page={page} setPage={setPage} totalPages={totalPages} />
                </div>
                <div className="flex gap-4">
                    <Button
                        variant="outline_destructive"
                        className="w-30"
                        onClick={() => {
                            if (selectedRewardRecords.length > 0) {
                                handleReject();
                            } else {
                                toast.error('Vui lòng chọn ít nhất một ghi chú để từ chối');
                            }
                        }}
                    >
                        Từ chối
                    </Button>
                    <Button
                        variant="outline"
                        className="w-30"
                        onClick={() => {
                            if (selectedRewardRecords.length > 0) {
                                handleApprove();
                            } else {
                                toast.error('Vui lòng chọn ít nhất một ghi chú để phê duyệt');
                            }
                        }}
                    >
                        Phê duyệt
                    </Button>
                    {/* Dialog khi nhấn nút thêm ghi chú */}
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-30">
                                Thêm ghi chú
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="!flex h-[80vh] flex-col gap-2 overflow-y-auto">
                            <DialogHeader className="!h-fit">
                                <DialogTitle className="!h-fit">Thêm ghi chú mới</DialogTitle>
                                <DialogDescription className="!h-fit">
                                    Vui lòng điền thông tin ghi chú mới cho nhân viên.
                                </DialogDescription>
                            </DialogHeader>
                            <ApprovalAddForm employees={employees} onAddSuccess={fetchRewardRecords} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default ApprovalList;
