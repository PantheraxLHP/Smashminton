import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Checkbox } from "@/components/ui/checkbox";
import PaginationComponent from "@/components/atomic/PaginationComponent";

const EmployeeList = () => {
    return (
        <div className="flex flex-col gap-4 w-full">
            <span className="text-2xl font-semibold">Danh sách nhân viên</span>
            <div className="flex flex-col w-full">
                <div className="grid grid-cols-[50px_repeat(5,_minmax(150px,_1fr))_100px_150px] w-full items-center pb-2 border-b-2 border-gray-400">
                    <Checkbox
                        className="size-5 cursor-pointer"
                    />
                    <span className="text-sm font-semibold">Mã nhân viên</span>
                    <span className="text-sm font-semibold">Tên nhân viên</span>
                    <span className="text-sm font-semibold">Vai trò</span>
                    <span className="text-sm font-semibold">Loại nhân viên</span>
                    <span className="text-sm font-semibold">Ngày bắt đầu làm việc</span>
                    <span className="text-sm font-semibold flex justify-center text-center">Xem chi tiết</span>
                    <span className="text-sm font-semibold flex justify-center text-center">Sinh trắc học vân tay (Nhấn để thêm)</span>
                </div>
                <div className="grid grid-cols-[50px_repeat(5,_minmax(150px,_1fr))_100px_150px] grid-rows-12 w-full items-center ">
                    <div className="flex items-center py-2 h-14 border-b-2 border-gray-200">
                        <Checkbox
                            className="size-5 cursor-pointer"
                        />
                    </div>
                    <div className="flex items-center text-sm py-2 h-14 border-b-2 border-gray-200">Mã nhân viên</div>
                    <div className="flex items-center text-sm py-2 h-14 border-b-2 border-gray-200">Tên nhân viên</div>
                    <div className="flex items-center text-sm py-2 h-14 border-b-2 border-gray-200">Vai trò</div>
                    <div className="flex items-center text-sm py-2 h-14 border-b-2 border-gray-200">Loại nhân viên</div>
                    <div className="flex items-center text-sm py-2 h-14 border-b-2 border-gray-200">Ngày bắt đầu làm việc</div>
                    <div className="flex items-center justify-center py-2 h-14 border-b-2 border-gray-200">
                        <Icon icon="material-symbols:info-outline-rounded" className="size-8 text-primary-300 cursor-pointer hover:text-primary-500"/>
                    </div>
                    <div className="flex items-center justify-center text-sm py-2 h-14 border-b-2 border-gray-200">Sinh trắc học vân tay</div>
                </div>
            </div>
            <div className="flex justify-between items-center w-full">
                <span className="text-sm text-primary">Đã chọn <b>0</b> nhân viên</span>
                <div>
                    <PaginationComponent
                        page={1}
                        setPage={() => { }}
                        totalPages={10}
                        onNextPage={() => { }}
                        onPreviousPage={() => { }}
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