import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import ShiftCard from "@/components/shiftAssignment/ShiftCard"
import ShiftCardDetail from "./ShiftCardDetail";
import { ShiftDate } from "@/types/types";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface ShiftCardDialogProps {
    shiftDataSingle: ShiftDate;
    role?: string;
    type: "enrollments" | "assignments";
}

const shiftCardColPos = ["2", "3", "4", "5", "6", "7", "8"];
const shiftCardRowPos = ["1", "2", "1", "2", "3", "4"];

const getColPos = (shiftDataSingle: ShiftDate) => {
    const tmp = shiftDataSingle.shiftdate.getDay();
    const index = tmp === 0 ? 6 : tmp - 1;
    return shiftCardColPos[index];
}

const getRowPos = (shiftDataSingle: ShiftDate) => {
    return shiftCardRowPos[shiftDataSingle.shiftid - 1];
}

const ShiftCardDialog: React.FC<ShiftCardDialogProps> = ({
    shiftDataSingle,
    role,
    type,
}) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div
                    className={`mx-2`}
                    style={{
                        gridColumn: getColPos(shiftDataSingle),
                        gridRow: getRowPos(shiftDataSingle),
                    }}
                >
                    <ShiftCard
                        shiftDataSingle={shiftDataSingle}
                        role={role}
                        type={type}
                    />
                </div>
            </DialogTrigger>
            <DialogContent className="!max-w-[60vw] h-[65vh] overflow-y-auto !flex flex-col gap-2">
                {/*Tiêu đề của Dialog, bắt buộc phải có nhưng không muốn sử dụng nên dùng VisuallyHidden che dấu*/}
                <DialogHeader className="!h-1">
                    <DialogTitle className="!h-fit">
                        <VisuallyHidden>
                            {`Chi tiết phân công cho ca làm việc ${shiftDataSingle.shiftid}, ngày ${shiftDataSingle.shiftdate.getDate()} tháng ${shiftDataSingle.shiftdate.getMonth()} năm ${shiftDataSingle.shiftdate.getFullYear()}} của nhân viên ${shiftDataSingle.shiftid < 3 ? "bán thời gian" : "toàn thời gian"}`}
                        </VisuallyHidden>
                    </DialogTitle>
                </DialogHeader>
                {/*Nội dụng của Dialog*/}
                <DndProvider backend={HTML5Backend}>
                    <ShiftCardDetail
                        shiftDataSingle={shiftDataSingle}
                    />
                </DndProvider>
                {/*Phần footer chứa nút quay về để đóng Dialog*/}
                <DialogFooter>
                    <DialogTrigger asChild>
                        <Button variant="secondary">
                            <Icon icon="material-symbols:arrow-back-rounded" />
                            Quay về
                        </Button>
                    </DialogTrigger>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default ShiftCardDialog;