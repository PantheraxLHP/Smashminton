import PaginationComponent from "@/components/atomic/PaginationComponent";
import { Fragment, useState, useEffect } from "react";
import { Employees, MonthlyNote } from "@/types/types";
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
import { get } from "http";

const ApprovalList = () => {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(10);
    const [pageSize, setPageSize] = useState(12);
    const [notes, setNotes] = useState<MonthlyNote[]>([
        {
            noteid: 1,
            employeeid: 1,
            notestatus: "approved",
            notecontent: "Đã hoàn thành công việc đúng hạn.",
            createdat: new Date("2023-01-01"),
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
            noteid: 2,
            employeeid: 2,
            notestatus: "pending",
            notecontent: "Chưa hoàn thành công việc, cần xem xét.",
            createdat: new Date("2023-02-01"),
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
            noteid: 3,
            employeeid: 3,
            notestatus: "rejected",
            notecontent: "Không đạt yêu cầu công việc.",
            createdat: new Date("2023-03-01"),
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
    const [selectedNotes, setSelectedNotes] = useState<MonthlyNote[]>([]);
    const [currentPageSelectAll, setCurrentPageSelectAll] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    useEffect(() => {
        if (notes.length === 0) {
            setCurrentPageSelectAll(false);
            return;
        }

        const allSelected = notes.every(note =>
            selectedNotes.some(selected => selected.noteid === note.noteid)
        );

        setCurrentPageSelectAll(allSelected);
    }, [notes, selectedNotes]);

    const handleSelectAllChange = (checked: boolean) => {
        if (checked) {
            setSelectedNotes(prev => {
                const currentIds = new Set(prev.map(n => n.noteid));
                const newSelected = [...prev];

                notes.forEach(note => {
                    if (!currentIds.has(note.noteid)) {
                        newSelected.push(note);
                    }
                });

                return newSelected;
            });
        } else {
            setSelectedNotes(prev => {
                const currentIds = new Set(prev.map(n => n.noteid));
                return prev.filter(note => !currentIds.has(note.noteid));
            });
        }
    };

    const handleSingleCheckboxChange = (note: MonthlyNote, checked: boolean) => {
        if (checked) {
            setSelectedNotes(prev => {
                const currentIds = new Set(prev.map(n => n.noteid));
                if (!currentIds.has(note.noteid)) {
                    return [...prev, note];
                }
                return prev;
            });
        } else {
            setSelectedNotes(prev => {
                return prev.filter(selected => selected.noteid !== note.noteid);
            });
        }
    }


    const getButtonVariant = (note: MonthlyNote) => {
        if (note.notestatus === "approved") {
            return "default";
        }
        else if (note.notestatus === "pending") {
            return "secondary";
        }
        else if (note.notestatus === "rejected") {
            return "destructive";
        }
    }

    const getStatusText = (note: MonthlyNote) => {
        if (note.notestatus === "approved") {
            return "Đã phê duyệt";
        } else if (note.notestatus === "pending") {
            return "Chờ phê duyệt";
        } else if (note.notestatus === "rejected") {
            return "Đã từ chối";
        }
        return "Không rõ trạng thái";
    }

    return (
        <div className="flex flex-col gap-4 w-full overflow-x-auto">
            <span className="text-2xl font-semibold w-full min-w-max">Danh sách ghi chú</span>
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
                    <span className="text-sm font-semibold">Tháng - Năm</span>
                    <span className="text-sm font-semibold flex justify-center text-center">Xem ghi chú</span>
                    <span className="text-sm font-semibold flex justify-center text-center">Tình trạng</span>
                </div>
                {/* Table Content - 8 cols - 12 rows */}
                <div className="grid grid-cols-[50px_repeat(5,_minmax(150px,_1fr))_100px_150px] grid-rows-12 min-w-max items-center border-b-2 border-gray-400 w-full">
                    {notes.map((note) => (
                        <Fragment key={`note-${note.noteid}`}>
                            <div className="flex items-center py-2 h-14.5 border-b-2 border-gray-200">
                                <Checkbox
                                    checked={selectedNotes.some(selected => selected.noteid === note.noteid)}
                                    onCheckedChange={(checked) => handleSingleCheckboxChange(note, Boolean(checked))}
                                    className="size-5 cursor-pointer"
                                />
                            </div>
                            <div className="flex items-center text-sm py-2 h-14.5 border-b-2 border-gray-200">{note.employeeid}</div>
                            <div className="flex items-center text-sm py-2 h-14.5 border-b-2 border-gray-200">{note.employees?.accounts?.fullname}</div>
                            <div className="flex items-center text-sm py-2 h-14.5 border-b-2 border-gray-200">{note.employees?.role}</div>
                            <div className="flex items-center text-sm py-2 h-14.5 border-b-2 border-gray-200">{note.employees?.employee_type}</div>
                            <div className="flex items-center text-sm py-2 h-14.5 border-b-2 border-gray-200">{(note.createdat)?.toLocaleDateString("vi-VN", {
                                year: 'numeric',
                                month: '2-digit',
                            })}</div>
                            <div className="flex items-center justify-center py-2 h-14.5 border-b-2 border-gray-200">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Icon
                                            icon="clarity:note-line"
                                            className="size-8 text-primary-300 cursor-pointer hover:text-primary-500"
                                        />
                                    </DialogTrigger>
                                    <DialogContent className="!max-w-[80vw] h-[80vh] overflow-y-auto !flex flex-col gap-2">
                                        <DialogHeader className="!h-1">
                                            <DialogTitle className="!h-fit">
                                                <VisuallyHidden>
                                                    {
                                                        `Chi tiết ghi chú của nhân viên ${note.employees?.accounts?.fullname || "chưa có tên"} trong ` +
                                                        `${(note.createdat)?.toLocaleDateString("vi-VN", {
                                                            year: 'numeric',
                                                            month: '2-digit',
                                                        })}`
                                                    }
                                                </VisuallyHidden>
                                            </DialogTitle>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <div className="flex items-center justify-center text-sm py-2 h-14.5 border-b-2 border-gray-200">
                                <Button
                                    variant={getButtonVariant(note)}
                                    className={`w-full`}
                                >
                                    {getStatusText(note)}
                                </Button>
                            </div>
                        </Fragment>
                    ))}
                </div>
            </div>
            {/*Số lượng nhân viên được chọn, phân trang, hành động duyệt/từ chối ghi chú và thêm ghi chú */}
            <div className="flex justify-between items-center gap-5 w-full min-w-max">
                <span className="text-primary">Đã chọn <b>{selectedNotes.length}</b> ghi chú</span>
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
                    <Button
                        variant="outline"
                        className="w-30"
                    >
                        Thêm ghi chú
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ApprovalList;