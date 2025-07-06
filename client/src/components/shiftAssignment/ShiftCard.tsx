import { ShiftDate, ShiftAssignment, ShiftEnrollment } from '@/types/types';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import { updateShiftAssignment, createShiftEnrollment, deleteShiftEnrollment } from '@/services/shiftdate.service';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

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

const handleUpdateShiftAssignment = async (
    assignmentstatus: 'approved' | 'refused',
    shiftDataSingle: ShiftAssignment | ShiftEnrollment,
    onDataChanged?: () => void,
) => {
    const response = await updateShiftAssignment({
        shiftdate: new Date(shiftDataSingle.shiftdate).toISOString(),
        shiftid: shiftDataSingle.shiftid,
        employeeid: shiftDataSingle.employeeid,
        assignmentstatus: assignmentstatus,
    });

    if (response.ok) {
        toast.success('Cập nhật phân công thành công');
        onDataChanged?.();
    } else {
        toast.error(response.message);
    }
};
interface ShiftCardProps {
    shiftDataSingle: ShiftDate | ShiftAssignment | ShiftEnrollment;
    role?: string;
    type: 'enrollments' | 'assignments';
    selectedRadio?: string;
    onDataChanged?: () => void;
}

const ShiftCard: React.FC<ShiftCardProps> = ({ shiftDataSingle, role, type, selectedRadio, onDataChanged }) => {
    const { user } = useAuth();

    const confirmCount =
        (shiftDataSingle as ShiftDate).shift_assignment?.filter((assignment: ShiftAssignment) => {
            return assignment.assignmentstatus === 'approved';
        }).length || 0;

    const renderAssignmentButtons = () => {
        if (type !== 'assignments' || role === 'hr_manager') return null;

        const today = new Date();
        const shiftDate = new Date((shiftDataSingle as ShiftAssignment).shiftdate);
        const assignmentStatus = (shiftDataSingle as ShiftAssignment).assignmentstatus;
        const shiftEndHour = getShift(shiftDataSingle)?.shiftendhour;
        const [h, m] = shiftEndHour?.split(':').map(Number) || [0, 0];
        const shiftEndDate = new Date(shiftDate);
        shiftEndDate.setHours(h, m, 0, 0);

        return (
            <div className="flex flex-col gap-2">
                <Button
                    className={shiftEndDate < today && assignmentStatus !== "approved" ? 'hidden' : ''}
                    variant={
                        assignmentStatus === 'approved'
                            ? 'default_disabled'
                            : 'outline'
                    }
                    onClick={() => {
                        handleUpdateShiftAssignment(
                            assignmentStatus === 'approved'
                                ? 'refused'
                                : 'approved',
                            shiftDataSingle as ShiftAssignment,
                            onDataChanged,
                        );
                    }}
                >
                    <Icon icon="lucide:user-round-check" />
                    {assignmentStatus === 'approved'
                        ? 'Đã xác nhận'
                        : 'Xác nhận'}
                </Button>
                <Button
                    className={shiftEndDate < today && assignmentStatus !== "refused" ? 'hidden' : ''}
                    variant={
                        assignmentStatus === 'refused'
                            ? 'destructive_disabled'
                            : 'outline_destructive'
                    }
                    onClick={() => {
                        handleUpdateShiftAssignment(
                            assignmentStatus === 'refused'
                                ? 'approved'
                                : 'refused',
                            shiftDataSingle as ShiftAssignment,
                            onDataChanged,
                        );
                    }}
                >
                    <Icon icon="lucide:user-round-x" />
                    {role === 'wh_manager' && (assignmentStatus === 'refused'
                        ? 'Đã xin nghỉ'
                        : 'Xin nghỉ')}
                    {role === 'employee' && (assignmentStatus === 'refused'
                        ? 'Đã từ chối'
                        : 'Từ chối')}
                </Button>
            </div>
        );
    };

    const handleEnrollShift = async () => {
        if (!user?.accountid) {
            toast.error('Không thể xác định thông tin người dùng');
            return;
        }

        const response = await createShiftEnrollment(user.accountid, shiftDataSingle.shiftid, new Date(shiftDataSingle.shiftdate).toISOString());

        if (response.ok) {
            toast.success('Đăng ký ca làm việc thành công');
            onDataChanged?.();
        } else {
            toast.error(response.message);
        }
    };

    const handleUnenrollShift = async () => {
        if (!user?.accountid) {
            toast.error('Không thể xác định thông tin người dùng');
            return;
        }

        const response = await deleteShiftEnrollment(user.accountid, shiftDataSingle.shiftid, new Date(shiftDataSingle.shiftdate).toISOString());

        if (response.ok) {
            toast.success('Hủy đăng ký ca làm việc thành công');
            onDataChanged?.();
        } else {
            toast.error(response.message);
        }
    };

    return (
        <div
            className={`group z-2 flex flex-col ${role === 'hr_manager' && type === 'assignments' ? 'cursor-pointer' : ''}`}
            style={{
                height: `${getHeight(shiftDataSingle)}px`,
            }}
        >
            {/*Phần header hiển thị thời gian bắt đầu và kết thúc của ca làm việc*/}
            <div
                className={`z-2 text-center text-sm font-semibold text-white ${colorIndex[shiftDataSingle.shiftid - 1]} h-fit rounded-t-lg p-1`}
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
                                        key={`assignment-${assignment.shiftid}-${assignment.employeeid}-${new Date((shiftDataSingle as ShiftDate).shiftdate instanceof Date ? (shiftDataSingle as ShiftDate).shiftdate : new Date((shiftDataSingle as ShiftDate).shiftdate)).getTime()}-${index}`}
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
                    role === 'hr_manager' && (
                        <div className="flex h-full justify-center p-2 text-sm text-red-500">Chưa có phân công</div>
                    )
                )}
                {renderAssignmentButtons()}

                {type === 'enrollments' && role === 'employee' && selectedRadio === 'assignable' && (
                    <Button variant="outline">
                        <Icon icon="material-symbols:check-circle-outline-rounded" />
                        Đăng ký
                    </Button>
                )}
                {type === 'enrollments' && role === 'employee' && selectedRadio === 'enrolled' && (
                    <>
                        <div className="flex items-center gap-2">
                            <Icon icon="lucide:user-round-check" className="text-xl text-green-600" />

                            <span className="text-sm font-medium text-green-600">Đã đăng ký</span>
                        </div>

                        {(shiftDataSingle as ShiftDate).shift_enrollment &&
                            (shiftDataSingle as ShiftDate).shift_enrollment!.length > 0 && (
                                <>
                                    <div
                                        className={`flex items-center gap-2 text-sm ${(shiftDataSingle as ShiftDate).shift_enrollment![0].enrollmentstatus == null ? 'hidden' : (shiftDataSingle as ShiftDate).shift_enrollment![0].enrollmentstatus == 'assigned' ? 'text-primary' : 'text-yellow-500'}`}
                                    >
                                        Tình trạng:{' '}
                                        {(shiftDataSingle as ShiftDate).shift_enrollment![0].enrollmentstatus ==
                                        'assigned'
                                            ? 'Đã được phân công'
                                            : 'Không được phân công'}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Ngày đăng ký:{' '}
                                        {new Date(
                                            (shiftDataSingle as ShiftDate).shift_enrollment![0].enrollmentdate ||
                                                new Date(),
                                        ).toLocaleDateString('vi-VN')}
                                    </div>
                                </>
                            )}
                        <Button
                            variant="destructive"
                            size="sm"
                            className={`${(shiftDataSingle as ShiftDate).shift_enrollment?.[0]?.enrollmentstatus ? 'hidden' : ''}`}
                            onClick={handleUnenrollShift}
                        >
                            <Icon icon="material-symbols:cancel-outline-rounded" />
                            Hủy đăng ký
                        </Button>
                    </>
                )}
                {type === 'enrollments' && role === 'employee' && selectedRadio === 'unenrolled' && (
                    <Button variant="outline" onClick={handleEnrollShift}>
                        <Icon icon="material-symbols:check-circle-outline-rounded" />
                        Đăng ký
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ShiftCard;
