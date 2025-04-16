import { PrismaClient } from '@prisma/generated/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    async function deleteAllData(tableList: string[]) {
        for (const tableName of tableList) {
            console.log('Truncating all data from ' + tableName);
            await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tableName} RESTART IDENTITY CASCADE;`);
        }
    }

    const tableList = [
        'autoassignment_rules',
        'shift_assignment',
        'shift_date',
        'shift',
        'employees',
        'accounts',
        'reward_rules',
        'penalty_rules',
        'zone_prices',
        'courts',
        'zones',
        'product_descriptions',
        'products',
        'suppliers',
    ];

    await deleteAllData(tableList);

    console.log('🌱 Seeding...');
    // Insert Accounts
    const password = '123';
    const hashedPassword = (await bcrypt.hash(password, 10)).toString();

    await prisma.accounts.createMany({
        data: [
            {
                username: 'admin',
                password: hashedPassword,
                status: 'Active',
                fullname: 'Admin',
                email: 'admin@example.com',
                accounttype: 'Employee',
                createdat: new Date(),
                updatedat: new Date(),
            },
            {
                username: 'nguyenvana',
                password: hashedPassword,
                status: 'Active',
                fullname: 'Nguyễn Văn A',
                email: 'nguyenvana@example.com',
                dob: new Date('1990-01-01'),
                gender: 'Male',
                phonenumber: '0123456789',
                address: '123 Đường A, Quận 1',
                accounttype: 'Employee',
                createdat: new Date(),
                updatedat: new Date(),
            },
            {
                username: 'tranthib',
                password: hashedPassword,
                status: 'Active',
                fullname: 'Trần Thị B',
                email: 'tranthib@example.com',
                dob: new Date('1992-02-02'),
                gender: 'Female',
                phonenumber: '0987654321',
                address: '456 Đường B, Quận 2',
                accounttype: 'Employee',
                createdat: new Date(),
                updatedat: new Date(),
            },
            {
                username: 'lehongc',
                password: hashedPassword,
                status: 'Active',
                fullname: 'Lê Hồng C',
                email: 'lehongc@example.com',
                dob: new Date('1991-03-03'),
                gender: 'Male',
                phonenumber: '0369852147',
                address: '789 Đường C, Quận 3',
                accounttype: 'Employee',
                createdat: new Date(),
                updatedat: new Date(),
            },
            {
                username: 'lehoangd',
                password: hashedPassword,
                status: 'Active',
                fullname: 'Lê Hoàng D',
                email: 'lehoangd@example.com',
                dob: new Date('1993-04-04'),
                gender: 'Female',
                phonenumber: '0123456789',
                address: '123 Đường D, Quận 4',
                accounttype: 'Employee',
                createdat: new Date(),
                updatedat: new Date(),
            },
            {
                username: 'nguyenminhe',
                password: hashedPassword,
                status: 'Active',
                fullname: 'Nguyễn Minh E',
                email: 'nguyenminhe@example.com',
                dob: new Date('1994-05-05'),
                gender: 'Male',
                phonenumber: '0987654321',
                address: '456 Đường E, Quận 5',
                accounttype: 'Employee',
                createdat: new Date(),
                updatedat: new Date(),
            },
            {
                username: 'buithanhf',
                password: hashedPassword,
                status: 'Active',
                fullname: 'Bùi Thành F',
                email: 'buithanhf@example.com',
                dob: new Date('1995-06-06'),
                gender: 'Female',
                phonenumber: '0369852147',
                address: '789 Đường F, Quận 6',
                accounttype: 'Employee',
                createdat: new Date(),
                updatedat: new Date(),
            },
            {
                username: 'trantieng',
                password: hashedPassword,
                status: 'Active',
                fullname: 'Trần Tiến G',
                email: 'trantieng@example.com',
                dob: new Date('1996-07-07'),
                gender: 'Male',
                phonenumber: '0123456789',
                address: '123 Đường G, Quận 7',
                accounttype: 'Employee',
                createdat: new Date(),
                updatedat: new Date(),
            },
            {
                username: 'phamthih',
                password: hashedPassword,
                status: 'Active',
                fullname: 'Phạm Thị H',
                email: 'phamthih@example.com',
                dob: new Date('1997-08-08'),
                gender: 'Female',
                phonenumber: '0987654321',
                address: '456 Đường H, Quận 8',
                accounttype: 'Employee',
                createdat: new Date(),
                updatedat: new Date(),
            },
            {
                username: 'phumyi',
                password: hashedPassword,
                status: 'Active',
                fullname: 'Phù Mỹ I',
                email: 'phumyi@example.com',
                dob: new Date('1998-09-09'),
                gender: 'Male',
                phonenumber: '0369852147',
                address: '789 Đường I, Quận 9',
                accounttype: 'Employee',
                createdat: new Date(),
                updatedat: new Date(),
            },
            {
                username: 'caobaj',
                password: hashedPassword,
                status: 'Active',
                fullname: 'Cao Bá J',
                email: 'caobaj@example.com',
                dob: new Date('1999-10-10'),
                gender: 'Male',
                phonenumber: '0123456789',
                address: '123 Đường J, Quận 10',
                accounttype: 'Employee',
                createdat: new Date(),
                updatedat: new Date(),
            },
            {
                username: 'hoangthik',
                password: hashedPassword,
                status: 'Active',
                fullname: 'Hoàng Thị K',
                email: 'hoangthik@example.com',
                dob: new Date('1999-11-11'),
                gender: 'Female',
                phonenumber: '0123456789',
                address: '123 Đường K, Quận 11',
                accounttype: 'Employee',
                createdat: new Date(),
                updatedat: new Date(),
            },
            {
                username: 'nguyenducl',
                password: hashedPassword,
                status: 'Active',
                fullname: 'Nguyễn Đức L',
                email: 'nguyenducl@example.com',
                dob: new Date('2000-12-12'),
                gender: 'Male',
                phonenumber: '0987654321',
                address: '456 Đường L, Quận 12',
                accounttype: 'Employee',
                createdat: new Date(),
                updatedat: new Date(),
            },
            {
                username: 'vophatm',
                password: hashedPassword,
                status: 'Active',
                fullname: 'Võ Phát M',
                email: 'vophatm@example.com',
                dob: new Date('2000-01-01'),
                gender: 'Male',
                phonenumber: '0369852147',
                address: '789 Đường M, Quận Thủ Đức',
                accounttype: 'Employee',
                createdat: new Date(),
                updatedat: new Date(),
            },
            {
                username: 'nguyenvun',
                password: hashedPassword,
                status: 'Active',
                fullname: 'Nguyễn Vũ N',
                email: 'nguyenvun@example.com',
                dob: new Date('2000-02-02'),
                gender: 'Male',
                phonenumber: '0123456789',
                address: '123 Đường N, Quận Bình Thạnh',
                accounttype: 'Customer',
                createdat: new Date(),
                updatedat: new Date(),
            },
            {
                username: 'phamthuyo',
                password: hashedPassword,
                status: 'Active',
                fullname: 'Phạm Thuỳ O',
                email: 'phamthuyo@example.com',
                dob: new Date('2000-03-03'),
                gender: 'Female',
                phonenumber: '0987654321',
                address: '456 Đường O, Quận Gò Vấp',
                accounttype: 'Customer',
                createdat: new Date(),
                updatedat: new Date(),
            },
            {
                username: 'huyenvup',
                password: hashedPassword,
                status: 'Active',
                fullname: 'Huyền Vũ P',
                email: 'huyenvup@example.com',
                dob: new Date('2000-04-04'),
                gender: 'Female',
                phonenumber: '0369852147',
                address: '789 Đường P, Quận Tân Bình',
                accounttype: 'Customer',
                createdat: new Date(),
                updatedat: new Date(),
            },
        ],
    });

    for (let i = 0; i < 1000; i++) {
        await prisma.accounts.create({
            data: {
                username: `user${i}`,
                password: hashedPassword,
                status: 'Active',
                fullname: `User ${i}`,
                accounttype: 'Employee',
                gender: i % 2 === 0 ? 'Male' : 'Female'
            },
        });
    }

    const accountIds = await prisma.accounts.findMany({
            select: {
                accountid: true,
                accounttype: true,
            },
        })

    const employeeIds = accountIds.filter((account) => account.accounttype === 'Employee').map((account) => account.accountid);
    const customerIds = accountIds.filter((account) => account.accounttype === 'Customer').map((account) => account.accountid);
    
    const defaultRoles = ['admin', 'hr_manager', 'wh_manager', 'employee'];

    customerIds.forEach(async (customerId) => {
        await prisma.customers.create({
            data: {
                customerid: customerId,
                totalpurchase: 1000000,
            },
        });
    });

    for (let i = 0; i < employeeIds.length; i++) {
        if (i <= 3) {
            await prisma.employees.create({
                data: {
                    employeeid: employeeIds[i],
                    employee_type: 'Full-time',
                    role: defaultRoles[i],
                },
            });
        } else {
            await prisma.employees.create({
                data: {
                    employeeid: employeeIds[i],
                    employee_type: 'Part-time',
                },
            });
        }
    }

    await prisma.reward_rules.createMany({
        data: [
            {
                rewardname: 'Employee of the Month',
                rewarddescription: 'Thưởng nhân viên xuất sắc nhất tháng',
                rewardtype: 'Product',
            },
            {
                rewardname: 'Attendance Bonus',
                rewarddescription: 'Thưởng theo chuyên cần',
                rewardtype: 'Commendation',
            },
            {
                rewardname: 'Perfomance Bonus',
                rewarddescription: 'Thưởng theo hiệu suất làm việc',
                rewardtype: 'Voucher',
            },
            {
                rewardname: 'Profit-sharing Bonus',
                rewarddescription: 'Thưởng theo kết quả kinh doanh trong 1 năm',
                rewardtype: '1 Month Salary',
            },
            {
                rewardname: 'Holidays Bonus',
                rewarddescription: 'Thưởng cho các ngày lễ, tết, sinh nhật của nhân viên',
                rewardtype: 'Money',
                rewardvalue: 500000,
            },
        ],
    });

    await prisma.penalty_rules.createMany({
        data: [
            {
                penaltyname: 'Late for work',
                penaltydescription: 'Phạt nhân viễn đến trễ giờ làm việc',
                basepenalty: 0,
                incrementalpenalty: 20000,
                maxiumpenalty: 100000,
            },
            {
                penaltyname: 'Unauthorized absence',
                penaltydescription: 'Phạt nhân viên vắng mặt không phép, tự ý bỏ ca làm việc',
                basepenalty: 50000,
                incrementalpenalty: 50000,
                maxiumpenalty: 300000,
                disciplineaction: 'Terminate',
            },
            {
                penaltyname: 'Failure to comply with workplace policies',
                penaltydescription: 'Phạt nhân viên vi phạm chính sách/quy định nơi làm việc',
                basepenalty: 0,
                incrementalpenalty: 20000,
                maxiumpenalty: 100000,
            },
        ],
    });

    await prisma.shift.createMany({
        data: [
            {
                shiftstarthour: '06:00:00',
                shiftendhour: '14:00:00',
                shifttype: 'Full-time',
            },
            {
                shiftstarthour: '14:00:00',
                shiftendhour: '22:00:00',
                shifttype: 'Full-time',
            },
            {
                shiftstarthour: '06:00:00',
                shiftendhour: '10:00:00',
                shifttype: 'Part-time',
            },
            {
                shiftstarthour: '10:00:00',
                shiftendhour: '14:00:00',
                shifttype: 'Part-time',
            },
            {
                shiftstarthour: '14:00:00',
                shiftendhour: '18:00:00',
                shifttype: 'Part-time',
            },
            {
                shiftstarthour: '18:00:00',
                shiftendhour: '22:00:00',
                shifttype: 'Part-time',
            },
        ],
    });

    // Insert Auto Assignment Rules
    await prisma.autoassignment_rules.createMany({
        data: [
            {
                rulename: "Số ca tối đa 1 ngày",
                ruledescription: "Số ca làm việc tối đa có thể được phân công cho 1 nhân viên bán thời gian trong 1 ngày",
                rulestatus: "Active",
                ruleforemptype: "Part-time",
                rulevalue: "2",
                ruleappliedfor: "Employee",
                ruletype: "WHERE",
                rulesql:
                    `
                    daily_shift_counts AS (
                        SELECT 
                            ae.employeeid,
                            sd.shiftdate,
                            COALESCE(COUNT(sa.*), 0) AS assigned_shifts_in_day
                        FROM available_employees ae
                        CROSS JOIN date_range dr
                        CROSS JOIN shift_date sd
                        LEFT JOIN shift_assignment sa ON ae.employeeid = sa.employeeid
                            AND sa.shiftid = sd.shiftid
                            AND sa.shiftdate = sd.shiftdate
                        WHERE sd.shiftdate >= dr.next_week_start
                            AND sd.shiftdate < dr.next_week_end
                        GROUP BY ae.employeeid, sd.shiftdate
                    )
                `,
                columnname: "dsc.assigned_shifts_in_day,dsc.shiftdate",
                ctename: "daily_shift_counts dsc",
                condition: "assigned_shifts_in_day < rulevalue AND shiftdate = $shiftdate",
                createdat: new Date(),
                updatedat: new Date(),
            },
            {
                rulename: "Sắp xếp theo điểm ưu tiên",
                ruledescription: "Khi có đụng độ, ưu tiên phân công nhân viên có điểm ưu tiên cao hơn",
                rulestatus: "Active",
                ruleforemptype: "Part-time",
                rulevalue: "DESC",
                ruleappliedfor: "Employee",
                ruletype: "ORDER",
                rulesql:
                    `
                    late_counts AS (
                        SELECT 
                            pr.employeeid, 
                            COUNT(*) AS late_count
                        FROM penalty_records pr
                        JOIN available_employees ae ON ae.employeeid = pr.employeeid
                        JOIN penalty_rules pru ON pr.penaltyruleid = pru.penaltyruleid, date_range dr
                        WHERE LOWER(pru.penaltyname) = 'late for work'
                            AND pr.violationdate >= dr.current_month_start 
                            AND pr.violationdate < dr.current_month_end
                        GROUP BY pr.employeeid
                    ),
                    absence_counts AS (
                        SELECT 
                            pr.employeeid, 
                            COUNT(*) AS absence_count
                        FROM penalty_records pr
                        JOIN available_employees ae ON ae.employeeid = pr.employeeid
                        JOIN penalty_rules pru ON pr.penaltyruleid = pru.penaltyruleid, date_range dr
                        WHERE LOWER(pru.penaltyname) = 'unauthorized absence'
                            AND pr.violationdate >= dr.current_month_start 
                            AND pr.violationdate < dr.current_month_end
                        GROUP BY pr.employeeid
                    ),
                    employee_priority AS (
                        SELECT
                            ae.employeeid,
                            lc.late_count,
                            ac.absence_count,
                            100 - (COALESCE(lc.late_count, 0) + 3 * COALESCE(ac.absence_count, 0)) AS priority_score
                        FROM available_employees ae
                        LEFT JOIN late_counts lc ON ae.employeeid = lc.employeeid
                        LEFT JOIN absence_counts ac ON ae.employeeid = ac.employeeid
                    )
                `,
                columnname: "ep.priority_score",
                ctename: "employee_priority ep",
                condition: "priority_score rulevalue",
                createdat: new Date(),
                updatedat: new Date(),
            },
            {
                rulename: "Số ca tối đa 1 tuần",
                ruledescription: "Số ca làm việc tối đa có thể được phân công cho 1 nhân viên bán thời gian trong 1 tuần",
                rulestatus: "Active",
                ruleforemptype: "Part-time",
                rulevalue: "12",
                ruleappliedfor: "Employee",
                ruletype: "WHERE",
                rulesql:
                    `
                    shift_counts AS (
                        SELECT 
                            ae.employeeid, 
                            COALESCE(COUNT(sa.*), 0) AS assigned_shifts
                        FROM available_employees ae
                        CROSS JOIN date_range dr
                        LEFT JOIN shift_assignment sa ON ae.employeeid = sa.employeeid
                            AND sa.shiftdate >= dr.next_week_start 
                            AND sa.shiftdate < dr.next_week_end
                        GROUP BY ae.employeeid
                    )  
                `,
                columnname: "sc.assigned_shifts",
                ctename: "shift_counts sc",
                canbecollided: true,
                condition: "assigned_shifts < rulevalue",
                createdat: new Date(),
                updatedat: new Date(),
            },
            {
                rulename: "Sắp xếp theo số ca làm trong tuần",
                ruledescription: "Khi có đụng độ, ưu tiên phân công nhân viên có số ca làm trong tuần ít hơn",
                rulestatus: "Active",
                ruleforemptype: "Part-time",
                rulevalue: "ASC",
                ruleappliedfor: "Employee",
                ruletype: "ORDER",
                rulesql:
                    `
                    shift_counts AS (
                        SELECT 
                            ae.employeeid, 
                            COALESCE(COUNT(sa.*), 0) AS assigned_shifts
                        FROM available_employees ae
                        CROSS JOIN date_range dr
                        LEFT JOIN shift_assignment sa ON ae.employeeid = sa.employeeid
                            AND sa.shiftdate >= dr.next_week_start 
                            AND sa.shiftdate < dr.next_week_end
                        GROUP BY ae.employeeid
                    )
                `,
                columnname: "sc.assigned_shifts",
                ctename: "shift_counts sc",
                canbecollided: true,
                condition: "assigned_shifts rulevalue",
                createdat: new Date(),
                updatedat: new Date(),
            },
            {
                rulename: "Số nhân viên tối đa trong 1 ca",
                ruledescription: "Số nhân viên tối đa có thể được phân công trong 1 ca làm việc bán thời gian",
                rulestatus: "Active",
                ruleforemptype: "Part-time",
                rulevalue: "2",
                ruleappliedfor: "Shift",
                ruletype: "WHERE",
                rulesql:
                    `
                    employee_counts AS (
                        SELECT
                            nws.shiftid,
                            nws.shiftdate,
                            COALESCE(COUNT(sa.employeeid), 0) AS assigned_employees
                        FROM next_week_shifts nws
                        LEFT JOIN shift_assignment sa ON nws.shiftid = sa.shiftid
                            AND nws.shiftdate = sa.shiftdate
                        GROUP BY nws.shiftid, nws.shiftdate
                    )
                `,
                columnname: "ec.assigned_employees",
                ctename: "employee_counts ec",
                condition: "assigned_employees < rulevalue",
                createdat: new Date(),
                updatedat: new Date(),
            },
        ],
    });

    const nextWeekStart = new Date();
    const currentDay = new Date().getDay();
    const dayToMonday = currentDay === 0 ? 1 : 8 - currentDay;
    nextWeekStart.setDate(nextWeekStart.getDate() + dayToMonday);

    const shifts = await prisma.shift.findMany({});
    const shiftDate = new Date(nextWeekStart);
    shiftDate.setHours(0, 0, 0, 0);

    for (const shift of shifts) {
        for (let i = 0; i < 7; i++) {
            shiftDate.setDate(nextWeekStart.getDate() + i);
            await prisma.shift_date.createMany({
                data: [
                    {
                        shiftid: shift.shiftid,
                        shiftdate: shiftDate,
                    },
                ],
            });
        }
    }

    await prisma.zones.createMany({
        data: [
            {
                zonename: 'Zone A',
                zonetype: 'Normal',
                zoneimgurl: 'https://res.cloudinary.com/dnagyxwcl/image/upload/v1742905522/Zone/ZoneA_Thuong.jpg',
            },
            {
                zonename: 'Zone B',
                zonetype: 'AirConditioner',
                zoneimgurl: 'https://res.cloudinary.com/dnagyxwcl/image/upload/v1742905407/Zone/ZoneMayLanh.png',
            },
            {
                zonename: 'Zone C',
                zonetype: 'Private',
                zoneimgurl: 'https://res.cloudinary.com/dnagyxwcl/image/upload/v1742905204/Zone/ZoneB_01.jpg',
            },
        ],
    });

    await prisma.zone_prices.createMany({
        data: [
            {
                dayfrom: 'Monday',
                dayto: 'Friday',
                starttime: '06:00:00',
                endtime: '07:00:00',
                price: 100000,
                zoneid: 1,
            },
            {
                dayfrom: 'Monday',
                dayto: 'Friday',
                starttime: '07:00:00',
                endtime: '16:00:00',
                price: 90000,
                zoneid: 1,
            },
            {
                dayfrom: 'Monday',
                dayto: 'Friday',
                starttime: '16:00:00',
                endtime: '22:00:00',
                price: 140000,
                zoneid: 1,
            },
            {
                dayfrom: 'Saturday',
                dayto: 'Sunday',
                starttime: '06:00:00',
                endtime: '22:00:00',
                price: 140000,
                zoneid: 1,
            },
            {
                dayfrom: 'Monday',
                dayto: 'Friday',
                starttime: '06:00:00',
                endtime: '07:00:00',
                price: 110000,
                zoneid: 2,
            },
            {
                dayfrom: 'Monday',
                dayto: 'Friday',
                starttime: '07:00:00',
                endtime: '16:00:00',
                price: 100000,
                zoneid: 2,
            },
            {
                dayfrom: 'Monday',
                dayto: 'Friday',
                starttime: '16:00:00',
                endtime: '22:00:00',
                price: 150000,
                zoneid: 2,
            },
            {
                dayfrom: 'Saturday',
                dayto: 'Sunday',
                starttime: '06:00:00',
                endtime: '22:00:00',
                price: 150000,
                zoneid: 2,
            },
            {
                dayfrom: 'Monday',
                dayto: 'Friday',
                starttime: '06:00:00',
                endtime: '07:00:00',
                price: 120000,
                zoneid: 3,
            },
            {
                dayfrom: 'Monday',
                dayto: 'Friday',
                starttime: '07:00:00',
                endtime: '16:00:00',
                price: 110000,
                zoneid: 3,
            },
            {
                dayfrom: 'Monday',
                dayto: 'Friday',
                starttime: '16:00:00',
                endtime: '22:00:00',
                price: 160000,
                zoneid: 3,
            },
            {
                dayfrom: 'Saturday',
                dayto: 'Sunday',
                starttime: '06:00:00',
                endtime: '22:00:00',
                price: 160000,
                zoneid: 3,
            },
        ],
    });

    await prisma.courts.createMany({
        data: [
            {
                courtname: 'Court A1',
                zoneid: 1,
            },
            {
                courtname: 'Court B1',
                zoneid: 1,
            },
            {
                courtname: 'Court C1',
                zoneid: 1,
            },
            {
                courtname: 'Court D1',
                zoneid: 1,
            },
            {
                courtname: 'Court E1',
                zoneid: 1,
            },
            {
                courtname: 'Court F1',
                zoneid: 1,
            },
            {
                courtname: 'Court G1',
                zoneid: 1,
            },
            {
                courtname: 'Court H1',
                zoneid: 1,
            },
            {
                courtname: 'Court A2',
                zoneid: 2,
            },
            {
                courtname: 'Court B2',
                zoneid: 2,
            },
            {
                courtname: 'Court C2',
                zoneid: 2,
            },
            {
                courtname: 'Court A3',
                zoneid: 3,
            },
            {
                courtname: 'Court B3',
                zoneid: 3,
            },
            {
                courtname: 'Court C3',
                zoneid: 3,
            },
            {
                courtname: 'Court D3',
                zoneid: 3,
            },
            {
                courtname: 'Court E3',
                zoneid: 3,
            },
        ],
    });
    await prisma.product_types.createMany({
        data: [
            {
                producttypename: 'Shoe bag',
                productisfood: false,
            },
            {
                producttypename: 'Badminton tube',
                productisfood: false,
            },
            {
                producttypename: 'Badminton racket grip',
                productisfood: false,
            },
            {
                producttypename: 'Badminton sock',
                productisfood: false,
            },
            {
                producttypename: 'Badminton string',
                productisfood: false,
            },
            {
                producttypename: 'Food',
                productisfood: true,
            },
            {
                producttypename: 'Beverage',
                productisfood: true,
            },
            {
                producttypename: 'Snack',
                productisfood: true,
            }
        ],
    });

    const products = [
        // 1: Shoe bag, 2: Badminton tube, 3: Badminton racket grip, 4: Badminton sock, 5: Badminton string
        // 6: Food, 7: Beverage, 8: Snack
        {
            productname: 'Yonex Badminton Grip',
            batch: 'B001',
            expirydate: null,
            status: 'Available',
            producttypeid: 3,
            stockquantity: 30,
            sellingprice: 150.0,
            rentalprice: 20.0,
            costprice: 100.0,
        },
        {
            productname: 'Li-Ning Shuttlecock',
            batch: 'B002',
            expirydate: null,
            status: 'Available',
            producttypeid: 2,
            stockquantity: 100,
            sellingprice: 25.0,
            rentalprice: null,
            costprice: 15.0,
        },
        {
            productname: 'Yonex Shuttlecock',
            batch: 'B002',
            expirydate: null,
            status: 'Available',
            producttypeid: 2,
            stockquantity: 100,
            sellingprice: 25.0,
            rentalprice: null,
            costprice: 15.0,
        },
        {
            productname: 'Yonex pro string',
            batch: 'B003',
            expirydate: null,
            status: 'Available',
            producttypeid: 5,
            stockquantity: 10,
            sellingprice: 50.0,
            rentalprice: 10.0,
            costprice: 30.0,
        },
        {
            productname: 'Energy Drink',
            batch: 'D001',
            expirydate: new Date('2025-12-31'),
            status: 'Available',
            producttypeid: 7,
            stockquantity: 200,
            sellingprice: 2.5,
            rentalprice: null,
            costprice: 1.5,
        },
        {
            productname: 'Protein Bar',
            batch: 'D002',
            expirydate: new Date('2024-06-30'),
            status: 'Available',
            producttypeid: 8,
            stockquantity: 150,
            sellingprice: 3.0,
            rentalprice: null,
            costprice: 2.0,
        },
        {
            productname: 'Cá viên chiên xiên bẩn',
            batch: 'D002',
            expirydate: new Date('2024-06-30'),
            status: 'Available',
            producttypeid: 6,
            stockquantity: 150,
            sellingprice: 3.0,
            rentalprice: null,
            costprice: 2.0,
        }
    ];

    for (const product of products) {
        await prisma.products.create({
            data: product,
        });

        if (product.producttypeid === 1) {
            await prisma.product_descriptions.create({
                data: {
                    weight: product.productname.includes('Racket') ? 85.0 : null,
                    size: product.productname.includes('Net') ? 'Standard' : null,
                    gripsize: product.productname.includes('Racket') ? 'G4' : null,
                    shaftstiffness: product.productname.includes('Racket') ? 'Medium' : null,
                },
            });
        }
    }

    await prisma.suppliers.createMany({
        data: [
            {
                suppliername: 'Yonex Supplies Co.',
                contactname: 'John Doe',
                phonenumber: '123-456-7890',
                email: 'contact@yonexsupplies.com',
                address: '123 Yonex Street, Tokyo, Japan',
            },
            {
                suppliername: 'Li-Ning Distributors',
                contactname: 'Jane Smith',
                phonenumber: '987-654-3210',
                email: 'info@liningdistributors.com',
                address: '456 Li-Ning Avenue, Beijing, China',
            },
            {
                suppliername: 'Sports Gear Wholesale',
                contactname: 'Michael Johnson',
                phonenumber: '555-123-4567',
                email: 'sales@sportsgear.com',
                address: '789 Sports Lane, Los Angeles, USA',
            },
            {
                suppliername: 'Energy Drinks Ltd.',
                contactname: 'Emily Davis',
                phonenumber: '444-987-6543',
                email: 'support@energydrinks.com',
                address: '321 Energy Drive, London, UK',
            },
            {
                suppliername: 'Healthy Snacks Inc.',
                contactname: 'Chris Brown',
                phonenumber: '333-555-7777',
                email: 'orders@healthysnacks.com',
                address: '654 Snack Boulevard, Sydney, Australia',
            },
        ],
    });

    const parttimeEmployeeIds = (await prisma.employees.findMany({
        select: {
            employeeid: true,
        },
        where: {
            employee_type: 'Part-time',
        },
    })).map((employee) => employee.employeeid);

    const shiftdates = await prisma.shift_date.findMany({
        select: {
            shiftid: true,
            shiftdate: true,
        },
    });

    parttimeEmployeeIds.forEach(async (employeeId) => {
        const randomShiftDate = shiftdates[Math.floor(Math.random() * shiftdates.length)];
        await prisma.shift_enrollment.create({
            data: {
                employeeid: employeeId,
                shiftid: randomShiftDate.shiftid,
                shiftdate: randomShiftDate.shiftdate,
            },
        });
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
