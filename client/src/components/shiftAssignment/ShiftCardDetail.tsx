import { ShiftDate, ShiftAssignment, Employees } from "@/types/types";
import { getWeek } from "date-fns";
import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";
import { useDrag, useDrop } from "react-dnd";
import Image from "next/image";
import PaginationComponent from "@/components/atomic/PaginationComponent";
import { useState } from "react";

interface ShiftCardDetailProps {
    shiftDate: ShiftDate;
}

const getDateString = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `Ngày ${day}, Tháng ${month}, Năm ${year}`;
}

const pixelsPerItem = 60;
const maxAssignmentHeight = pixelsPerItem * 6;
const maxEmployeeHeight = pixelsPerItem * 5 + 16;

const EMPLOYEE_TYPE = "EMPLOYEE";

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
            className={`bg-primary-50 p-2 flex gap-2 items-center h-15 flex-shrink-0 ${isDragging ? "opacity-50" : ""}`}
            ref={node => { dragRef(node); }}
        >
            <Image
                src={employee.accounts?.avatarurl || "/icon.png"}
                alt={`Hình của nhân viên ${employee.employeeid}`}
                width={40}
                height={40}
                className="rounded-full"
            />
            <span>
                {employee.accounts?.fullname}
            </span>
        </div>
    );
};

const ASSIGNMENT_TYPE = "ASSIGNMENT";

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
    removeAssignment
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
            if (!dropResult || dropResult.targetType !== "ASSIGNMENT_AREA") {
                // Nếu không drop vào assignment area, thì xóa assignment
                removeAssignment(assignment.employeeid);
            }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <div
            className={`bg-primary-50 p-2 flex gap-2 items-center h-15 flex-shrink-0 
                ${isDragging ? "opacity-50" : ""}`}
            ref={node => { dragRef(node); }}
        >
            <Image
                src={assignment.employees?.accounts?.avatarurl || "/icon.png"}
                alt={`Hình của nhân viên ${assignment.employeeid}`}
                width={40}
                height={40}
                className="rounded-full"
            />
            <span>
                {assignment.employees?.accounts?.fullname}
            </span>
        </div>
    );
};

type DragItem = DragEmployeeItem | DragAssignmentItem;

