import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AutoAssignmentService {
    constructor(private readonly prisma: PrismaService) { }

    async autoAssignParttimeShifts(sortOption: number) {
        try {
            const response = await fetch(`${process.env.DROOLS}/api/auto-assignment/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sortOption: sortOption,
                })
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error("Error while assigning part-time shifts:", error);
        }
    }

    async autoAssignFulltimeShifts(assignmentStrategy: string, maxEmpPerShift: number = 1) {
        try {
            if (maxEmpPerShift <= 0) {
                throw new Error("Max employees per fulltime shift must be greater than 0");
            }

            // Lấy danh sách nhân viên full-time trừ Admin (employeeid = 1)
            const fullTimeEmployees = await this.prisma.employees.findMany({
                where: {
                    employee_type: "Full-time",
                    employeeid: {
                        not: 1
                    }
                },
            });

            const nextWeekStart = new Date();
            const currentDay = nextWeekStart.getDay();
            const dayToMonday = currentDay === 0 ? 1 : 8 - currentDay;
            nextWeekStart.setDate(nextWeekStart.getDate() + dayToMonday);
            nextWeekStart.setHours(0, 0, 0, 0);

            const nextWeekEnd = new Date();
            nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
            nextWeekEnd.setHours(23, 59, 59, 999);
            const nextWeekShifts = await this.prisma.shift_date.findMany({
                where: {
                    shiftdate: {
                        gte: nextWeekStart,
                        lte: nextWeekEnd,
                    },
                    shift: {
                        shifttype: "Full-time",
                    },
                },
                include: {
                    shift: true,
                },
                orderBy: [
                    { shiftdate: "asc" },
                    { shiftid: "asc" },
                ],
            });

            if (fullTimeEmployees.length === 0) {
                throw new Error("No full-time employees found");
            }

            if (nextWeekShifts.length === 0) {
                throw new Error("No shifts to be assigned for the next week");
            }

            switch (assignmentStrategy) {
                case "same":
                    // Phân công ca làm việc theo chiến lược "same"
                    await this.assignSameShift(nextWeekStart);
                    break;
                case "rotate":
                    // Phân công ca làm việc theo chiến lược "random"
                    await this.assignRandomShift(nextWeekShifts, fullTimeEmployees, maxEmpPerShift);
                    break;
                case "random":
                    // Phân công ca làm việc theo chiến lược "rotate"
                    await this.assignRotateShift(nextWeekShifts, fullTimeEmployees, maxEmpPerShift);
                    break;
                default:
                    throw new Error("Invalid assignment strategy. Use 'same', 'rotate', or 'random'.");
            }

            console.log("Auto fulltime shift assignment completed.");
        } catch (error) {
            console.error("Error while assigning fulltime shift:", error);
        } finally {

        }
    }

    async assignSameShift(nextWeekStart) {
        const assignments: any[] = [];
        const currentWeekStart = new Date();
        currentWeekStart.setDate(nextWeekStart.getDate() - 7);
        currentWeekStart.setHours(0, 0, 0, 0);
        const currentWeekEnd = new Date();
        currentWeekEnd.setDate(nextWeekStart.getDate() - 1);
        currentWeekEnd.setHours(23, 59, 59, 999);
        try {
            // Lấy phân công của tuần trước
            const currentWeekAssignments = await this.prisma.shift_assignment.findMany({
                where: {
                    shiftdate: {
                        gte: currentWeekStart,
                        lte: currentWeekEnd,
                    },
                    shift_date: {
                        shift: {
                            shifttype: "Full-time",
                        },
                    }
                },
                orderBy: [
                    { shiftdate: "asc" },
                    { shiftid: "asc" },
                ],
            });

            if (currentWeekAssignments.length === 0) {
                throw new Error("No assignments found for the last week.");
            }

            // Phân công ca làm việc cho tuần tới dựa trên ca làm việc của tuần trước
            for (const assignment of currentWeekAssignments) {
                const nextWeekShiftDate = new Date();
                nextWeekShiftDate.setDate(assignment.shiftdate.getDate() + 7);
                assignments.push({
                    employeeid: assignment.employeeid,
                    shiftid: assignment.shiftid,
                    shiftdate: nextWeekShiftDate,
                })
            }

            if (assignments.length === 0) {
                throw new Error("No assignments for the next week, check last week shift assignment, something went wrong.");
            } else {
                await this.prisma.shift_assignment.createMany({
                    data: assignments,
                });
                console.log("Next week assignments assigned \"SAME\" have been created successfully.");
            }

        } catch (error) {
            console.error("Error in assignSameShift:", error);
            return;
        }
    }

    async assignRandomShift(nextWeekShifts, fullTimeEmployees, maxEmpPerShift: number) {
        const assignments: any[] = [];
        try {
            const assignedShifts = new Map<number, number>();
            for (const employee of fullTimeEmployees) {
                assignedShifts.set(employee.employeeid, 0);
            }
            const shuffleArray = <T>(array: T[]) => {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            };

            const sortEmployeesByAssignedShifts = (employees: any[]) => {
                return employees.sort((a, b) => {
                    const assignedA = assignedShifts.get(a.employeeid) || 0;
                    const assignedB = assignedShifts.get(b.employeeid) || 0;
                    return assignedA - assignedB;
                });
            }

            const shuffledShifts: any[] = shuffleArray(nextWeekShifts);
            for (const shift of shuffledShifts) {
                const sortedEmployees = sortEmployeesByAssignedShifts(fullTimeEmployees);
                for (let i = 0; i < maxEmpPerShift; i++) {
                    if (i >= sortedEmployees.length) break; // Tránh lỗi nếu không đủ nhân viên
                    const employee = sortedEmployees[i];
                    assignments.push({
                        employeeid: employee.employeeid,
                        shiftid: shift.shiftid,
                        shiftdate: shift.shiftdate,
                    });
                    assignedShifts.set(employee.employeeid, (assignedShifts.get(employee.employeeid) || 0) + 1);
                }
            }

            if (assignments.length === 0) {
                throw new Error("No assignments for the next week, something went wrong.");
            } else {
                await this.prisma.shift_assignment.createMany({
                    data: assignments,
                });
                console.log("Next week assignments assigned \"RANDOM\" have been created successfully.");
            }

        } catch (error) {
            console.error("Error in assignRandomShift:", error);
            return;
        }
    }

    async assignRotateShift(nextWeekShifts, fullTimeEmployees, maxEmpPerShift: number) {
        const assignments: any[] = [];

        try {
            // Xác định loại buổi làm việc cho từng nhân viên
            // Morning chỉ được phân ca sáng
            // Evening chỉ được phân ca chiều
            // Mix có thể phân ca sáng hoặc chiều
            // Xoay tua qua các loại buổi làm việc: 
            // "Morning" --> "Evening"
            // "Evening" --> "Mix"
            // "Mix" --> "Morning"
            const initialShiftTypes = ["Morning", "Evening", "Mix"];
            let initialShiftIndex = 0;

            const preferredShiftType = new Map<number, string>();

            fullTimeEmployees.forEach((employees) => {
                if (employees.last_week_shift_type) {
                    const preferredShiftIndex = (initialShiftTypes.indexOf(employees.last_week_shift_type) + 1) % initialShiftTypes.length;
                    preferredShiftType.set(employees.employeeid, initialShiftTypes[preferredShiftIndex]);
                } else {
                    preferredShiftType.set(employees.employeeid, initialShiftTypes[initialShiftIndex]);
                    initialShiftIndex = (initialShiftIndex + 1) % initialShiftTypes.length;
                }
            });

            const shuffleArray = <T>(array: T[]) => {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            };

            // Sắp xếp ngẫu nhiên danh sách ca làm việc
            const morningShifts: any[] = shuffleArray(nextWeekShifts.filter((shift) => shift.shiftid === 1));
            const eveningShifts: any[] = shuffleArray(nextWeekShifts.filter((shift) => shift.shiftid === 2));

            // Phân loại nhân viên theo loại ca làm việc
            const morningEmployees = Array.from(preferredShiftType.entries()).filter(([_, value]) => value === "Morning");
            const eveningEmployees = Array.from(preferredShiftType.entries()).filter(([_, value]) => value === "Evening");
            const mixEmployees = Array.from(preferredShiftType.entries()).filter(([_, value]) => value === "Mix");

            // Phân công ca sáng cho nhân viên Morning và Mix
            let count = 0;
            for (const shift of morningShifts) {
                let assignmentCount = 0;
                while (assignmentCount < maxEmpPerShift) {
                    if (count < 5) {
                        for (const [empId, _] of morningEmployees) {
                            assignments.push({
                                employeeid: empId,
                                shiftid: shift.shiftid,
                                shiftdate: shift.shiftdate,
                            });
                            assignmentCount++;
                            if (assignmentCount >= maxEmpPerShift)
                                break;
                        }
                    }
                    else {
                        for (const [empId, _] of mixEmployees) {
                            assignments.push({
                                employeeid: empId,
                                shiftid: shift.shiftid,
                                shiftdate: shift.shiftdate,
                            });
                            assignmentCount++;
                            if (assignmentCount >= maxEmpPerShift)
                                break;
                        }
                    }
                    count++;
                }
            }


            // Phân công ca chiều cho nhân viên Evening và Mix
            count = 0;
            for (const shift of eveningShifts) {
                let assignmentCount = 0;
                while (assignmentCount < maxEmpPerShift) {
                    if (count < 5) {
                        for (const [empId, _] of eveningEmployees) {
                            assignments.push({
                                employeeid: empId,
                                shiftid: shift.shiftid,
                                shiftdate: shift.shiftdate,
                            });
                            assignmentCount++;
                            if (assignmentCount >= maxEmpPerShift)
                                break;
                        }
                    }
                    else {
                        for (const [empId, _] of mixEmployees) {
                            assignments.push({
                                employeeid: empId,
                                shiftid: shift.shiftid,
                                shiftdate: shift.shiftdate,
                            });
                            assignmentCount++;
                            if (assignmentCount >= maxEmpPerShift)
                                break;
                        }
                    }
                    count++;
                }
            }

            if (assignments.length === 0) {
                throw new Error("No assignments for the next week, check last week shift type, something went wrong.");
            } else {
                await this.prisma.shift_assignment.createMany({
                    data: assignments,
                });

                // Cập nhật loại ca làm việc cho từng nhân viên
                for (const [employeeId, shiftType] of preferredShiftType) {
                    await this.prisma.employees.update({
                        where: { employeeid: employeeId },
                        data: { last_week_shift_type: shiftType },
                    });
                }

                console.log("Next week assignments assigned \"ROTATE\" have been created successfully.");
            }

        } catch (error) {
            console.error("Error in assignRotateShift:", error);
            return;
        }
    }
}