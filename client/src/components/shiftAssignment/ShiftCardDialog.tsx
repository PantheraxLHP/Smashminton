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
import { ShiftDate, ShiftAssignment } from "@/types/types";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface ShiftCardDialogProps {
    shiftDate: ShiftDate;
}

const isColStart = (shiftDate: ShiftDate) => {
    return shiftDate.shiftdate.getDay() === 1 ? true : false;
}

const ShiftCardDialog: React.FC<ShiftCardDialogProps> = ({
    shiftDate,
}) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className={`mx-2 ${isColStart(shiftDate) ? "col-start-2" : ""}`}>
                    <ShiftCard shiftDate={shiftDate} />
                </div>
            </DialogTrigger>
            <DialogContent className="!max-w-[60vw] h-[65vh] overflow-y-auto !flex flex-col gap-2">
                <DialogHeader className="!h-1">
                    <DialogTitle className="!h-fit">
                        <VisuallyHidden>
                            {`Chi tiết phân công cho ca làm việc ${shiftDate.shiftid}, ngày ${shiftDate.shiftdate.getDate()} tháng ${shiftDate.shiftdate.getMonth()} năm ${shiftDate.shiftdate.getFullYear()}} của nhân viên ${shiftDate.shiftid < 3 ? "bán thời gian" : "toàn thời gian"}`}
                        </VisuallyHidden>
                    </DialogTitle>
                </DialogHeader>
                <DndProvider backend={HTML5Backend}>
                    <ShiftCardDetail
                        shiftDate={shiftDate}
                    />
                </DndProvider>
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