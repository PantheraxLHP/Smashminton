import { Injectable, Logger } from '@nestjs/common';
import { CreateShiftDateDto } from './dto/create-shift_date.dto';
import { UpdateShiftDateDto } from './dto/update-shift_date.dto';
import { PrismaService } from '../prisma/prisma.service';
import { EmployeesService } from '../employees/employees.service';
import { UpdateShiftAssignmentDto } from './dto/update-shift_assignment.dto';
import { CreateShiftEnrollmentDto } from './dto/create-shift_enrollment.dto';
import { Cron } from '@nestjs/schedule';
import { parentPort } from 'worker_threads';

@Injectable()
export class ShiftDateService {
    constructor(
        private prisma: PrismaService,
        private employeesService: EmployeesService,
    ) { }
    getShiftDateByDayFromDayTo(dayfrom: string, dayto: string, employee_type: string) {
        const dayFromDate = new Date(dayfrom + 'T00:00:00');
        const dayToDate = new Date(dayto + 'T23:59:59');

        // Xác định shiftid cần lấy theo loại nhân viên
        let shiftIds: number[] = [];
        if (employee_type === 'Full-time') {
            shiftIds = [1, 2];
        } else if (employee_type === 'Part-time') {
            shiftIds = [3, 4, 5, 6];
        }

        return this.prisma.shift_date.findMany({
            where: {
                shiftdate: {
                    gte: dayFromDate,
                    lte: dayToDate,
                },
                shiftid: {
                    in: shiftIds,
                },
            },
            select: {
                shiftid: true,
                shiftdate: true,
                shift: {
                    select: {
                        shiftstarthour: true,
                        shiftendhour: true,
                    },
                },
                shift_assignment: {
                    select: {
                        assignmentstatus: true,
                        employees: {
                            select: {
                                employeeid: true,
                                employee_type: true,
                                accounts: {
                                    select: {
                                        fullname: true,
                                        avatarurl: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }

    getShiftDateByDayFromDayToByEmployee(dayfrom: string, dayto: string, employeeid: number) {
        const dayFromDate = new Date(dayfrom + 'T00:00:00');
        const dayToDate = new Date(dayto + 'T23:59:59');
        return this.prisma.shift_assignment.findMany({
            where: {
                employeeid: employeeid,
                shiftdate: {
                    gte: dayFromDate,
                    lte: dayToDate,
                },
            },
            select: {
                employeeid: true,
                shiftid: true,
                shiftdate: true,
                assignmentstatus: true,
                shift_date: {
                    // Lấy thông tin shift liên quan
                    select: {
                        shift: {
                            select: {
                                shiftstarthour: true,
                                shiftendhour: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async getEmployeesNotInShift(shiftdate: string, shiftid: number, page: number = 1, pageSize: number = 6) {
        // Lấy shift để lấy starttime và endtime
        const shift = await this.prisma.shift.findUnique({
            where: { shiftid },
            select: {
                shifttype: true,
            },
        });
        const employee_type = shift?.shifttype ?? 'Full-time';
        const shiftdate_utc = new Date(shiftdate);

        // Lấy danh sách employeeid đã có trong shift_assignment
        const employeesInShifts = await this.prisma.shift_date.findMany({
            where: {
                shiftid: shiftid,
                shiftdate: shiftdate_utc,
            },
            select: {
                shift_assignment: {
                    select: {
                        employees: {
                            select: {
                                employeeid: true,
                            },
                        },
                    },
                },
            },
        });
        console.log('employeesInShifts', employeesInShifts);
        // Trích xuất danh sách employeeid từ kết quả
        const employeeIdsInShifts = employeesInShifts
            .flatMap((shift) => shift.shift_assignment)
            .flatMap((assignment) => assignment.employees)
            .map((employee) => employee.employeeid);

        // Tìm tất cả các employee không có trong danh sách trên
        const employeesNotInShifts = await this.employeesService.getEmployeeIdNotInArrayId(
            employeeIdsInShifts,
            employee_type,
            page,
            pageSize,
        );
        return employeesNotInShifts;
    }

    async updateShiftEnrollment(updateShiftAssignmentDto: UpdateShiftAssignmentDto) {
        const { employeeid, shiftid, shiftdate, assignmentstatus } = updateShiftAssignmentDto;

        // Cập nhật assignmentstatus cho shift_assignment theo khóa chính (employeeid, shiftid, shiftdate)
        return this.prisma.shift_assignment.update({
            where: {
                employeeid_shiftid_shiftdate: {
                    employeeid,
                    shiftid,
                    shiftdate: new Date(shiftdate),
                },
            },
            data: {
                assignmentstatus,
            },
        });
    }

    async addEmployeeToShiftAssignment(shiftid: number, shiftdate: string, employeeid: number) {
        // Kiểm tra xem đã có bản ghi nào với employeeid, shiftid, shiftdate chưa
        const existingAssignment = await this.prisma.shift_assignment.findUnique({
            where: {
                employeeid_shiftid_shiftdate: {
                    employeeid,
                    shiftid,
                    shiftdate: new Date(shiftdate),
                },
            },
        });

        if (existingAssignment) {
            // Nếu đã có, trả về thông báo hoặc xử lý theo yêu cầu
            return { message: 'Employee is already assigned to this shift.' };
        }

        // Nếu chưa có, thêm mới bản ghi
        return this.prisma.shift_assignment.create({
            data: {
                employeeid,
                shiftid,
                shiftdate: new Date(shiftdate),
                assignmentstatus: 'approved',
            },
        });
    }

    removeEmployeeFromShiftAssignment(shiftid: number, shiftdate: string, employeeid: number) {
        // Xóa bản ghi shift_assignment theo khóa chính (employeeid, shiftid, shiftdate)
        return this.prisma.shift_assignment.delete({
            where: {
                employeeid_shiftid_shiftdate: {
                    employeeid,
                    shiftid,
                    shiftdate: new Date(shiftdate),
                },
            },
        });
    }

    async searchEmployees(query: string, employee_type?: string, page: number = 1, pageSize: number = 6) {
        const where: any = {};

        // Lọc theo loại nhân viên nếu có
        if (employee_type) {
            where.employee_type = employee_type;
        }

        // Xử lý query
        query = query.trim();
        let idPart: number | undefined;
        let namePart: string | undefined;

        // Trường hợp: "2", "2-", "2-Hoang", "2 Hoang"
        const match = query.match(/^(\d+)[-\s]?(.*)$/);
        if (match) {
            idPart = parseInt(match[1], 10);
            namePart = match[2]?.trim();
            if (namePart) {
                // Tìm theo id và tên
                where.AND = [
                    { employeeid: idPart },
                    { accounts: { fullname: { contains: namePart, mode: 'insensitive' } } },
                ];
            } else {
                // Nếu chỉ là số: tìm theo employeeid hoặc fullname chứa số đó
                where.OR = [
                    { employeeid: idPart },
                    { accounts: { fullname: { contains: String(idPart), mode: 'insensitive' } } },
                ];
            }
        } else if (query.startsWith('-')) {
            // Trường hợp: "-Hoang"
            namePart = query.slice(1).trim();
            where.accounts = { fullname: { contains: namePart, mode: 'insensitive' } };
        } else {
            // Trường hợp: "Hoang", "Hoang Duc"
            namePart = query;
            where.accounts = { fullname: { contains: namePart, mode: 'insensitive' } };
        }

        // Phân trang
        const skip = (page - 1) * pageSize;
        const employees = await this.prisma.employees.findMany({
            where,
            skip,
            take: pageSize,
            orderBy: { employeeid: 'asc' },
        });

        return employees;
    }
    async searchEmployeesNotInShift(
        shiftdate: string,
        shiftid: number,
        query: string,
        page: number = 1,
        pageSize: number = 10,
    ): Promise<any> {
        // Lấy loại nhân viên từ shift
        const shift = await this.prisma.shift.findUnique({
            where: { shiftid },
            select: { shifttype: true },
        });
        const employee_type = shift?.shifttype ?? 'Full-time';
        const shiftdate_utc = new Date(shiftdate);

        // Lấy danh sách employeeid đã có trong shift_assignment
        const employeesInShifts = await this.prisma.shift_date.findMany({
            where: {
                shiftid: shiftid,
                shiftdate: shiftdate_utc,
            },
            select: {
                shift_assignment: {
                    select: {
                        employees: {
                            select: { employeeid: true },
                        },
                    },
                },
            },
        });

        // Trích xuất danh sách employeeid từ kết quả
        const employeeIdsInShifts = employeesInShifts
            .flatMap((shift) => shift.shift_assignment)
            .flatMap((assignment) => assignment.employees)
            .map((employee) => employee.employeeid);

        // Tạo điều kiện tìm kiếm
        const where: any = {
            employeeid: { notIn: employeeIdsInShifts },
            employee_type: employee_type,
            role: { not: 'admin' },
            accounts: { status: 'Active' },
        };

        // Xử lý query: cho phép tìm theo "employeeid-fullname", "employeeid", "fullname"
        let idPart: number | undefined;
        let namePart: string | undefined;
        if (query && query.trim()) {
            const match = query.trim().match(/^(\d+)[-\s]?(.*)$/);
            if (match) {
                idPart = parseInt(match[1], 10);
                namePart = match[2]?.trim();
                if (namePart) {
                    // Tìm theo cả id và tên
                    where.AND = [
                        { employeeid: idPart },
                        { accounts: { fullname: { contains: namePart, mode: 'insensitive' } } },
                    ];
                } else {
                    // Nếu chỉ là số: tìm theo employeeid hoặc fullname chứa số đó
                    where.OR = [
                        { employeeid: idPart },
                        { accounts: { fullname: { contains: String(idPart), mode: 'insensitive' } } },
                    ];
                }
            } else {
                // Chỉ tên
                where.accounts = {
                    ...where.accounts,
                    fullname: { contains: query.trim(), mode: 'insensitive' },
                };
            }
        }

        // Đếm tổng số kết quả
        const total = await this.prisma.employees.count({ where });
        const totalPages = Math.ceil(total / pageSize);
        if (page > totalPages && totalPages >= 0) {
            page = 1;
        }

        // Phân trang
        const skip = (page - 1) * pageSize;
        const take = pageSize;

        // Lấy kết quả phân trang
        const employees = await this.prisma.employees.findMany({
            where,
            select: {
                employeeid: true,
                employee_type: true,
                accounts: {
                    select: {
                        fullname: true,
                        avatarurl: true,
                    },
                },
            },
            orderBy: { employeeid: 'asc' },
            skip,
            take,
        });

        return {
            data: employees,
            pagination: {
                page,
                totalPages,
            },
        };
    }

    async getPartTimeShiftEnrollmentStatusByEmployee(
        dayfrom: string,
        dayto: string,
        employeeid: number,
        filter: string,
    ) {
        const dayFromDate = new Date(dayfrom + 'T00:00:00');
        const dayToDate = new Date(dayto + 'T23:59:59');
        const partTimeShiftIds = [3, 4, 5, 6];
        const shifts = await this.prisma.shift_date.findMany({
            where: {
                shiftdate: {
                    gte: dayFromDate,
                    lte: dayToDate,
                },
                shiftid: {
                    in: partTimeShiftIds,
                },
            },
            select: {
                shiftid: true,
                shiftdate: true,
                shift: {
                    select: {
                        shiftstarthour: true,
                        shiftendhour: true,
                    },
                },
                shift_enrollment: {
                    where: { employeeid }, // <-- Only get enrollment of this employee
                    select: {
                        shiftid: true,
                        shiftdate: true,
                        enrollmentdate: true,
                        enrollmentstatus: true,
                        employees: {
                            select: {
                                employeeid: true,
                                employee_type: true,
                                accounts: {
                                    select: {
                                        fullname: true,
                                        avatarurl: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        // Filter by enrollment status if needed
        let filteredShifts = shifts;
        if (filter === 'enrolled') {
            filteredShifts = shifts.filter((shift) => shift.shift_enrollment && shift.shift_enrollment.length > 0);
        } else if (filter === 'unenrolled') {
            filteredShifts = shifts.filter((shift) => !shift.shift_enrollment || shift.shift_enrollment.length === 0);
        }

        return filteredShifts;
    }

    async createShiftEnrollment(createShiftEnrollmentDto: CreateShiftEnrollmentDto) {
        const { employeeid, shiftid, shiftdate } = createShiftEnrollmentDto;
        // Check if already enrolled
        const existing = await this.prisma.shift_enrollment.findUnique({
            where: {
                employeeid_shiftid_shiftdate: {
                    employeeid,
                    shiftid,
                    shiftdate: new Date(shiftdate),
                },
            },
        });

        if (existing) {
            return { message: 'Employee has already enrolled this shift.' };
        }

        // Create new enrollment
        return this.prisma.shift_enrollment.create({
            data: {
                employeeid,
                shiftid,
                shiftdate: new Date(shiftdate),
            },
        });
    }

    async deleteShiftEnrollment(createShiftEnrollmentDto: CreateShiftEnrollmentDto) {
        const { employeeid, shiftid, shiftdate } = createShiftEnrollmentDto;
        return this.prisma.shift_enrollment.delete({
            where: {
                employeeid_shiftid_shiftdate: {
                    employeeid,
                    shiftid,
                    shiftdate: new Date(shiftdate),
                },
            },
        });
    }

    // Chạy mỗi thứ 2 hằng tuần lúc 00:00
    @Cron("0 0 * * 1")
    async weeklyCreateNextWeekShiftDate() {
        try {
            const today = new Date();
            const currentDay = today.getDay();
            const dayToMonday = currentDay === 0 ? 1 : 8 - currentDay;
            const nextWeekStart = new Date(today);
            nextWeekStart.setDate(today.getDate() + dayToMonday);
            nextWeekStart.setHours(0, 0, 0, 0);
            const nextWeekEnd = new Date(nextWeekStart);
            nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
            nextWeekEnd.setHours(23, 59, 59, 999);

            const existingShiftDates = await this.prisma.shift_date.findMany({
                where: {
                    shiftdate: {
                        gte: nextWeekStart,
                        lt: nextWeekEnd
                    }
                },
            });

            if (existingShiftDates.length > 0) {
                Logger.log(`Found existing shift dates for next week (${nextWeekStart.toLocaleDateString('vi-VN')} to ${nextWeekEnd.toLocaleDateString('vi-VN')}). No new shift dates created.`);
            } else {
                const shifts = await this.prisma.shifts.findMany();
                const shiftdateData: any[] = [];
                for (let i = 0; i < 7; i++) {
                    for (const shift of shifts) {
                        const shiftDate = new Date(nextWeekStart);
                        shiftDate.setDate(shiftDate.getDate() + i);
                        shiftdateData.push({
                            shiftid: shift.shiftid,
                            shiftdate: shiftDate,
                        });
                    }
                }

                await this.prisma.shift_date.createMany({
                    data: shiftdateData,
                });
                Logger.log(`Created shift dates for next week (${nextWeekStart.toLocaleDateString('vi-VN')} to ${nextWeekEnd.toLocaleDateString('vi-VN')}).`);
            }
        } catch (error) {
            console.error("Error in createNextWeekShiftDate:", error);
            throw error;
        }
    }

    // Chạy mỗi ngày vào cuối ngày sau giờ làm việc (23:00)
    @Cron("0 23 * * *")
    async dailyTimesheetCheck() {
        try {
            Logger.log("Starting daily timesheet check for unauthorized absences.");
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Lấy tất cả shift_assignment cho ngày hôm nay
            const violateEmployees = await this.prisma.shift_assignment.findMany({
                where: {
                    shiftdate: today,
                    assignmentstatus: "approved",
                    OR: [
                        {
                            timesheet: {
                                none: {}
                            }
                        },
                        {
                            timesheet: {
                                some: {
                                    OR: [
                                        { checkin_time: null },
                                        { checkout_time: null }
                                    ]
                                }
                            }
                        }
                    ]
                },
                distinct: ['employeeid'],
                select: {
                    employeeid: true,
                },
            });

            if (violateEmployees.length === 0) {
                Logger.log("No unauthorized absences found for today.");
                return;
            }

            const absentRule = await this.prisma.penalty_rules.findFirst({
                where: {
                    penaltyname: "Phạt nghỉ không phép",
                },
            });

            if (!absentRule || !absentRule.basepenalty || !absentRule.incrementalpenalty || !absentRule.maxiumpenalty) {
                Logger.log("No absence rule found or not valid, skipping penalty record creation.");
                return;
            }

            const basePenalty = Number(absentRule.basepenalty);
            const incrementalPenalty = Number(absentRule.incrementalpenalty);
            const maxPenalty = Number(absentRule.maxiumpenalty);

            for (const employee of violateEmployees) {
                const absenceCount = await this.prisma.shift_assignment.count({
                    where: {
                        employeeid: employee.employeeid,
                        shiftdate: today,
                        assignmentstatus: "approved",
                        OR: [
                            {
                                timesheet: {
                                    none: {}
                                }
                            },
                            {
                                timesheet: {
                                    some: {
                                        OR: [
                                            { checkin_time: null },
                                            { checkout_time: null }
                                        ]
                                    }
                                }
                            }
                        ]
                    }
                });

                const penaltyCount = await this.prisma.penalty_records.count({
                    where: {
                        employeeid: employee.employeeid,
                        penaltyruleid: absentRule.penaltyruleid,
                        violationdate: {
                            gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
                            lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
                        },
                    }
                });

                if (absenceCount > penaltyCount) {
                    const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
                    currentMonthStart.setHours(0, 0, 0, 0);
                    const currentMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                    currentMonthEnd.setHours(23, 59, 59, 999);
                    const currentMonthAbsenceCount = await this.prisma.penalty_records.count({
                        where: {
                            penaltyruleid: absentRule.penaltyruleid,
                            employeeid: employee.employeeid,
                            violationdate: {
                                gte: currentMonthStart,
                                lte: currentMonthEnd
                            }
                        },
                    });

                    const penaltyToCreate = absenceCount - penaltyCount;
                    const penaltyRecords: any[] = [];
                    for (let i = 0; i < penaltyToCreate; i++) {
                        let finalPenaltyAmount = 0;

                        const totalAbsenceCount = currentMonthAbsenceCount + i + 1;

                        if (totalAbsenceCount === 1) {
                            finalPenaltyAmount = basePenalty;
                        } else {
                            // - 1 để bớt đi lần tính base penalty
                            const tmp = basePenalty + incrementalPenalty * (totalAbsenceCount - 1);
                            // Giới hạn không vượt quá max penalty
                            finalPenaltyAmount = tmp > maxPenalty ? maxPenalty : tmp;
                        }

                        penaltyRecords.push({
                            penaltyruleid: absentRule.penaltyruleid,
                            employeeid: employee.employeeid,
                            violationdate: today,
                            finalpenaltyamount: finalPenaltyAmount,
                            penaltyapplieddate: today,
                        });
                    }

                    await this.prisma.penalty_records.createMany({
                        data: penaltyRecords
                    });

                    Logger.log(`Created ${penaltyToCreate} absence penalties for employee ${employee.employeeid} on ${today.toLocaleDateString('vi-VN')}`);
                }
            }

            Logger.log(`Daily timesheet check completed. Processed ${violateEmployees.length} employees with potential absences.`);
        } catch (error) {
            console.error("Error in dailyTimesheetCheck:", error);
            throw error;
        }
    }
}
