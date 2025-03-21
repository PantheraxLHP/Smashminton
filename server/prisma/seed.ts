/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    async function deleteAllData(tableList: string[]) {
        for (const tableName of tableList) {
            console.log('Truncating all data from ' + tableName);
            await prisma.$executeRawUnsafe(
                `TRUNCATE TABLE ${tableName} RESTART IDENTITY CASCADE;`,
            );
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
    const accounts = await prisma.accounts.createMany({
        data: [
            {
                username: 'admin',
                password: '123',
                status: 'Active',
                fullname: 'Admin',
                email: 'admin@example.com',
                accounttype: 'Employee',
                createdat: new Date(),
                updatedat: new Date(),
            },
            {
                username: 'nguyenvana',
                password: '123',
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
                password: '123',
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
                password: '123',
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
                password: '123',
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
                password: '123',
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
                password: '123',
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
                password: '123',
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
                password: '123',
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
                password: '123',
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
                password: '123',
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
                password: '123',
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
                password: '123',
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
                password: '123',
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
                password: '123',
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
                password: '123',
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
                password: '123',
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

    const accountIds = (
        await prisma.accounts.findMany({
            select: {
                accountid: true,
            },
        })
    ).map((accounts) => accounts.accountid);

    for (let i = 0; i < accountIds.length; i++) {
        if (i <= 3) {
            await prisma.employees.create({
                data: {
                    employeeid: accountIds[i],
                    employee_type: 'Full-time',
                },
            });
        } else if (i < accountIds.length - 3) {
            await prisma.employees.create({
                data: {
                    employeeid: accountIds[i],
                    employee_type: 'Part-time',
                },
            });
        } else {
            await prisma.customers.create({
                data: {
                    customerid: accountIds[i],
                    totalpurchase: 1000000,
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
                rewarddescription:
                    'Thưởng cho các ngày lễ, tết, sinh nhật của nhân viên',
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
                penaltydescription:
                    'Phạt nhân viên vắng mặt không phép, bỏ ca làm việc',
                basepenalty: 50000,
                incrementalpenalty: 50000,
                maxiumpenalty: 300000,
                disciplineaction: 'Terminate',
            },
            {
                penaltyname: 'Failure to comply with workplace policies',
                penaltydescription:
                    'Phạt nhân viên vi phạm chính sách/quy định nơi làm việc',
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
                rulename: 'Max Full-time Shifts Per Week',
                ruledescription:
                    'Mỗi nhân viên toàn thời gian phải làm đủ 6 ca full time (48 tiếng 1 tuần)',
                rulefor: 'Full-time',
                rulevalue: 6,
                rulestatus: 'Active',
                managerid: 1,
                createdat: new Date(),
                updatedat: new Date(),
            },
            {
                rulename: 'Max Full-time Employees Per Shift',
                ruledescription: 'Mỗi ca toàn thời gian tối đa 1 nhân viên',
                rulefor: 'Full-time',
                rulevalue: 1,
                rulestatus: 'Active',
                managerid: 1,
                createdat: new Date(),
                updatedat: new Date(),
            },
            {
                rulename: 'Max Part-time Shifts Per Week',
                ruledescription:
                    'Mỗi nhân viên bán thời gian được làm tối đa 12 ca part time (48 tiếng 1 tuần)',
                rulefor: 'Part-time',
                rulevalue: 12,
                rulestatus: 'Active',
                managerid: 1,
                createdat: new Date(),
                updatedat: new Date(),
            },
            {
                rulename: 'Max Part-time Employees Per Shift',
                ruledescription: 'Mỗi ca bán thời gian tối đa 2 nhân viên',
                rulefor: 'Part-time',
                rulevalue: 2,
                rulestatus: 'Active',
                managerid: 1,
                createdat: new Date(),
                updatedat: new Date(),
            },
            {
                rulename: 'Max Part-time Shifts Per Day',
                ruledescription:
                    'Mỗi nhân viên bán thời gian được làm tối đa 2 ca part time mỗi ngày',
                rulefor: 'Part-time',
                rulevalue: 2,
                rulestatus: 'Active',
                managerid: 1,
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
            },
            {
                zonename: 'Zone B',
                zonetype: 'AirConditioner',
            },
            {
                zonename: 'Zone C',
                zonetype: 'Private',
            },
        ],
    });

    await prisma.zone_prices.createMany({
        data: [
            {
                dayfrom: 'Monday',
                dayto: 'Friday',
                starttime: '05:00:00',
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
                starttime: '05:00:00',
                endtime: '22:00:00',
                price: 140000,
                zoneid: 1,
            },
            {
                dayfrom: 'Monday',
                dayto: 'Friday',
                starttime: '05:00:00',
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
                starttime: '05:00:00',
                endtime: '22:00:00',
                price: 150000,
                zoneid: 2,
            },
            {
                dayfrom: 'Monday',
                dayto: 'Friday',
                starttime: '05:00:00',
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
                starttime: '05:00:00',
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

    const products = [
        {
            productname: 'Yonex Badminton Racket',
            producttype: 'Badminton Equipment',
            batch: 'B001',
            expirydate: null,
            status: 'Available',
            stockquantity: 30,
            sellingprice: 150.0,
            rentalprice: 20.0,
            costprice: 100.0,
        },
        {
            productname: 'Li-Ning Shuttlecock',
            producttype: 'Badminton Equipment',
            batch: 'B002',
            expirydate: null,
            status: 'Available',
            stockquantity: 100,
            sellingprice: 25.0,
            rentalprice: null,
            costprice: 15.0,
        },
        {
            productname: 'Badminton Net',
            producttype: 'Badminton Equipment',
            batch: 'B003',
            expirydate: null,
            status: 'Available',
            stockquantity: 10,
            sellingprice: 50.0,
            rentalprice: 10.0,
            costprice: 30.0,
        },
        {
            productname: 'Energy Drink',
            producttype: 'Snacks and Drinks',
            batch: 'D001',
            expirydate: new Date('2025-12-31'),
            status: 'Available',
            stockquantity: 200,
            sellingprice: 2.5,
            rentalprice: null,
            costprice: 1.5,
        },
        {
            productname: 'Protein Bar',
            producttype: 'Snacks and Drinks',
            batch: 'D002',
            expirydate: new Date('2024-06-30'),
            status: 'Available',
            stockquantity: 150,
            sellingprice: 3.0,
            rentalprice: null,
            costprice: 2.0,
        },
    ];

    for (const product of products) {
        const createdProduct = await prisma.products.create({
            data: product,
        });

        if (product.producttype === 'Badminton Equipment') {
            await prisma.product_descriptions.create({
                data: {
                    weight: product.productname.includes('Racket')
                        ? 85.0
                        : null,
                    size: product.productname.includes('Net')
                        ? 'Standard'
                        : null,
                    gripsize: product.productname.includes('Racket')
                        ? 'G4'
                        : null,
                    shaftstiffness: product.productname.includes('Racket')
                        ? 'Medium'
                        : null,
                    productid: createdProduct.productid,
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
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
