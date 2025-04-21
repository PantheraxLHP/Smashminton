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
                bookingdate: new Date('2025-05-15'),
                totalprice: 400000.0,
                bookingstatus: 'confirmed',
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
                bookingstatus: 'confirmed',
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
                bookingstatus: 'confirmed',
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
            { date: new Date('2025-05-15'), starttime: new Date('2025-05-15 06:00:00'), endtime: new Date('2025-05-15 07:00:00'), duration: 1, bookingid: bookings[0].bookingid, courtid: 1 },
            { date: new Date('2025-05-15'), starttime: new Date('2025-05-15 06:00:00'), endtime: new Date('2025-05-15 07:30:00'), duration: 1.5, bookingid: bookings[0].bookingid, courtid: 2 },
            { date: new Date('2025-05-15'), starttime: new Date('2025-05-15 06:00:00'), endtime: new Date('2025-05-15 08:00:00'), duration: 2, bookingid: bookings[0].bookingid, courtid: 3 },
            { date: new Date('2025-05-15'), starttime: new Date('2025-05-15 06:00:00'), endtime: new Date('2025-05-15 08:30:00'), duration: 2.5, bookingid: bookings[0].bookingid, courtid: 4 },
            { date: new Date('2025-05-15'), starttime: new Date('2025-05-15 06:00:00'), endtime: new Date('2025-05-15 09:00:00'), duration: 3, bookingid: bookings[0].bookingid, courtid: 5 },
            { date: new Date('2025-05-15'), starttime: new Date('2025-05-15 06:00:00'), endtime: new Date('2025-05-15 09:30:00'), duration: 3.5, bookingid: bookings[0].bookingid, courtid: 6 },
            { date: new Date('2025-05-15'), starttime: new Date('2025-05-15 06:00:00'), endtime: new Date('2025-05-15 10:00:00'), duration: 4, bookingid: bookings[0].bookingid, courtid: 7 },
            { date: new Date('2025-05-15'), starttime: new Date('2025-05-15 06:00:00'), endtime: new Date('2025-05-15 11:00:00'), duration: 5, bookingid: bookings[0].bookingid, courtid: 8 },

            // Trường hợp 3: Một số khung giờ bị block một phần
            { date: new Date('2025-05-15'), starttime: new Date('2025-05-15 13:30:00'), endtime: new Date('2025-05-15 15:30:00'), duration: 2, bookingid: bookings[1].bookingid, courtid: 1 },
            { date: new Date('2025-05-15'), starttime: new Date('2025-05-15 13:30:00'), endtime: new Date('2025-05-15 15:30:00'), duration: 2, bookingid: bookings[1].bookingid, courtid: 2 },

            // Trường hợp 4: Khung giờ không liên quan đến ngày được kiểm tra
            { date: new Date('2025-05-16'), starttime: new Date('2025-05-16 06:00:00'), endtime: new Date('2025-05-16 07:00:00'), duration: 1, bookingid: bookings[2].bookingid, courtid: 1 },
        ],
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