import { PrismaClient } from '@prisma/generated/client';
//npx tsx prisma/bookings_seed.ts
const prisma = new PrismaClient();

async function main() {
    async function deleteAllData(tableList: string[]) {
        for (const tableName of tableList) {
            console.log('Truncating all data from ' + tableName);
            await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tableName} RESTART IDENTITY CASCADE;`);
        }
    }

    const tableList = ['court_booking', 'bookings'];
    await deleteAllData(tableList);

    // Tạo bookings trước
    const createdBookings = await prisma.bookings.createMany({
        data: [
            {
                guestphone: '0987654321',
                bookingdate: new Date('2025-04-15T08:00:00+07:00'),
                totalprice: 400000.0,
                bookingstatus: 'confirmed',
                createdat: new Date('2025-04-14T09:22:19.422Z'),
                updatedat: new Date('2025-04-14T09:22:19.422Z'),
                employeeid: 3,
                customerid: 16,
                voucherid: null,
            },
            {
                guestphone: '0987654321',
                bookingdate: new Date('2025-04-16T17:00:00+07:00'),
                totalprice: 300000.0,
                bookingstatus: 'confirmed',
                createdat: new Date('2025-04-14T10:00:00.000Z'),
                updatedat: new Date('2025-04-14T10:00:00.000Z'),
                employeeid: 2,
                customerid: 16,
                voucherid: null,
            },
            {
                guestphone: '0987654321',
                bookingdate: new Date('2025-04-17T06:30:00+07:00'),
                totalprice: 500000.0,
                bookingstatus: 'pending',
                createdat: new Date('2025-04-14T11:00:00.000Z'),
                updatedat: new Date('2025-04-14T11:00:00.000Z'),
                employeeid: 1,
                customerid: 16,
                voucherid: null,
            },
            {
                guestphone: '0987654321',
                bookingdate: new Date('2025-04-18T14:00:00+07:00'),
                totalprice: 600000.0,
                bookingstatus: 'cancelled',
                createdat: new Date('2025-04-14T12:00:00.000Z'),
                updatedat: new Date('2025-04-14T12:00:00.000Z'),
                employeeid: 4,
                customerid: 16,
                voucherid: null,
            },
            {
                guestphone: '0987654321',
                bookingdate: new Date('2025-04-19T19:00:00+07:00'),
                totalprice: 450000.0,
                bookingstatus: 'confirmed',
                createdat: new Date('2025-04-14T13:00:00.000Z'),
                updatedat: new Date('2025-04-14T13:00:00.000Z'),
                employeeid: 5,
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
        data: bookings.map((booking, index) => ({
            date: new Date(`2025-05-${15 + index}T00:00:00+07:00`),
            starttime: new Date(`2025-05-${15 + index}T08:00:00+07:00`),
            endtime: new Date(`2025-05-${15 + index}T09:30:00+07:00`),
            duration: 1.5,
            bookingid: booking.bookingid, // Gán bookingid từ bảng bookings
            courtid: index + 1, // Gán courtid giả định
        })),
    });

    console.log('🌱 Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });