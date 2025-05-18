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

interface ShiftCardDialogProps {
    shiftDate: ShiftDate;
    shiftAssignments: ShiftAssignment[];
}

const isColStart = (shiftDate: ShiftDate) => {
    return shiftDate.shiftdate.getDay() === 1 ? true : false;
}

const ShiftCardDialog: React.FC<ShiftCardDialogProps> = ({
    shiftDate,
    shiftAssignments,
}) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className={`mx-2 ${isColStart(shiftDate) ? "col-start-2" : ""}`}>
                    <ShiftCard shiftDate={shiftDate} shiftAssignments={shiftAssignments} />
                </div>
            </DialogTrigger>
            <DialogContent className="!max-w-[60vw] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        <VisuallyHidden>
                            {`Chi tiết phân công cho ca làm việc ${shiftDate.shiftid}, ngày ${shiftDate.shiftdate.getDate()} tháng ${shiftDate.shiftdate.getMonth()} năm ${shiftDate.shiftdate.getFullYear()}} của nhân viên ${shiftDate.shiftid < 3 ? "bán thời gian" : "toàn thời gian"}`}
                        </VisuallyHidden>
                    </DialogTitle>
                </DialogHeader>
                <ShiftCardDetail
                    shiftDate={shiftDate}
                    shiftAssignments={shiftAssignments}
                />
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