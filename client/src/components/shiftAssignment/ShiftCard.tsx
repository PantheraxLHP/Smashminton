import { ShiftDate, ShiftAssignment, ShiftEnrollment } from '@/types/types';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import Image from 'next/image';

const colorIndex = ['bg-yellow-500', 'bg-[#008CFF]', 'bg-yellow-500', 'bg-primary', 'bg-[#008CFF]', 'bg-[#746C82]'];

const borderColorIndex = [
    'border-yellow-500 group-hover:border-yellow-500',
    'border-[#008CFF] group-hover:border-[#008CFF]',
    'border-yellow-500 group-hover:border-yellow-500',
    'border-primary group-hover:border-primary',
    'border-[#008CFF] group-hover:border-[#008CFF]',
    'border-[#746C82] group-hover:border-[#746C82]',
];
const pixelsPerHourH = 44;
const pixelsPerParttimeShiftH = pixelsPerHourH * 4;
const pixelsPerFulltimeShiftH = pixelsPerHourH * 8;

const getHeight = (shiftDataSingle: ShiftDate | ShiftAssignment | ShiftEnrollment) => {
    return shiftDataSingle.shiftid < 3 ? pixelsPerFulltimeShiftH : pixelsPerParttimeShiftH;
};

const getShift = (shiftDataSingle: ShiftDate | ShiftAssignment | ShiftEnrollment) => {
    if ('shift' in shiftDataSingle) {
        return shiftDataSingle.shift;
    } else if ('shift_date' in shiftDataSingle) {
        return shiftDataSingle.shift_date?.shift;
    }
    return undefined;
};
interface ShiftCardProps {
    shiftDataSingle: ShiftDate | ShiftAssignment | ShiftEnrollment;
    role?: string;
    type: 'enrollments' | 'assignments';
    selectedRadio?: string;
}

const ShiftCard: React.FC<ShiftCardProps> = ({ shiftDataSingle, role, type, selectedRadio }) => {
    const confirmCount =
        (shiftDataSingle as ShiftDate).shift_assignment?.filter((assignment: ShiftAssignment) => {
            return assignment.assignmentstatus === 'confirmed';
        }).length || 0;

    return (
        <div
            className={`group z-2 flex flex-col ${role === 'hr_manager' && type === 'assignments' ? 'cursor-pointer' : ''}`}
            style={{
                height: `${getHeight(shiftDataSingle)}px`,
            }}
        >
            {/*Phần header hiển thị thời gian bắt đầu và kết thúc của ca làm việc*/}
            <div
                className={`text-center text-sm font-semibold text-white ${colorIndex[shiftDataSingle.shiftid - 1]} h-fit rounded-t-lg p-1`}
            >
                {`${getShift(shiftDataSingle as ShiftDate)?.shiftstarthour} - ${getShift(shiftDataSingle as ShiftDate)?.shiftendhour}`}
            </div>
            {/*Phần nội dụng bên trong của ShiftCard*/}
            <div
                className={`z-2 flex h-full flex-col gap-2 rounded-b-lg border-r-2 border-b-2 border-l-2 bg-white p-2 hover:${borderColorIndex[shiftDataSingle.shiftid - 1]}`}
            >
                {type === 'assignments' &&
                role === 'hr_manager' &&
                ((shiftDataSingle as ShiftDate).shift_assignment?.length || 0) > 0 ? (
                    <>
                        <div className="flex items-center gap-2">
                            <Icon icon="lucide:user-round-check" className="text-2xl" />
                            <span className="">
                                <span className="font-bold">{confirmCount}</span>/
                                {(shiftDataSingle as ShiftDate).shift_assignment?.length || 0} Xác nhận
                            </span>
                        </div>
                        <div className="flex items-center -space-x-5">
                            {(shiftDataSingle as ShiftDate).shift_assignment
                                ?.slice(0, 5)
                                .map((assignment: ShiftAssignment, index: number) => (
                                    <div
                                        key={`assignment-${assignment.shiftid}-${assignment.employeeid}-${new Date((shiftDataSingle as ShiftDate).shiftdate).getTime()}-${index}`}
                                        className={`border-primary bg-primary-50 relative aspect-square h-10 w-10 rounded-full border-2`}
                                    >
                                        <Image
                                            src={`${assignment.employees?.accounts?.avatarurl || '/logo.png'}`}
                                            alt={`Nhân viên ${assignment.employeeid}`}
                                            width={40}
                                            height={40}
                                            className="rounded-full object-cover"
                                        />
                                    </div>
                                ))}

                            {((shiftDataSingle as ShiftDate).shift_assignment?.length || 0) > 5 && (
                                <div className="border-primary bg-primary-50 text-primary relative flex aspect-square h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold">
                                    +{((shiftDataSingle as ShiftDate).shift_assignment?.length || 0) - 5}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex h-full justify-center p-2 text-sm text-red-500">Chưa có phân công</div>
                )}
                {type === 'assignments' && (role === 'employee' || role === 'wh_manager') && (
                    <div className="flex flex-col gap-2">
                        <Button
                            variant={
                                (shiftDataSingle as ShiftAssignment).assignmentstatus === 'confirmed'
                                    ? 'default'
                                    : 'outline'
                            }
                        >
                            <Icon icon="lucide:user-round-check" />
                            {(shiftDataSingle as ShiftAssignment).assignmentstatus === 'confirmed'
                                ? 'Đã xác nhận'
                                : 'Xác nhận'}
                        </Button>
                        {role === 'employee' && (
                            <Button
                                variant={
                                    (shiftDataSingle as ShiftAssignment).assignmentstatus === 'refused'
                                        ? 'destructive'
                                        : 'outline_destructive'
                                }
                            >
                                <Icon icon="lucide:user-round-x" />
                                {(shiftDataSingle as ShiftAssignment).assignmentstatus === 'refused'
                                    ? 'Đã từ chối'
                                    : 'Từ chối'}
                            </Button>
                        )}
                    </div>
                )}
                {type === 'enrollments' && role === 'employee' && selectedRadio === 'assignable' && (
                    <Button variant="outline">
                        <Icon icon="material-symbols:check-circle-outline-rounded" />
                        Đăng ký
                    </Button>
                )}
                {type === 'enrollments' && role === 'employee' && selectedRadio === 'assigned' && (
                    <Button variant="destructive">
                        <Icon icon="material-symbols:cancel-outline-rounded" />
                        Hủy đăng ký
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ShiftCard;
