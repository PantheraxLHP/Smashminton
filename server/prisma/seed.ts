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
        'suppliers',
        'products',
        'product_types',
        'product_filter',
        'product_filter_values',
        'product_attributes',
        'purchase_order',
        'product_batch',
        'order_product',
        'orders',
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
                gender: 'Nam',
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
                gender: 'Nữ',
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
                gender: 'Nam',
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
                gender: 'Nữ',
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
                gender: 'Nam',
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
                gender: 'Nữ',
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
                gender: 'Nam',
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
                gender: 'Nữ',
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
                gender: 'Nam',
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
                gender: 'Nam',
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
                gender: 'Nữ',
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
                gender: 'Nam',
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
                gender: 'Nam',
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
                gender: 'Nam',
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
                gender: 'Nữ',
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
                gender: 'Nữ',
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
                gender: i % 2 === 0 ? 'Nam' : 'Nữ',
            },
        });
    }

    const accountIds = await prisma.accounts.findMany({
        select: {
            accountid: true,
            accounttype: true,
        },
    });

    const employeeIds = accountIds
        .filter((account) => account.accounttype === 'Employee')
        .map((account) => account.accountid);
    const customerIds = accountIds
        .filter((account) => account.accounttype === 'Customer')
        .map((account) => account.accountid);

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
                penaltydescription: 'Phạt nhân viên đến trễ giờ làm việc',
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
                rulename: 'Số ca tối đa 1 ngày',
                ruledescription:
                    'Số ca làm việc tối đa có thể được phân công cho 1 nhân viên bán thời gian trong 1 ngày',
                rulestatus: 'Active',
                ruleforemptype: 'Part-time',
                rulevalue: '2',
                ruleappliedfor: 'Employee',
                ruletype: 'WHERE',
                rulesql: `
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
                columnname: 'dsc.assigned_shifts_in_day,dsc.shiftdate',
                ctename: 'daily_shift_counts dsc',
                condition: 'assigned_shifts_in_day < rulevalue AND shiftdate = $shiftdate',
                createdat: new Date(),
                updatedat: new Date(),
            },
            {
                rulename: 'Sắp xếp theo điểm ưu tiên',
                ruledescription: 'Khi có đụng độ, ưu tiên phân công nhân viên có điểm ưu tiên cao hơn',
                rulestatus: 'Active',
                ruleforemptype: 'Part-time',
                rulevalue: 'DESC',
                ruleappliedfor: 'Employee',
                ruletype: 'ORDER',
                rulesql: `
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
                columnname: 'ep.priority_score',
                ctename: 'employee_priority ep',
                condition: 'priority_score rulevalue',
                createdat: new Date(),
                updatedat: new Date(),
            },
            {
                rulename: 'Số ca tối đa 1 tuần',
                ruledescription:
                    'Số ca làm việc tối đa có thể được phân công cho 1 nhân viên bán thời gian trong 1 tuần',
                rulestatus: 'Active',
                ruleforemptype: 'Part-time',
                rulevalue: '12',
                ruleappliedfor: 'Employee',
                ruletype: 'WHERE',
                rulesql: `
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
                columnname: 'sc.assigned_shifts',
                ctename: 'shift_counts sc',
                canbecollided: true,
                condition: 'assigned_shifts < rulevalue',
                createdat: new Date(),
                updatedat: new Date(),
            },
            {
                rulename: 'Sắp xếp theo số ca làm trong tuần',
                ruledescription: 'Khi có đụng độ, ưu tiên phân công nhân viên có số ca làm trong tuần ít hơn',
                rulestatus: 'Active',
                ruleforemptype: 'Part-time',
                rulevalue: 'ASC',
                ruleappliedfor: 'Employee',
                ruletype: 'ORDER',
                rulesql: `
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
                columnname: 'sc.assigned_shifts',
                ctename: 'shift_counts sc',
                canbecollided: true,
                condition: 'assigned_shifts rulevalue',
                createdat: new Date(),
                updatedat: new Date(),
            },
            {
                rulename: 'Số nhân viên tối đa trong 1 ca',
                ruledescription: 'Số nhân viên tối đa có thể được phân công trong 1 ca làm việc bán thời gian',
                rulestatus: 'Active',
                ruleforemptype: 'Part-time',
                rulevalue: '2',
                ruleappliedfor: 'Shift',
                ruletype: 'WHERE',
                rulesql: `
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
                columnname: 'ec.assigned_employees',
                ctename: 'employee_counts ec',
                condition: 'assigned_employees < rulevalue',
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
                zonedescription: 'Thông thoáng, không gian rộng, giá hợp lý',
            },
            {
                zonename: 'Zone B',
                zonetype: 'AirConditioner',
                zoneimgurl: 'https://res.cloudinary.com/dnagyxwcl/image/upload/v1742905407/Zone/ZoneMayLanh.png',
                zonedescription: 'Máy lạnh hiện đại, sân cao cấp, dịch vụ VIP',
            },
            {
                zonename: 'Zone C',
                zonetype: 'Private',
                zoneimgurl: 'https://res.cloudinary.com/dnagyxwcl/image/upload/v1742905204/Zone/ZoneB_01.jpg',
                zonedescription: 'Không gian riêng tư, ánh sáng tốt, phù hợp thi đấu',
            },
        ],
    });

    await prisma.zone_prices.createMany({
        data: [
            {
                dayfrom: 'Monday',
                dayto: 'Friday',
                starttime: '06:00',
                endtime: '08:00',
                price: 100000,
                zoneid: 1,
            },
            {
                dayfrom: 'Monday',
                dayto: 'Friday',
                starttime: '08:00',
                endtime: '16:00',
                price: 90000,
                zoneid: 1,
            },
            {
                dayfrom: 'Monday',
                dayto: 'Friday',
                starttime: '16:00',
                endtime: '22:00',
                price: 140000,
                zoneid: 1,
            },
            {
                dayfrom: 'Saturday',
                dayto: 'Sunday',
                starttime: '06:00',
                endtime: '22:00',
                price: 140000,
                zoneid: 1,
            },
            {
                dayfrom: 'Monday',
                dayto: 'Friday',
                starttime: '06:00',
                endtime: '08:00',
                price: 110000,
                zoneid: 2,
            },
            {
                dayfrom: 'Monday',
                dayto: 'Friday',
                starttime: '08:00',
                endtime: '16:00',
                price: 100000,
                zoneid: 2,
            },
            {
                dayfrom: 'Monday',
                dayto: 'Friday',
                starttime: '16:00',
                endtime: '22:00',
                price: 150000,
                zoneid: 2,
            },
            {
                dayfrom: 'Saturday',
                dayto: 'Sunday',
                starttime: '06:00',
                endtime: '22:00',
                price: 150000,
                zoneid: 2,
            },
            {
                dayfrom: 'Monday',
                dayto: 'Friday',
                starttime: '06:00',
                endtime: '07:00',
                price: 120000,
                zoneid: 3,
            },
            {
                dayfrom: 'Monday',
                dayto: 'Friday',
                starttime: '07:00',
                endtime: '16:00',
                price: 110000,
                zoneid: 3,
            },
            {
                dayfrom: 'Monday',
                dayto: 'Friday',
                starttime: '16:00',
                endtime: '22:00',
                price: 160000,
                zoneid: 3,
            },
            {
                dayfrom: 'Saturday',
                dayto: 'Sunday',
                starttime: '06:00',
                endtime: '22:00',
                price: 160000,
                zoneid: 3,
            },
        ],
    });

    await prisma.courts.createMany({
        data: [
            {
                courtname: 'Court A1',
                courtimgurl: 'https://res.cloudinary.com/dnagyxwcl/image/upload/v1745670706/A_1_gmluce.jpg',
                zoneid: 1,
            },
            {
                courtname: 'Court A2',
                courtimgurl: 'https://res.cloudinary.com/dnagyxwcl/image/upload/v1745670707/A_2_dnrqpy.jpg',
                zoneid: 1,
            },
            {
                courtname: 'Court A3',
                courtimgurl: 'https://res.cloudinary.com/dnagyxwcl/image/upload/v1745670707/A_3_wxlkcx.jpg',
                zoneid: 1,
            },
            {
                courtname: 'Court A4',
                courtimgurl: 'https://res.cloudinary.com/dnagyxwcl/image/upload/v1745670706/A_4_x3ymi1.jpg',
                zoneid: 1,
            },
            {
                courtname: 'Court A5',
                courtimgurl: 'https://res.cloudinary.com/dnagyxwcl/image/upload/v1745670707/A_5_m4lot8.jpg',
                zoneid: 1,
            },
            {
                courtname: 'Court A6',
                courtimgurl: 'https://res.cloudinary.com/dnagyxwcl/image/upload/v1745670707/A_6_kmlie9.jpg',
                zoneid: 1,
            },
            {
                courtname: 'Court A7',
                courtimgurl: 'https://res.cloudinary.com/dnagyxwcl/image/upload/v1745670706/A_7_ptadlq.jpg',

                zoneid: 1,
            },
            {
                courtname: 'Court A8',
                courtimgurl: 'https://res.cloudinary.com/dnagyxwcl/image/upload/v1745670706/A_8_rac29n.jpg',

                zoneid: 1,
            },
            {
                courtname: 'Court B1',
                courtimgurl: 'https://res.cloudinary.com/dnagyxwcl/image/upload/v1745668417/B_1_bebuc2.jpg',

                zoneid: 2,
            },
            {
                courtname: 'Court B2',
                courtimgurl: 'https://res.cloudinary.com/dnagyxwcl/image/upload/v1745668417/B_2_nmoioi.jpg',
                zoneid: 2,
            },
            {
                courtname: 'Court B3',
                courtimgurl: 'https://res.cloudinary.com/dnagyxwcl/image/upload/v1745668417/B_3_pgmtsr.jpg',
                zoneid: 2,
            },
            {
                courtname: 'Court C1',
                courtimgurl: 'https://res.cloudinary.com/dnagyxwcl/image/upload/v1745669811/C1_h8yho8.jpg',
                zoneid: 3,
            },
            {
                courtname: 'Court C2',
                courtimgurl: 'https://res.cloudinary.com/dnagyxwcl/image/upload/v1745669811/C2_nd5cgp.jpg',
                zoneid: 3,
            },
            {
                courtname: 'Court C3',
                courtimgurl: 'https://res.cloudinary.com/dnagyxwcl/image/upload/v1745669812/C3_w4danq.jpg',
                zoneid: 3,
            },
        ],
    });

    await prisma.products.createMany({
        data: [
            // 1: Quấn cán, 2: Túi đựng giày, 3: Ống cầu lông, 4: Bóng cầu lông, 5: Dây cầu lông
            // 6: Thức ăn, 7: Nước uống, 8: Snack
            // 9,10,11,12,13: Giày cầu lông
            // 14,15,16,17,18: Vợt cầu lông
            {
                productname: 'Quấn cán cầu lông Yonex AC147EX',
                productimgurl:
                    'https://res.cloudinary.com/dnagyxwcl/image/upload/v1746447341/quan-can-vot-cau-long-yonex-ac147ex-2_mzac1e.webp',
                status: 'Available',
                sellingprice: 10000,
                rentalprice: null,
                costprice: 10000,
            },
            {
                productname: 'Túi đựng giày cầu lông',
                productimgurl:
                    'https://res.cloudinary.com/dnagyxwcl/image/upload/v1746449426/tui-dung-giay-kamito_ruyqgy.webp',
                status: 'Available',
                sellingprice: 150000,
                rentalprice: null,
                costprice: 150000,
            },
            {
                productname: 'Vớ cầu lông Yonex',
                productimgurl: 'https://res.cloudinary.com/dnagyxwcl/image/upload/v1746449369/vo-cau-long-y',
                status: 'Available',
                sellingprice: 65000,
                rentalprice: null,
                costprice: 65000,
            },
            {
                productname: 'Ống cầu lông Lining AYQN024',
                productimgurl:
                    'https://res.cloudinary.com/dnagyxwcl/image/upload/v1746447478/ong-cau-long-lining-ayqn-0',
                status: 'Available',
                sellingprice: 255000,
                rentalprice: null,
                costprice: 255000,
            },
            {
                productname: 'Ống cầu lông Yonex AS40',
                productimgurl: 'https://res.cloudinary.com/dnagyxwcl/image/upload/v1746447573/ong-cau-y',
                status: 'Available',
                sellingprice: 950000,
                rentalprice: null,
                costprice: 950000,
            },
            {
                productname: 'Cước Yonex pro',
                productimgurl:
                    'https://res.cloudinary.com/dnagyxwcl/image/upload/v1746447695/Yonex_PolyTour_Pro_16L___1_25_Tennis_String_Y',
                status: 'Available',
                sellingprice: 230000,
                rentalprice: null,
                costprice: 23000,
            },
            {
                productname: 'Nước uống tăng lực Monster bạc',
                productimgurl: 'https://res.cloudinary.com/dnagyxwcl/image/upload/v1746447734/monster-drink_edoi6w.jpg',
                status: 'Available',
                sellingprice: 170000,
                rentalprice: null,
                costprice: 170000,
            },
            {
                productname: 'Thanh protein block chocolate',
                productimgurl:
                    'https://res.cloudinary.com/dnagyxwcl/image/upload/v1746447817/protein-block-chocolate-90-g-riegel-jpeg_pwd4ro.webp',
                status: 'Available',
                sellingprice: 120000,
                rentalprice: null,
                costprice: 120000,
            },
            {
                productname: 'Cá viên chiên ứ hự',
                productimgurl: 'https://res.cloudinary.com/dnagyxwcl/image/upload/v1746447470/cavienchien_vetkew.jpg',
                status: 'Available',
                sellingprice: 50000,
                rentalprice: null,
                costprice: 50000,
            },
            {
                productname: 'Nước uống revive',
                productimgurl:
                    'https://res.cloudinary.com/dnagyxwcl/image/upload/v1746448342/nuoc-ngot-revive-vi-muoi_rr9iv6.jpg',
                status: 'Available',
                sellingprice: 15000,
                rentalprice: null,
                costprice: 15000,
            },
            {
                productname: 'Nước uống pocari',
                productimgurl:
                    'https://res.cloudinary.com/dnagyxwcl/image/upload/v1746448376/00015165_pocari_sweet_500ml_6751_5d15_large_88460a0edd_ec9nat.webp',
                status: 'Available',
                sellingprice: 15000,
                rentalprice: null,
                costprice: 15000,
            },
            {
                productname: 'Bánh snack OSea',
                productimgurl:
                    'https://res.cloudinary.com/dnagyxwcl/image/upload/v1746448378/orion-post-new-24_lzha5b.png',
                status: 'Available',
                sellingprice: 100000,
                rentalprice: null,
                costprice: 100000,
            },
            {
                productname: 'Bánh snack bí đỏ',
                productimgurl:
                    'https://res.cloudinary.com/dnagyxwcl/image/upload/v1746448375/snack-bi-do-vi-bo-nuong_oh4ezm.jpg',
                status: 'Available',
                sellingprice: 100000,
                rentalprice: null,
                costprice: 100000,
            },
            {
                productname: 'Giày cầu lông Yonex 88 Dial Trắng - S41',
                productimgurl:
                    'https://res.cloudinary.com/dnagyxwcl/image/upload/v1747185361/Products/prt6j6d0hmp9aohg5m1x.webp',
                status: 'Available',
                sellingprice: null,
                rentalprice: 50000,
                costprice: 40000,
            },
            {
                productname: 'Giày cầu lông Yonex 88 Dial Trắng - S42',
                productimgurl:
                    'https://res.cloudinary.com/dnagyxwcl/image/upload/v1747185361/Products/prt6j6d0hmp9aohg5m1x.webp',
                status: 'Available',
                sellingprice: null,
                rentalprice: 50000,
                costprice: 40000,
            },
            {
                productname: 'Giày cầu lông Yonex Comfort Z3 Trắng - S41',
                productimgurl:
                    'https://res.cloudinary.com/dnagyxwcl/image/upload/v1747185363/Products/ckyxoe5p0meazsnusob6.webp',
                status: 'Available',
                sellingprice: null,
                rentalprice: 50000,
                costprice: 40000,
            },
            {
                productname: 'Giày cầu lông Yonex Comfort Z3 Đen - S42',
                productimgurl:
                    'https://res.cloudinary.com/dnagyxwcl/image/upload/v1747185361/Products/txovkmniwx1ne3kgps4t.webp',
                status: 'Available',
                sellingprice: null,
                rentalprice: 50000,
                costprice: 40000,
            },
            {
                productname: 'Giày cầu lông Mizuno Wave Claw 3 Trắng Đen Đỏ - S43',
                productimgurl:
                    'https://res.cloudinary.com/dnagyxwcl/image/upload/v1747185370/Products/o4urkqmscj8yuwqflaxb.webp',
                status: 'Available',
                sellingprice: null,
                rentalprice: 50000,
                costprice: 40000,
            },
            {
                productname: 'Giày cầu lông Mizuno Blade Z Trắng Đen - S42',
                productimgurl:
                    'https://res.cloudinary.com/dnagyxwcl/image/upload/v1747185368/Products/co1chmyu83mbqexeuvxy.webp',
                status: 'Available',
                sellingprice: null,
                rentalprice: 50000,
                costprice: 40000,
            },
            {
                productname: 'Giày cầu lông Mizuno Blade Z Trắng Đen - S43',
                productimgurl:
                    'https://res.cloudinary.com/dnagyxwcl/image/upload/v1747185368/Products/co1chmyu83mbqexeuvxy.webp',
                status: 'Available',
                sellingprice: null,
                rentalprice: 50000,
                costprice: 40000,
            },
            {
                productname: 'Vợt cầu lông Yonex Arcsaber 11 Play - 4U (80-84g)',
                productimgurl:
                    'https://res.cloudinary.com/dnagyxwcl/image/upload/v1747186471/Products/ho0w2hlxyepm0higwmo0.webp',
                status: 'Available',
                sellingprice: null,
                rentalprice: 50000,
                costprice: 40000,
            },
            {
                productname: 'Vợt cầu lông Yonex Arcsaber 88 Play 2024 - 4U (80-84g)',
                productimgurl:
                    'https://res.cloudinary.com/dnagyxwcl/image/upload/v1747186471/Products/nwnqx8dnkyh9fmiaqkbq.webp',
                status: 'Available',
                sellingprice: null,
                rentalprice: 50000,
                costprice: 40000,
            },
            {
                productname: 'Vợt cầu lông Yonex Nanoflare StarBucks Xanh - 3U (85-89g)',
                productimgurl:
                    'https://res.cloudinary.com/dnagyxwcl/image/upload/v1747186471/Products/djkikwpw1dhwqa7wjdeo.webp',
                status: 'Available',
                sellingprice: null,
                rentalprice: 50000,
                costprice: 40000,
            },
            {
                productname: 'Vợt cầu lông Lining Axforce 10 Trắng - 3U (85-89g)',
                productimgurl:
                    'https://res.cloudinary.com/dnagyxwcl/image/upload/v1747186470/Products/rswfqf6psadj1yjinouo.webp',
                status: 'Available',
                sellingprice: null,
                rentalprice: 50000,
                costprice: 40000,
            },
            {
                productname: 'Vợt cầu lông Lining Axforce 10 Trắng - 4U (80-84g)',
                productimgurl:
                    'https://res.cloudinary.com/dnagyxwcl/image/upload/v1747186470/Products/rswfqf6psadj1yjinouo.webp',
                status: 'Available',
                sellingprice: null,
                rentalprice: 50000,
                costprice: 40000,
            },
            {
                productname: 'Vợt cầu lông Lining Axforce 10 Trắng - 5U (75-79g)',
                productimgurl:
                    'https://res.cloudinary.com/dnagyxwcl/image/upload/v1747186470/Products/rswfqf6psadj1yjinouo.webp',
                status: 'Available',
                sellingprice: null,
                rentalprice: 50000,
                costprice: 40000,
            },
            {
                productname: 'Vợt cầu lông Lining Axforce 10 Xanh Đen - 3U (85-89g)',
                productimgurl:
                    'https://res.cloudinary.com/dnagyxwcl/image/upload/v1747186471/Products/rohiwtcz9zwua4u0fgot.webp',
                status: 'Available',
                sellingprice: null,
                rentalprice: 50000,
                costprice: 40000,
            },
            {
                productname: 'Vợt cầu lông Lining Axforce 10 Xanh Đen - 4U (80-84g)',
                productimgurl:
                    'https://res.cloudinary.com/dnagyxwcl/image/upload/v1747186471/Products/rohiwtcz9zwua4u0fgot.webp',
                status: 'Available',
                sellingprice: null,
                rentalprice: 50000,
                costprice: 40000,
            },
            {
                productname: 'Vợt cầu lông Lining Axforce 10 Xanh Đen - 5U (75-79g)',
                productimgurl:
                    'https://res.cloudinary.com/dnagyxwcl/image/upload/v1747186471/Products/rohiwtcz9zwua4u0fgot.webp',
                status: 'Available',
                sellingprice: null,
                rentalprice: 50000,
                costprice: 40000,
            },
        ],
    });

    await prisma.suppliers.createMany({
        data: [
            {
                suppliername: 'Đại Hưng Sport',
                contactname: 'Trung Nguyễn',
                phonenumber: '123-456-7890',
                email: 'trungnuyen_daihungsport@gmai.com',
                address: '432 Lý Thái Tổ, Phường 10, Quận 10, TP. Hồ Chí Minh, Việt Nam',
            },
            {
                suppliername: 'Tuấn Hạnh Sport',
                contactname: 'Hạnh Nguyễn',
                phonenumber: '987-654-3210',
                email: 'tuanhanh_tuanhanhsport@gmail.com',
                address: '43B Lê Hồng Phong, Ba Đình, Hà Nội',
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

    const parttimeEmployeeIds = (
        await prisma.employees.findMany({
            select: {
                employeeid: true,
            },
            where: {
                employee_type: 'Part-time',
            },
        })
    ).map((employee) => employee.employeeid);

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

    // parttimeEmployeeIds.forEach(async (employeeId) => {
    //     const randomShiftDate = shiftdates[Math.floor(Math.random() * shiftdates.length)];
    //     await prisma.shift_assignment.create({
    //         data: {
    //             employeeid: employeeId,
    //             shiftid: randomShiftDate.shiftid,
    //             shiftdate: randomShiftDate.shiftdate,
    //         },
    //     });
    // });

    await prisma.bookings.createMany({
        data: [
            {
                guestphone: '0987654321',
                bookingdate: new Date('2025-05-15'),
                totalprice: 400000.0,
                bookingstatus: 'Schedule',
                createdat: new Date('2025-05-14T09:22:19.422Z'),
                updatedat: new Date('2025-05-14T09:22:19.422Z'),
                employeeid: 3,
                customerid: 16,
                voucherid: null,
            },
            {
                guestphone: '0987654321',
                bookingdate: new Date('2025-05-15'),
                totalprice: 300000.0,
                bookingstatus: 'Schedule',
                createdat: new Date('2025-05-14T10:00:00.000Z'),
                updatedat: new Date('2025-05-14T10:00:00.000Z'),
                employeeid: 2,
                customerid: 16,
                voucherid: null,
            },
            {
                guestphone: '0987654321',
                bookingdate: new Date('2025-05-16'),
                totalprice: 500000.0,
                bookingstatus: 'Schedule',
                createdat: new Date('2025-05-14T11:00:00.000Z'),
                updatedat: new Date('2025-05-14T11:00:00.000Z'),
                employeeid: 1,
                customerid: 16,
                voucherid: null,
            },
        ],
    });

    // Lấy tất cả các bookingid từ bảng bookings
    const bookings = await prisma.bookings.findMany({
        select: { bookingid: true },
    });

    // Tạo court_booking với các bookingid vừa lấy
    await prisma.court_booking.createMany({
        data: [
            // Trường hợp 2: Một số khung giờ bị block hoàn toàn
            {
                date: new Date('2025-05-15'),
                starttime: new Date('2025-05-15 06:00:00'),
                endtime: new Date('2025-05-15 07:00:00'),
                duration: 1,
                bookingid: bookings[0].bookingid,
                courtid: 1,
            },
            {
                date: new Date('2025-05-15'),
                starttime: new Date('2025-05-15 06:00:00'),
                endtime: new Date('2025-05-15 07:30:00'),
                duration: 1.5,
                bookingid: bookings[0].bookingid,
                courtid: 2,
            },
            {
                date: new Date('2025-05-15'),
                starttime: new Date('2025-05-15 06:00:00'),
                endtime: new Date('2025-05-15 08:00:00'),
                duration: 2,
                bookingid: bookings[0].bookingid,
                courtid: 3,
            },
            {
                date: new Date('2025-05-15'),
                starttime: new Date('2025-05-15 06:00:00'),
                endtime: new Date('2025-05-15 08:30:00'),
                duration: 2.5,
                bookingid: bookings[0].bookingid,
                courtid: 4,
            },
            {
                date: new Date('2025-05-15'),
                starttime: new Date('2025-05-15 06:00:00'),
                endtime: new Date('2025-05-15 09:00:00'),
                duration: 3,
                bookingid: bookings[0].bookingid,
                courtid: 5,
            },
            {
                date: new Date('2025-05-15'),
                starttime: new Date('2025-05-15 06:00:00'),
                endtime: new Date('2025-05-15 09:30:00'),
                duration: 3.5,
                bookingid: bookings[0].bookingid,
                courtid: 6,
            },
            {
                date: new Date('2025-05-15'),
                starttime: new Date('2025-05-15 06:00:00'),
                endtime: new Date('2025-05-15 10:00:00'),
                duration: 4,
                bookingid: bookings[0].bookingid,
                courtid: 7,
            },
            {
                date: new Date('2025-05-15'),
                starttime: new Date('2025-05-15 06:00:00'),
                endtime: new Date('2025-05-15 11:00:00'),
                duration: 5,
                bookingid: bookings[0].bookingid,
                courtid: 8,
            },

            // Trường hợp 3: Một số khung giờ bị block một phần
            {
                date: new Date('2025-05-15'),
                starttime: new Date('2025-05-15 13:30:00'),
                endtime: new Date('2025-05-15 15:30:00'),
                duration: 2,
                bookingid: bookings[1].bookingid,
                courtid: 1,
            },
            {
                date: new Date('2025-05-15'),
                starttime: new Date('2025-05-15 13:30:00'),
                endtime: new Date('2025-05-15 15:30:00'),
                duration: 2,
                bookingid: bookings[1].bookingid,
                courtid: 2,
            },

            // Trường hợp 4: Khung giờ không liên quan đến ngày được kiểm tra
            {
                date: new Date('2025-05-16'),
                starttime: new Date('2025-05-16 06:00:00'),
                endtime: new Date('2025-05-16 07:00:00'),
                duration: 1,
                bookingid: bookings[2].bookingid,
                courtid: 1,
            },
        ],
    });

    await prisma.product_types.createMany({
        data: [
            {
                producttypename: 'Đồ ăn - Thức uống',
            },
            {
                producttypename: 'Phụ kiện cầu lông',
            },
            {
                producttypename: 'Thuê vợt',
            },
            {
                producttypename: 'Thuê giày',
            },
        ],
    });

    await prisma.product_filter.createMany({
        data: [
            {
                productfiltername: 'Loại đồ ăn - thức uống',
                producttypeid: 1,
            },
            {
                productfiltername: 'Loại phụ kiện',
                producttypeid: 2,
            },
            {
                productfiltername: 'Trọng lượng',
                producttypeid: 3,
            },
            {
                productfiltername: 'Size',
                producttypeid: 4,
            },
        ],
    });

    await prisma.product_filter_values.createMany({
        data: [
            {
                productfilterid: 1,
                value: 'Đồ mặn',
            },
            {
                productfilterid: 1,
                value: 'Snack',
            },
            {
                productfilterid: 1,
                value: 'Đồ uống',
            },
            {
                productfilterid: 2,
                value: 'Ống cầu lông',
            },
            {
                productfilterid: 2,
                value: 'Quấn cán cầu lông',
            },
            {
                productfilterid: 2,
                value: 'Túi đựng giày cầu lông',
            },
            {
                productfilterid: 2,
                value: 'Vớ cầu lông',
            },
            {
                productfilterid: 2,
                value: 'Cước đan vợt',
            },
            {
                productfilterid: 3,
                value: '3U (85-89g)',
            },
            {
                productfilterid: 3,
                value: '4U (80-84g)',
            },
            {
                productfilterid: 3,
                value: '5U (75-79g)',
            },
            {
                productfilterid: 4,
                value: '40',
            },
            {
                productfilterid: 4,
                value: '41',
            },
            {
                productfilterid: 4,
                value: '42',
            },
            {
                productfilterid: 4,
                value: '43',
            },
            {
                productfilterid: 4,
                value: '44',
            },
        ],
    });

    await prisma.product_attributes.createMany({
        data: [
            {
                productid: 1,
                productfiltervalueid: 5,
            },
            {
                productid: 2,
                productfiltervalueid: 6,
            },
            {
                productid: 3,
                productfiltervalueid: 7,
            },
            {
                productid: 4,
                productfiltervalueid: 4,
            },
            {
                productid: 5,
                productfiltervalueid: 4,
            },
            {
                productid: 6,
                productfiltervalueid: 8,
            },
            {
                productid: 7,
                productfiltervalueid: 3,
            },
            {
                productid: 8,
                productfiltervalueid: 2,
            },
            {
                productid: 9,
                productfiltervalueid: 1,
            },
            {
                productid: 10,
                productfiltervalueid: 3,
            },
            {
                productid: 11,
                productfiltervalueid: 3,
            },
            {
                productid: 12,
                productfiltervalueid: 2,
            },
            {
                productid: 13,
                productfiltervalueid: 2,
            },
            {
                productid: 14,
                productfiltervalueid: 13,
            },
            {
                productid: 15,
                productfiltervalueid: 14,
            },
            {
                productid: 16,
                productfiltervalueid: 13,
            },
            {
                productid: 17,
                productfiltervalueid: 14,
            },
            {
                productid: 18,
                productfiltervalueid: 15,
            },
            {
                productid: 19,
                productfiltervalueid: 14,
            },
            {
                productid: 20,
                productfiltervalueid: 15,
            },
            {
                productid: 21,
                productfiltervalueid: 10,
            },
            {
                productid: 22,
                productfiltervalueid: 10,
            },
            {
                productid: 23,
                productfiltervalueid: 9,
            },
            {
                productid: 24,
                productfiltervalueid: 9,
            },
            {
                productid: 25,
                productfiltervalueid: 10,
            },
            {
                productid: 26,
                productfiltervalueid: 11,
            },
            {
                productid: 27,
                productfiltervalueid: 9,
            },
            {
                productid: 28,
                productfiltervalueid: 10,
            },
            {
                productid: 29,
                productfiltervalueid: 11,
            },
        ],
    });

    await prisma.product_batch.createMany({
        data: [
            {
                batchname: 'Lô Quấn cán cầu lông Yonex AC147EX',
                stockquantity: 10,
                expirydate: new Date('2025-12-31'),
                status: 'Còn hạn',
            },
            {
                batchname: 'Lô Túi đựng giày cầu lông',
                stockquantity: 10,
                expirydate: new Date('2025-12-31'),
                status: 'Còn hạn',
            },
            {
                batchname: 'Lô Vớ cầu lông Yonex',
                stockquantity: 10,
                expirydate: new Date('2025-12-31'),
                status: 'Còn hạn',
            },
            {
                batchname: 'Lô Ống cầu lông Lining AYQN024',
                stockquantity: 10,
                expirydate: new Date('2025-12-31'),
                status: 'Còn hạn',
            },
            {
                batchname: 'Lô Ống cầu lông Yonex AS40',
                stockquantity: 10,
                expirydate: new Date('2025-12-31'),
                status: 'Còn hạn',
            },
            {
                batchname: 'Lô Cước Yonex pro',
                stockquantity: 10,
                expirydate: new Date('2025-12-31'),
                status: 'Còn hạn',
            },
            {
                batchname: 'Lô Nước uống tăng lực Monster bạc',
                stockquantity: 10,
                expirydate: new Date('2025-12-31'),
                status: 'Còn hạn',
            },
            {
                batchname: 'Lô Thanh protein block chocolate',
                stockquantity: 10,
                expirydate: new Date('2025-12-31'),
                status: 'Còn hạn',
            },
            {
                batchname: 'Lô Cá viên chiên xiên bẩn',
                stockquantity: 10,
                expirydate: new Date('2025-12-31'),
                status: 'Còn hạn',
            },
            {
                batchname: 'Lô Nước uống revive',
                stockquantity: 10,
                expirydate: new Date('2025-12-31'),
                status: 'Còn hạn',
            },
            {
                batchname: 'Lô Nước uống pocari',
                stockquantity: 10,
                expirydate: new Date('2025-12-31'),
                status: 'Còn hạn',
            },
            {
                batchname: 'Lô Bánh snack OSea',
                stockquantity: 10,
                expirydate: new Date('2025-12-31'),
                status: 'Còn hạn',
            },
            {
                batchname: 'Lô Bánh snack bí đỏ',
                stockquantity: 10,
                expirydate: new Date('2025-12-31'),
                status: 'Còn hạn',
            },
            {
                batchname: 'Lô Giày cầu lông Yonex 88 Dial Trắng - S41',
                stockquantity: 5,
                expirydate: new Date('2026-12-31'),
                status: 'Còn hạn',
            },
            {
                batchname: 'Lô Giày cầu lông Yonex 88 Dial Trắng - S42',
                stockquantity: 5,
                expirydate: new Date('2026-12-31'),
                status: 'Còn hạn',
            },
            {
                batchname: 'Lô Giày cầu lông Yonex Comfort Z3 Trắng - S41',
                stockquantity: 5,
                expirydate: new Date('2026-12-31'),
                status: 'Còn hạn',
            },
            {
                batchname: 'Lô Giày cầu lông Yonex Comfort Z3 Đen - S42',
                stockquantity: 5,
                expirydate: new Date('2026-12-31'),
                status: 'Còn hạn',
            },
            {
                batchname: 'Lô Giày cầu lông Mizuno Wave Claw 3 Trắng Đen Đỏ - S43',
                stockquantity: 5,
                expirydate: new Date('2026-12-31'),
                status: 'Còn hạn',
            },
            {
                batchname: 'Lô Giày cầu lông Mizuno Blade Z Trắng Đen - S42',
                stockquantity: 5,
                expirydate: new Date('2026-12-31'),
                status: 'Còn hạn',
            },
            {
                batchname: 'Lô Giày cầu lông Mizuno Blade Z Trắng Đen - S43',
                stockquantity: 5,
                expirydate: new Date('2026-12-31'),
                status: 'Còn hạn',
            },
            {
                batchname: 'Lô Vợt cầu lông Yonex Arcsaber 11 Play - 4U (80-84g)',
                stockquantity: 5,
                expirydate: new Date('2026-12-31'),
                status: 'Còn hạn',
            },
            {
                batchname: 'Lô Vợt cầu lông Yonex Arcsaber 88 Play 2024 - 4U (80-84g)',
                stockquantity: 5,
                expirydate: new Date('2026-12-31'),
                status: 'Còn hạn',
            },
            {
                batchname: 'Lô Vợt cầu lông Yonex Nanoflare StarBucks Xanh - 3U (85-89g)',
                stockquantity: 5,
                expirydate: new Date('2026-12-31'),
                status: 'Còn hạn',
            },
            {
                batchname: 'Lô Vợt cầu lông Lining Axforce 10 Trắng - 3U (85-89g)',
                stockquantity: 5,
                expirydate: new Date('2026-12-31'),
                status: 'Còn hạn',
            },
            {
                batchname: 'Lô Vợt cầu lông Lining Axforce 10 Trắng - 4U (80-84g)',
                stockquantity: 5,
                expirydate: new Date('2026-12-31'),
                status: 'Còn hạn',
            },
            {
                batchname: 'Lô Vợt cầu lông Lining Axforce 10 Trắng - 5U (75-79g)',
                stockquantity: 5,
                expirydate: new Date('2026-12-31'),
                status: 'Còn hạn',
            },
            {
                batchname: 'Lô Vợt cầu lông Lining Axforce 10 Xanh Đen - 3U (85-89g)',
                stockquantity: 5,
                expirydate: new Date('2026-12-31'),
                status: 'Còn hạn',
            },
            {
                batchname: 'Lô Vợt cầu lông Lining Axforce 10 Xanh Đen - 4U (80-84g)',
                stockquantity: 5,
                expirydate: new Date('2026-12-31'),
                status: 'Còn hạn',
            },
            {
                batchname: 'Lô Vợt cầu lông Lining Axforce 10 Xanh Đen - 5U (75-79g)',
                stockquantity: 5,
                expirydate: new Date('2026-12-31'),
                status: 'Còn hạn',
            },
        ],
    });

    // Insert Orders data
    await prisma.orders.createMany({
        data: [
            {
                ordertype: 'Bán hàng',
                orderdate: new Date('2024-01-15T10:30:00Z'),
                totalprice: 450000,
                status: 'Hoàn thành',
                customerid: 15, // Customer account from seed
            },
            {
                ordertype: 'Cho thuê',
                orderdate: new Date('2024-01-16T14:15:00Z'),
                totalprice: 120000,
                status: 'Đang xử lý',
                customerid: 15,
            },
            {
                ordertype: 'Bán hàng',
                orderdate: new Date('2024-01-17T09:45:00Z'),
                totalprice: 800000,
                status: 'Hoàn thành',
                customerid: 15,
            },
            {
                ordertype: 'Cho thuê',
                orderdate: new Date('2024-01-18T16:20:00Z'),
                totalprice: 200000,
                status: 'Hoàn thành',
                customerid: 15,
            },
            {
                ordertype: 'Bán hàng',
                orderdate: new Date('2024-01-19T11:00:00Z'),
                totalprice: 1200000,
                status: 'Đang xử lý',
                customerid: 15,
            },
        ],
    });

    // Insert Order Product data
    await prisma.order_product.createMany({
        data: [
            // Order 1 - Bán hàng (Nước uống + Bánh snack)
            {
                orderid: 1,
                productid: 1, // Nước uống aquafina
                quantity: 3,
            },
            {
                orderid: 1,
                productid: 2, // Nước uống coca
                quantity: 2,
            },
            {
                orderid: 1,
                productid: 7, // Bánh snack OSea
                quantity: 5,
            },

            // Order 2 - Cho thuê (Vợt cầu lông)
            {
                orderid: 2,
                productid: 23, // Vợt cầu lông Yonex Arcsaber 11 Play
                quantity: 2,
                returndate: new Date('2025-09-17'),
            },

            // Order 3 - Bán hàng (Giày cầu lông)
            {
                orderid: 3,
                productid: 15, // Giày cầu lông Yonex 88 Dial Trắng - S41
                quantity: 1,
                returndate: new Date('2025-09-17'),
            },
            {
                orderid: 3,
                productid: 17, // Giày cầu lông Yonex Comfort Z3 Trắng - S41
                quantity: 1,
                returndate: new Date('2025-09-17'),
            },

            // Order 4 - Cho thuê (Vợt + Giày)
            {
                orderid: 4,
                productid: 24, // Vợt cầu lông Yonex Arcsaber 88 Play 2024
                quantity: 1,
                returndate: new Date('2025-09-19'),
            },
            {
                orderid: 4,
                productid: 16, // Giày cầu lông Yonex 88 Dial Trắng - S42
                quantity: 1,
                returndate: new Date('2025-09-19'),
            },

            // Order 5 - Bán hàng (Vợt cao cấp)
            {
                orderid: 5,
                productid: 25, // Vợt cầu lông Yonex Nanoflare StarBucks Xanh
                quantity: 1,
                returndate: new Date('2025-09-19'),
            },
            {
                orderid: 5,
                productid: 26, // Vợt cầu lông Lining Axforce 10 Trắng - 3U
                quantity: 1,
                returndate: new Date('2025-09-19'),
            },
        ],
    });

    await prisma.purchase_order.createMany({
        data: [
            {
                productid: 1,
                quantity: 10,
                employeeid: 3,
                supplierid: 1,
                batchid: 1,
            },
            {
                productid: 2,
                quantity: 10,
                employeeid: 3,
                supplierid: 1,
                batchid: 2,
            },
            {
                productid: 3,
                quantity: 10,
                employeeid: 3,
                supplierid: 1,
                batchid: 3,
            },
            {
                productid: 4,
                quantity: 10,
                employeeid: 3,
                supplierid: 1,
                batchid: 4,
            },
            {
                productid: 5,
                quantity: 10,
                employeeid: 3,
                supplierid: 1,
                batchid: 5,
            },
            {
                productid: 6,
                quantity: 10,
                employeeid: 3,
                supplierid: 1,
                batchid: 6,
            },
            {
                productid: 7,
                quantity: 10,
                employeeid: 3,
                supplierid: 1,
                batchid: 7,
            },
            {
                productid: 8,
                quantity: 10,
                employeeid: 3,
                supplierid: 1,
                batchid: 8,
            },
            {
                productid: 9,
                quantity: 10,
                employeeid: 3,
                supplierid: 1,
                batchid: 9,
            },
            {
                productid: 10,
                quantity: 10,
                employeeid: 3,
                supplierid: 1,
                batchid: 10,
            },
            {
                productid: 11,
                quantity: 10,
                employeeid: 3,
                supplierid: 1,
                batchid: 11,
            },
            {
                productid: 12,
                quantity: 10,
                employeeid: 3,
                supplierid: 1,
                batchid: 12,
            },
            {
                productid: 13,
                quantity: 10,
                employeeid: 3,
                supplierid: 1,
                batchid: 13,
            },
            {
                productid: 14,
                quantity: 10,
                employeeid: 3,
                supplierid: 1,
                batchid: 14,
            },
            {
                productid: 15,
                quantity: 10,
                employeeid: 3,
                supplierid: 1,
                batchid: 15,
            },
            {
                productid: 16,
                quantity: 10,
                employeeid: 3,
                supplierid: 1,
                batchid: 16,
            },
            {
                productid: 17,
                quantity: 10,
                employeeid: 3,
                supplierid: 1,
                batchid: 17,
            },
            {
                productid: 18,
                quantity: 10,
                employeeid: 3,
                supplierid: 1,
                batchid: 18,
            },
            {
                productid: 19,
                quantity: 10,
                employeeid: 3,
                supplierid: 1,
                batchid: 19,
            },
            {
                productid: 20,
                quantity: 10,
                employeeid: 3,
                supplierid: 1,
                batchid: 20,
            },
            {
                productid: 21,
                quantity: 10,
                employeeid: 3,
                supplierid: 1,
                batchid: 21,
            },
            {
                productid: 22,
                quantity: 10,
                employeeid: 3,
                supplierid: 1,
                batchid: 22,
            },
            {
                productid: 23,
                quantity: 10,
                employeeid: 3,
                supplierid: 1,
                batchid: 23,
            },
            {
                productid: 24,
                quantity: 10,
                employeeid: 3,
                supplierid: 1,
                batchid: 24,
            },
            {
                productid: 25,
                quantity: 10,
                employeeid: 3,
                supplierid: 1,
                batchid: 25,
            },
            {
                productid: 26,
                quantity: 10,
                employeeid: 3,
                supplierid: 1,
                batchid: 26,
            },
            {
                productid: 27,
                quantity: 10,
                employeeid: 3,
                supplierid: 1,
                batchid: 27,
            },
            {
                productid: 28,
                quantity: 10,
                employeeid: 3,
                supplierid: 1,
                batchid: 28,
            },
            {
                productid: 29,
                quantity: 10,
                employeeid: 3,
                supplierid: 1,
                batchid: 29,
            },
        ],
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
