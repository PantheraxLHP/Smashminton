import { Injectable } from '@nestjs/common';
import { CreateShiftDateDto } from './dto/create-shift_date.dto';
import { UpdateShiftDateDto } from './dto/update-shift_date.dto';
import { PrismaService } from '../prisma/prisma.service';
import { EmployeesService } from '../employees/employees.service';
import { UpdateShiftAssignmentDto } from './dto/update-shift_assignment.dto';

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
				shift_assignment: {
					select: {
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
		}).then(results =>
			// Lọc employees theo employee_type ở phía code
			results.map(shift => ({
				...shift,
				shift_assignment: shift.shift_assignment.map(assignment => ({
					...assignment,
					employees: assignment.employees
						? Array.isArray(assignment.employees)
							? assignment.employees.filter(e => e.employee_type === employee_type)
							: [assignment.employees].filter(e => e && e.employee_type === employee_type)
						: []
				}))
			}))
		);
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
		});
	}

	async getEmployeesNotInShift(date: string, starttime: string, endtime: string, employee_type: string, page: number = 1, pageSize: number = 6) {
		const dayFromDate = new Date(date + 'T' + starttime);
		const dayToDate = new Date(date + 'T' + endtime);
		// Lấy danh sách employeeid đã có trong shift_assignment
		const employeesInShifts = await this.prisma.shift_date.findMany({
			where: {
				shiftdate: {
					gte: dayFromDate,
					lte: dayToDate,
				},
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

		// Trích xuất danh sách employeeid từ kết quả
		const employeeIdsInShifts = employeesInShifts
			.flatMap((shift) => shift.shift_assignment)
			.flatMap((assignment) => assignment.employees)
			.map((employee) => employee.employeeid);

		// Tìm tất cả các employee không có trong danh sách trên
		const employeesNotInShifts = await this.employeesService.getEmployeeIdNotInArrayId(employeeIdsInShifts, employee_type, page, pageSize);

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
}