const ShiftCardDetail: React.FC<ShiftCardDetailProps> = ({
    shiftDate,
}) => {
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(10);
    const [pageSize, setPageSize] = useState(5);
    const weekNumber = getWeek(shiftDate.shiftdate, { weekStartsOn: 1 });
    const [shiftAssignments, setShiftAssignments] = useState<ShiftAssignment[]>([
        {
            employeeid: 1,
            shiftid: 1,
            shiftdate: new Date(),
            employees: {
                employeeid: 1,
                employee_type: "fulltime",
                accounts: {
                    accountid: 1,
                    fullname: "Nguyễn Văn A",
                    avatarurl: undefined,
                }
            }
        },
        {
            employeeid: 2,
            shiftid: 1,
            shiftdate: new Date(),
            employees: {
                employeeid: 2,
                employee_type: "parttime",
                accounts: {
                    accountid: 2,
                    fullname: "Nguyễn Văn B",
                    avatarurl: undefined,
                }
            }
        },
    ]);

    const [availableEmployees, setAvailableEmployees] = useState<Employees[]>([
        {
            employeeid: 3,
            employee_type: "parttime",
            accounts: {
                accountid: 3,
                fullname: "Nguyễn Văn C",
                avatarurl: undefined,
            }
        },
        {
            employeeid: 4,
            employee_type: "fulltime",
            accounts: {
                accountid: 4,
                fullname: "Nguyễn Văn D",
                avatarurl: undefined,
            }
        },
        {
            employeeid: 5,
            employee_type: "fulltime",
            accounts: {
                accountid: 5,
                fullname: "Nguyễn Văn E",
                avatarurl: undefined,
            }
        },
        {
            employeeid: 6,
            employee_type: "fulltime",
            accounts: {
                accountid: 6,
                fullname: "Nguyễn Văn F",
                avatarurl: undefined,
            }
        },
        {
            employeeid: 7,
            employee_type: "fulltime",
            accounts: {
                accountid: 7,
                fullname: "Nguyễn Văn G",
                avatarurl: undefined,
            }
        },
    ]);

    const [isDraggingEmployee, setIsDraggingEmployee] = useState(false);

    const [{ isOver }, dropRef] = useDrop({
        accept: [EMPLOYEE_TYPE, ASSIGNMENT_TYPE],
        drop: (item: DragItem, monitor) => {
            if (item.type === EMPLOYEE_TYPE) {
                // Thêm vào shiftAssignments
                setShiftAssignments((prev) => [
                    ...prev,
                    {
                        employeeid: item.employee.employeeid,
                        shiftid: shiftDate.shiftid,
                        shiftdate: shiftDate.shiftdate,
                        employees: item.employee,
                    },
                ]);
                // Xóa khỏi availableEmployees
                setAvailableEmployees((prev) =>
                    prev.filter((e) => e.employeeid !== item.employee.employeeid)
                );
            }
            // Trả về object cho biết đã drop vào assignment area
            return { targetType: "ASSIGNMENT_AREA" };
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    const removeAssignment = (employeeId: number) => {
        const employee = shiftAssignments.find(
            (sa) => sa.employeeid === employeeId
        )?.employees;

        if (employee) {
            setShiftAssignments((prev) =>
                prev.filter((sa) => sa.employeeid !== employeeId)
            );

            setAvailableEmployees((prev) => [...prev, employee]);
        }
    };

    return (
        <div className="flex flex-col gap-4 w-full h-full">
            <div className="flex justify-between items-center w-full border-b-2 pb-2 border-b-gray-500">
                <div className="text-lg">
                    {`Chi tiết phân công cho nhân viên ${shiftDate.shiftid < 3 ? "toàn thời gian" : "bán thời gian"}`}
                </div>
                <div className="text-sm">
                    {`Tuần ${weekNumber}, ${getDateString(shiftDate.shiftdate)}, Ca ${shiftDate.shiftid}: ${shiftDate.shift?.shiftstarthour} - ${shiftDate.shift?.shiftendhour}`}
                </div>
            </div>
            <div className="flex gap-5 h-full">
                <div className="flex flex-col gap-2 w-full h-full border-b-2 border-b-gray-500 relative">
                    <div
                        className={`absolute top-6 left-0 h-[365px] w-full ${isDraggingEmployee ? "bg-gray-500/50" : "bg-transparent hidden"} flex items-center justify-center pointer-events-none text-white rounded-md`}
                    >
                        Thả nhân viên vào đây để thực hiện phân công
                    </div>
                    <span className="text-xs font-semibold">
                        Danh sách nhân viên được phân công
                    </span>
                    <div
                        ref={node => { dropRef(node); }}
                        className={`border-2 rounded-md transition-colors ${isOver ? "bg-primary-100/20 border-primary border-dashed" : "border-transparent"} h-full`}
                    >
                        {shiftAssignments.length > 0 ? (
                            <div className="flex flex-col overflow-y-auto"
                                style={{
                                    maxHeight: `${maxAssignmentHeight}px`,
                                }}
                            >
                                {shiftAssignments.map((shiftAssignment) => (
                                    <DraggableAssignment
                                        key={`assignment-${shiftAssignment.employeeid}`}
                                        assignment={shiftAssignment}
                                        setIsDraggingEmployee={setIsDraggingEmployee}
                                        removeAssignment={removeAssignment}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex justify-center text-sm text-red-500 p-2">
                                Chưa có phân công
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-2 w-full h-full border-b-2 border-b-gray-500">
                    <span className="text-xs font-semibold">
                        Danh sách nhân viên có thể phân công
                    </span>
                    <div className="relative w-full">
                        <Icon
                            icon="material-symbols:search-rounded"
                            className="absolute left-3 top-1/2 -translate-y-1/2 size-5"
                        />
                        <Input
                            name="search_rulename"
                            type="text"
                            placeholder="Tìm kiếm tên hoặc mã nhân viên"
                            defaultValue={""}
                            className="pl-10 w-full"
                        />
                    </div>
                    {availableEmployees.length > 0 ? (
                        <div className="flex flex-col h-full overflow-y-auto"
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
                        <div className="h-full flex justify-center text-sm text-red-500 p-2">
                            Không có nhân viên nào
                        </div>
                    )}
                </div>
            </div>
            <PaginationComponent
                page={page}
                setPage={setPage}
                totalPages={totalPages}
            />
        </div>
    );
}

export default ShiftCardDetail;