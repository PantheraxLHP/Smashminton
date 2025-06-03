import PaginationComponent from "@/components/atomic/PaginationComponent";
import ApprovalDetails from "./ApprovalDetails";
import ApprovalAddForm from "./ApprovalAddForm";
import { Fragment, useState, useEffect } from "react";
import { RewardRecords, Employees } from "@/types/types";
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
import { formatPrice } from '@/lib/utils';

export const getButtonVariant = (rc: RewardRecords) => {
    switch ((rc.rewardrecordstatus)?.toLocaleLowerCase()) {
        case "pending":
            return "secondary";
        case "rejected":
            return "destructive";
        case "approved":
            return "default";
    }
}

export const getStatusText = (rc: RewardRecords) => {
    switch ((rc.rewardrecordstatus)?.toLocaleLowerCase()) {
        case "pending":
            return "Chờ phê duyệt";
        case "rejected":
            return "Đã từ chối";
        case "approved":
            return "Đã phê duyệt";
        default:
            return "Không rõ trạng thái";
    }
}

const ApprovalList = () => {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(10);
    const [pageSize, setPageSize] = useState(12);
    const [rewardRecords, setRewardRecords] = useState<RewardRecords[]>([
        {
            rewardrecordid: 1,
            employeeid: 1,
            rewardrecordstatus: "Approved",
            rewardnote: "Đã hoàn thành công việc đúng hạn.",
            finalrewardamount: 1000000,
            rewarddate: new Date("2023-01-01"),
            employees: {
                employeeid: 1,
                role: "Quản lý sân",
                employee_type: "Bán thời gian",
                accounts: {
                    accountid: 1,
                    fullname: "Nguyễn Văn A",
                }
            }
        },
        {
            rewardrecordid: 2,
            employeeid: 2,
            rewardrecordstatus: "Pending",
            rewardnote: "Chưa hoàn thành công việc, cần xem xét.",
            finalrewardamount: 500000,
            rewarddate: new Date("2023-02-01"),
            employees: {
                employeeid: 2,
                role: "Quản lý kho hàng",
                employee_type: "Toàn thời gian",
                accounts: {
                    accountid: 2,
                    fullname: "Trần Thị B",
                }
            }
        },
        {
            rewardrecordid: 3,
            employeeid: 3,
            rewardrecordstatus: "Rejected",
            rewardnote: "Không đạt yêu cầu công việc.",
            finalrewardamount: 9999000,
            rewarddate: new Date("2023-03-01"),
            employees: {
                employeeid: 3,
                role: "Quản lý sân",
                employee_type: "Bán thời gian",
                accounts: {
                    accountid: 3,
                    fullname: "Hoàng Văn C",
                }
            }
        }
    ]);

    const [selectedRewardRecords, setSelectedRewardRecords] = useState<RewardRecords[]>([]);
    const [currentPageSelectAll, setCurrentPageSelectAll] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    useEffect(() => {
        if (rewardRecords.length === 0) {
            setCurrentPageSelectAll(false);
            return;
        }

        const allSelected = rewardRecords.every(rc =>
            selectedRewardRecords.some(selected => selected.rewardrecordid === rc.rewardrecordid)
        );

        setCurrentPageSelectAll(allSelected);
    }, [rewardRecords, selectedRewardRecords]);

    const handleSelectAllChange = (checked: boolean) => {
        if (checked) {
            setSelectedRewardRecords(prev => {
                const currentIds = new Set(prev.map(rc => rc.rewardrecordid));
                const newSelected = [...prev];

                rewardRecords.forEach(rc => {
                    if (!currentIds.has(rc.rewardrecordid)) {
                        newSelected.push(rc);
                    }
                });

                return newSelected;
            });
        } else {
            setSelectedRewardRecords(prev => {
                const currentIds = new Set(prev.map(rc => rc.rewardrecordid));
                return prev.filter(rc => !currentIds.has(rc.rewardrecordid));
            });
        }
    };

    const handleSingleCheckboxChange = (rc: RewardRecords, checked: boolean) => {
        if (checked) {
            setSelectedRewardRecords(prev => {
                const currentIds = new Set(prev.map(rc => rc.rewardrecordid));
                if (!currentIds.has(rc.rewardrecordid)) {
                    return [...prev, rc];
                }
                return prev;
            });
        } else {
            setSelectedRewardRecords(prev => {
                return prev.filter(selected => selected.rewardrecordid !== rc.rewardrecordid);
            });
        }
    }

    const employees: Employees[] = rewardRecords.map(rc => rc.employees).filter((employee): employee is Employees => employee !== undefined);

    return (
        <div className="flex flex-col gap-4 w-full overflow-x-auto">
            <span className="text-2xl font-semibold w-full min-w-max">Danh sách ghi chú</span>
            <div className="flex flex-col w-full min-w-max overflow-x-auto">
                {/* Table Header - 9 cols*/}
                <div className="grid grid-cols-[50px_repeat(6,_minmax(150px,_1fr))_100px_150px] min-w-max items-center pb-2 border-b-2 border-gray-400 w-full">
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
                    <span className="text-sm font-semibold flex justify-center text-center">Xem ghi chú</span>
                    <span className="text-sm font-semibold flex justify-center text-center">Tình trạng</span>
                </div>
                {/* Table Content - 9 cols - 12 rows */}
                <div className="grid grid-cols-[50px_repeat(6,_minmax(150px,_1fr))_100px_150px] grid-rows-12 min-w-max items-center border-b-2 border-gray-400 w-full">
                    {rewardRecords.map((rc) => (
                        <Fragment key={`rc-${rc.rewardrecordid}`}>
                            <div className="flex items-center py-2 h-14.5 border-b-2 border-gray-200">
                                <Checkbox
                                    checked={selectedRewardRecords.some(selected => selected.rewardrecordid === rc.rewardrecordid)}
                                    onCheckedChange={(checked) => handleSingleCheckboxChange(rc, Boolean(checked))}
                                    className="size-5 cursor-pointer"
                                />
                            </div>
                            <div className="flex items-center text-sm py-2 h-14.5 border-b-2 border-gray-200">{rc.employeeid}</div>
                            <div className="flex items-center text-sm py-2 h-14.5 border-b-2 border-gray-200">{rc.employees?.accounts?.fullname}</div>
                            <div className="flex items-center text-sm py-2 h-14.5 border-b-2 border-gray-200">{rc.employees?.role}</div>
                            <div className="flex items-center text-sm py-2 h-14.5 border-b-2 border-gray-200">{rc.employees?.employee_type}</div>
                            <div className="flex items-center text-sm py-2 h-14.5 border-b-2 border-gray-200">
                                {(rc.rewarddate)?.toLocaleDateString("vi-VN", {
                                    year: 'numeric',
                                    month: '2-digit',
                                })}
                            </div>
                            <div className="flex items-center text-sm py-2 h-14.5 border-b-2 border-gray-200">
                                {formatPrice(rc.finalrewardamount || 0)}
                            </div>
                            <div className="flex items-center justify-center py-2 h-14.5 border-b-2 border-gray-200">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Icon
                                            icon="clarity:note-line"
                                            className="size-8 text-primary-300 cursor-pointer hover:text-primary-500"
                                        />
                                    </DialogTrigger>
                                    <DialogContent className="h-[60vh] overflow-y-auto !flex flex-col gap-2">
                                        <DialogHeader className="!h-fit flex flex-col gap-0.5">
                                            <DialogTitle className="!h-fit">
                                                Chi tiết ghi chú
                                            </DialogTitle>
                                            <DialogDescription className="!h-fit">
                                                {
                                                    `Nhân viên ${rc.employeeid} - ${rc.employees?.accounts?.fullname || "chưa có tên"} trong ` +
                                                    `${(rc.rewarddate)?.toLocaleDateString("vi-VN", {
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                    })}`
                                                }
                                            </DialogDescription>
                                        </DialogHeader>
                                        <ApprovalDetails
                                            record={rc}
                                        />
                                        {getStatusText(rc) === "Chờ phê duyệt" && (
                                            <DialogFooter className="!h-fit">
                                                <DialogTrigger asChild>
                                                    <Button variant="secondary">
                                                        Thoát
                                                    </Button>
                                                </DialogTrigger>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {}}
                                                >
                                                    Lưu
                                                </Button>
                                            </DialogFooter>
                                        )}
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <div className="flex items-center justify-center text-sm py-2 h-14.5 border-b-2 border-gray-200">
                                <Button
                                    variant={getButtonVariant(rc)}
                                    className={`w-full`}
                                >
                                    {getStatusText(rc)}
                                </Button>
                            </div>
                        </Fragment>
                    ))}
                </div>
            </div>
            {/*Số lượng nhân viên được chọn, phân trang, hành động duyệt/từ chối ghi chú và thêm ghi chú */}
            <div className="flex justify-between items-center gap-5 w-full min-w-max">
                <span className="text-primary">Đã chọn <b>{selectedRewardRecords.length}</b> ghi chú</span>
                <div>
                    <PaginationComponent
                        page={page}
                        setPage={setPage}
                        totalPages={totalPages}
                    />
                </div>
                <div className="flex gap-4">
                    <Button
                        variant="outline_destructive"
                        className="w-30"
                    >
                        Từ chối
                    </Button>
                    <Button
                        variant="outline"
                        className="w-30"
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
                        <DialogContent className="h-[60vh] overflow-y-auto !flex flex-col gap-2">
                            <DialogHeader className="!h-fit">
                                <DialogTitle className="!h-fit">Thêm ghi chú mới</DialogTitle>
                            </DialogHeader>
                            <ApprovalAddForm
                                employees={employees}
                            />
                            <DialogFooter className="!h-fit">
                                <DialogTrigger asChild>
                                    <Button variant="secondary">
                                        Hủy
                                    </Button>
                                </DialogTrigger>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        toast.success("Ghi chú đã được thêm thành công!");
                                        setIsAddDialogOpen(false);
                                    }}
                                >
                                    Lưu
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}

export default ApprovalList;