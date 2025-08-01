import PaginationComponent from '@/components/atomic/PaginationComponent';
import { Input } from '@/components/ui/input';
import { formatDateString } from '@/lib/utils';
import { addAssignment, deleteAssignment, searchEmployees } from '@/services/shiftdate.service';
import { Employees, ShiftAssignment, ShiftDate } from '@/types/types';
import { Icon } from '@iconify/react';
import { getWeek } from 'date-fns';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

interface ShiftCardDetailProps {
    shiftDataSingle: ShiftDate;
    onDataChanged?: () => void;
}

const getDateString = (date: Date | string) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    return `Ngày ${day}, Tháng ${month}, Năm ${year}`;
};

const pixelsPerItem = 60;
const maxAssignmentHeight = pixelsPerItem * 6;
const maxEmployeeHeight = pixelsPerItem * 5 + 16;

const EMPLOYEE_TYPE = 'EMPLOYEE';

interface DragEmployeeItem {
    type: typeof EMPLOYEE_TYPE;
    employee: Employees;
}

interface DraggableEmployeeProps {
    employee: Employees;
    setIsDraggingEmployee: (isDragging: boolean) => void;
}

const DraggableEmployee: React.FC<DraggableEmployeeProps> = ({ employee, setIsDraggingEmployee }) => {
    const [{ isDragging }, dragRef] = useDrag({
        type: EMPLOYEE_TYPE,
        item: () => {
            setIsDraggingEmployee(true);
            return { type: EMPLOYEE_TYPE, employee };
        },
        end: () => {
            setIsDraggingEmployee(false);
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <div
            key={`emp-${employee.employeeid}`}
            className={`bg-primary-50 flex h-15 flex-shrink-0 items-center gap-2 p-2 ${isDragging ? 'opacity-50' : ''}`}
            ref={(node) => {
                dragRef(node);
            }}
        >
            <Image
                src={employee.accounts?.avatarurl || '/user.png'}
                alt={`Hình của nhân viên ${employee.employeeid}`}
                width={40}
                height={40}
                className="rounded-full border-2 border-primary-500 w-[40px] h-[40px] object-cover"
            />
            <span>{employee.accounts?.fullname}</span>
        </div>
    );
};

const ASSIGNMENT_TYPE = 'ASSIGNMENT';

interface DragAssignmentItem {
    type: typeof ASSIGNMENT_TYPE;
    assignment: ShiftAssignment;
}

interface DraggableAssignmentProps {
    assignment: ShiftAssignment;
    setIsDraggingEmployee: (isDragging: boolean) => void;
    removeAssignment: (employeeId: number) => void;
}

const DraggableAssignment: React.FC<DraggableAssignmentProps> = ({
    assignment,
    setIsDraggingEmployee,
    removeAssignment,
}) => {
    const [{ isDragging }, dragRef] = useDrag({
        type: ASSIGNMENT_TYPE,
        item: () => {
            setIsDraggingEmployee(true);
            return { type: ASSIGNMENT_TYPE, assignment };
        },
        end: (item, monitor) => {
            setIsDraggingEmployee(false);

            // Kiểm tra xem có drop vào assignment area không
            const dropResult = monitor.getDropResult<{ targetType?: string }>();
            if (!dropResult || dropResult.targetType !== 'ASSIGNMENT_AREA') {
                // Nếu không drop vào assignment area, thì xóa assignment
                removeAssignment(assignment.employees?.employeeid || 0);
            }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <div
            className={`bg-primary-50 flex h-15 flex-shrink-0 items-center gap-2 p-2 ${isDragging ? 'opacity-50' : ''}`}
            ref={(node) => {
                dragRef(node);
            }}
        >
            <Image
                src={assignment.employees?.accounts?.avatarurl || '/user.png'}
                alt={`Hình của nhân viên ${assignment.employeeid}`}
                width={40}
                height={40}
                className="rounded-full border-2 border-primary-500 w-[40px] h-[40px] object-cover"
            />
            <span>{assignment.employees?.accounts?.fullname || ''}</span>
            { assignment.assignmentstatus === "approved" && (
                <div className="ml-auto flex gap-1 items-center text-sm text-primary">
                    Đã xác nhận
                    <Icon icon="nrk:check-active"/>
                </div>
            )}
            { assignment.assignmentstatus === "refused" && (
                <div className="ml-auto flex gap-1 items-center text-sm text-red-500">
                    {assignment.employees?.employee_type === 'Full-time' ? 'Đã xin nghỉ' : 'Đã từ chối'}
                    <Icon icon="nrk:close-active"/>
                </div>
            )}
        </div>
    );
};

type DragItem = DragEmployeeItem | DragAssignmentItem;

const ShiftCardDetail: React.FC<ShiftCardDetailProps> = ({ shiftDataSingle, onDataChanged }) => {
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(10);
    const [pageSize, setPageSize] = useState(5);
    const weekNumber = getWeek(new Date(shiftDataSingle.shiftdate), { weekStartsOn: 1 });
    const [availableEmployees, setAvailableEmployees] = useState<Employees[]>([]);
    const [isDraggingEmployee, setIsDraggingEmployee] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    // Fetch only available employees
    const fetchAvailableEmployees = async () => {
        const response = await searchEmployees(
            shiftDataSingle.shiftdate,
            shiftDataSingle.shiftid,
            searchQuery,
            page,
            pageSize,
        );
        if (response.ok) {
            setAvailableEmployees(response.data.data);
            setTotalPages(response.data.pagination.totalPages);
            setPage(response.data.pagination.page);
        }
    };

    useEffect(() => {
        fetchAvailableEmployees();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shiftDataSingle.shiftdate, shiftDataSingle.shiftid, page, pageSize, searchQuery]);

    const [{ isOver }, dropRef] = useDrop({
        accept: [EMPLOYEE_TYPE, ASSIGNMENT_TYPE],
        drop: (item: DragItem, monitor) => {
            if (item.type === EMPLOYEE_TYPE && item.employee.employeeid !== undefined) {
                addAssignment({
                    shiftdate: new Date(shiftDataSingle.shiftdate).toISOString(),
                    shiftid: shiftDataSingle.shiftid,
                    employeeid: item.employee.employeeid,
                }).then((response) => {
                    if (response.ok) {
                        if (onDataChanged) onDataChanged();
                        fetchAvailableEmployees();
                    }
                });
            }
            return { targetType: 'ASSIGNMENT_AREA' };
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    const removeAssignment = async (employeeId: number) => {
        const response = await deleteAssignment({
            shiftdate: new Date(shiftDataSingle.shiftdate).toISOString(),
            shiftid: shiftDataSingle.shiftid,
            employeeid: employeeId,
        });
        if (response.ok) {
            if (onDataChanged) onDataChanged();
            fetchAvailableEmployees();
        }
    };

    return (
        <div className="flex h-full w-full flex-col gap-4">
            {/* Tiêu đề của ShiftCardDetail */}
            <div className="flex w-full items-center justify-between border-b-2 border-b-gray-500 pb-2">
                <div className="text-lg">
                    {`Chi tiết phân công cho nhân viên ${shiftDataSingle.shiftid < 3 ? 'toàn thời gian' : 'bán thời gian'}`}
                </div>
                <div className="text-sm">
                    {`Tuần ${weekNumber}, ${getDateString(shiftDataSingle.shiftdate)}, Ca ${shiftDataSingle.shiftid}: ${shiftDataSingle.shift?.shiftstarthour} - ${shiftDataSingle.shift?.shiftendhour}`}
                </div>
            </div>
            {/* Phần hiển thị danh sách nhân viên và phân công */}
            <div className="flex h-full gap-5">
                <div className="flex h-full w-full flex-col gap-2 border-b-2 border-b-gray-500">
                    <span className="text-xs font-semibold">Danh sách nhân viên được phân công</span>
                    {/*Danh sách nhân viên đã được phân công cho ca làm này*/}
                    <div
                        ref={(node) => {
                            dropRef(node);
                        }}
                        className={`relative rounded-md border-2 transition-colors ${isOver ? 'bg-primary-100/20 border-primary border-dashed' : 'border-transparent'} h-full`}
                    >
                        {/* Overlay thể hiện vị trí drop khi đang kéo thả nhân viên */}
                        <div
                            className={`absolute top-0 h-full w-full ${isDraggingEmployee ? 'bg-gray-500/50' : 'hidden bg-transparent'} pointer-events-none flex items-center justify-center rounded-md text-white`}
                        >
                            Thả nhân viên vào đây để thực hiện phân công
                        </div>
                        {(
                            shiftDataSingle.shift_assignment?.filter(
                                (shiftAssignment) => shiftAssignment.employees?.employeeid !== undefined,
                            ) ?? []
                        ).length > 0 ? (
                            <div
                                className="flex flex-col overflow-y-auto"
                                style={{
                                    maxHeight: `${maxAssignmentHeight}px`,
                                }}
                            >
                                {(
                                    shiftDataSingle.shift_assignment?.filter(
                                        (shiftAssignment) => shiftAssignment.employees?.employeeid !== undefined,
                                    ) ?? []
                                ).map((shiftAssignment) => (
                                    <DraggableAssignment
                                        key={`assignment-${shiftAssignment.employees?.employeeid}`}
                                        assignment={shiftAssignment}
                                        setIsDraggingEmployee={setIsDraggingEmployee}
                                        removeAssignment={removeAssignment}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex h-full justify-center p-2 text-sm text-red-500">Chưa có phân công</div>
                        )}
                    </div>
                </div>
                {/* Phần hiển thị danh sách nhân viên có thể phân công */}
                <div className="flex h-full w-full flex-col gap-2 border-b-2 border-b-gray-500">
                    <span className="text-xs font-semibold">Danh sách nhân viên có thể phân công</span>
                    <div className="relative w-full">
                        <Icon
                            icon="material-symbols:search-rounded"
                            className="absolute top-1/2 left-3 size-5 -translate-y-1/2"
                        />
                        <Input
                            name="search_rulename"
                            type="text"
                            placeholder="Tìm kiếm tên hoặc mã nhân viên"
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                            }}
                            defaultValue={''}
                            className="w-full pl-10"
                        />
                    </div>
                    {availableEmployees.length > 0 ? (
                        <div
                            className="flex h-full flex-col overflow-y-auto"
                            style={{
                                maxHeight: `${maxEmployeeHeight}px`,
                            }}
                        >
                            {availableEmployees.map((employee) => (
                                <DraggableEmployee
                                    key={`emp-${employee.employeeid}`}
                                    employee={employee}
                                    setIsDraggingEmployee={setIsDraggingEmployee}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex h-full justify-center p-2 text-sm text-red-500">
                            Không có nhân viên nào
                        </div>
                    )}
                </div>
            </div>
            {/* Component phân trang */}
            <PaginationComponent page={page} setPage={setPage} totalPages={totalPages} />
        </div>
    );
};

export default ShiftCardDetail;
