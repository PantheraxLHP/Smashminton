import { PrismaClient } from '@prisma/generated/client';
//npx tsx prisma/booking_orders_2019_2024.ts
const prisma = new PrismaClient();

// Type definitions
type CourtBooking = {
    date: Date;
    starttime: Date;
    endtime: Date;
    duration: number;
    bookingid: number;
    courtid: number;
};

type Booking = {
    bookingid: number;
    guestphone: string;
    bookingdate: Date;
    totalprice: number;
    bookingstatus: string;
    createdat: Date;
    updatedat: Date;
    employeeid: number | null;
    customerid: number | null;
    voucherid: null;
};

type Order = {
    orderid: number;
    ordertype: string;
    orderdate: Date;
    totalprice: number;
    status: string;
    employeeid: number | null;
    customerid: number | null;
};

type OrderProduct = {
    orderid: number;
    productid: number;
    quantity: number;
    returndate: Date | null;
};

type Receipt = {
    paymentmethod: string;
    totalamount: number;
    createdat: Date;
    bookingid: number | null;
    orderid: number | null;
};

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min: number, max: number, step = 0.5) {
    const steps = Math.floor((max - min) / step) + 1;
    return min + step * getRandomInt(0, steps - 1);
}

function getSaleFactor(month: number) {
    // Tháng 1-4: tăng, 4-9: giảm, 9-12: tăng, 12-1: giảm
    if (month >= 0 && month <= 3) return 'high';
    if (month >= 4 && month <= 8) return 'low';
    if (month >= 9 && month <= 10) return 'high';
    if (month === 11) return 'low';
    return 'normal';
}

async function main() {
    console.log('Bắt đầu seed dữ liệu từ 2019 đến 2024...');
    const startTime = Date.now();

    // Lấy dữ liệu tham chiếu
    const courts = await prisma.courts.findMany({ select: { courtid: true, zoneid: true } });
    const zones = await prisma.zones.findMany({ select: { zoneid: true } });
    const zonePrices = await prisma.zone_prices.findMany();
    const products = await prisma.products.findMany({ select: { productid: true, sellingprice: true, rentalprice: true } });
    const customers = await prisma.customers.findMany({
        select: {
            customerid: true,
            accounts: {
                select: {
                    accountid: true,
                    phonenumber: true
                }
            }
        }
    });
    const employees = await prisma.employees.findMany({
        select: {
            employeeid: true,
            accounts: {
                select: {
                    accountid: true,
                    phonenumber: true
                }
            }
        }
    });

    console.log('Đã load xong dữ liệu tham chiếu');
    console.log(`- ${courts.length} sân`);
    console.log(`- ${products.length} sản phẩm`);
    console.log(`- ${customers.length} khách hàng`);
    console.log(`- ${employees.length} nhân viên`);

    // Map customerid -> phonenumber
    const customerPhones: Record<number, string> = {};
    for (const c of customers) {
        customerPhones[c.customerid] = c.accounts?.phonenumber || '0900000000';
    }
    // Map employeeid -> phonenumber
    const employeePhones: Record<number, string> = {};
    for (const e of employees) {
        employeePhones[e.employeeid] = e.accounts?.phonenumber || '0900000000';
    }

    const startDate = new Date('2019-01-01');
    const endDate = new Date('2024-12-31');

    // Batch size để tránh quá tải memory
    const BATCH_DAYS = 30; // Process 30 ngày một lần

    let totalBookings = 0;
    let totalOrders = 0;

    for (let currentDate = new Date(startDate); currentDate <= endDate;) {
        const batchEndDate = new Date(currentDate);
        batchEndDate.setDate(batchEndDate.getDate() + BATCH_DAYS);
        if (batchEndDate > endDate) batchEndDate.setTime(endDate.getTime());

        console.log(`\nXử lý batch từ ${currentDate.toLocaleDateString()} đến ${batchEndDate.toLocaleDateString()}`);

        const bookingsToCreate: Booking[] = [];
        const courtBookingsToCreate: CourtBooking[] = [];
        const ordersToCreate: Order[] = [];
        const orderProductsToCreate: OrderProduct[] = [];
        const receiptsToCreate: Receipt[] = [];

        // Process từng ngày trong batch
        for (let d = new Date(currentDate); d <= batchEndDate; d.setDate(d.getDate() + 1)) {
            const date = new Date(d);
            console.log(`\n  Đang xử lý ngày ${date.toLocaleDateString()}`);
            const month = date.getMonth();
            const saleFactor = getSaleFactor(month);

            const numBooking = Math.max(1, getRandomInt(2, 5));
            const numOrder = Math.max(1, getRandomInt(2, 5));
            console.log(`    Tạo ${numBooking} bookings và ${numOrder} orders`);

            // --- Bookings & Court Bookings ---
            console.log('    Đang xử lý bookings...');
            for (let b = 0; b < numBooking; b++) {
                try {
                    // Chọn customer hoặc employee tạo booking
                    const isCustomer = Math.random() < 0.7;
                    const customer = isCustomer ? customers[getRandomInt(0, customers.length - 1)] : null;
                    const employee = !isCustomer ? employees[getRandomInt(0, employees.length - 1)] : null;
                    const guestphone = isCustomer && customer ? customerPhones[customer.customerid] :
                        !isCustomer && employee ? employeePhones[employee.employeeid] :
                            '0900000000';

                    let totalBookingPrice = 0;
                    const courtBookingsForThisBooking: CourtBooking[] = [];

                    // Court bookings for this booking
                    const numCourt = saleFactor === 'high' ? getRandomInt(1, 4) :
                        saleFactor === 'low' ? getRandomInt(1, 2) :
                            getRandomInt(1, 3);

                    console.log(`      Booking #${b + 1}: ${numCourt} sân`);

                    for (let c = 0; c < numCourt; c++) {
                        const court = courts[getRandomInt(0, courts.length - 1)];
                        // Random starttime 6h-21h (để đảm bảo có ít nhất 1h trước giờ đóng cửa)
                        const startHour = 6 + getRandomInt(0, 29) * 0.5; // Max là 20h30
                        const startMinute = (startHour % 1) * 60;
                        const realStartHour = Math.floor(startHour);
                        const realStartMinute = Math.round(startMinute);
                        const starttime = new Date(date);
                        starttime.setHours(realStartHour, realStartMinute, 0, 0);

                        // Tính duration sao cho endtime không vượt quá 22h
                        const maxDuration = (22 - startHour);
                        const duration = Math.min(getRandomFloat(1, 5, 0.5), maxDuration);
                        const endtime = new Date(starttime.getTime() + duration * 60 * 60 * 1000);

                        console.log(`        Sân ${court.courtid}: ${starttime.toLocaleTimeString()} - ${endtime.toLocaleTimeString()} (${duration}h)`);

                        // Tính giá theo zone_prices
                        let price = 0;
                        let remain = duration;
                        let cur = new Date(starttime);

                        while (remain > 0.01) {
                            const day = cur.getDay();
                            const zps = zonePrices.filter(zp => zp.zoneid === court.zoneid && (
                                (zp.dayfrom === 'Monday' && day >= 1 && day <= 5) ||
                                (zp.dayfrom === 'Saturday' && (day === 6 || day === 0))
                            ));

                            let slot = zps.find(zp => {
                                if (!zp.starttime || !zp.endtime) return false;
                                const [sh, sm] = zp.starttime.split(':').map(Number);
                                const [eh, em] = zp.endtime.split(':').map(Number);
                                const st = sh + sm / 60;
                                const et = eh + em / 60;
                                const curHour = cur.getHours() + cur.getMinutes() / 60;
                                return curHour >= st && curHour < et;
                            });
                            if (!slot) slot = zps[0];
                            if (!slot || !slot.starttime || !slot.endtime || !slot.price) {
                                console.log('        WARN: Không tìm thấy zone_price phù hợp');
                                continue;
                            }

                            const [sh, sm] = slot.starttime.split(':').map(Number);
                            const [eh, em] = slot.endtime.split(':').map(Number);
                            const slotEnd = new Date(cur);
                            slotEnd.setHours(eh, em, 0, 0);
                            const slotDuration = Math.min(remain, (slotEnd.getTime() - cur.getTime()) / (1000 * 60 * 60));
                            price += Number(slot.price) * slotDuration;
                            remain -= slotDuration;
                            cur = new Date(cur.getTime() + slotDuration * 60 * 60 * 1000);
                        }

                        totalBookingPrice += price;
                        courtBookingsForThisBooking.push({
                            date,
                            starttime,
                            endtime,
                            duration,
                            bookingid: 0, // Sẽ cập nhật sau
                            courtid: court.courtid,
                        });
                    }

                    bookingsToCreate.push({
                        bookingid: 0, // Sẽ để DB tự tạo
                        guestphone,
                        bookingdate: date,
                        totalprice: Math.round(totalBookingPrice),
                        bookingstatus: 'confirmed',
                        createdat: date,
                        updatedat: date,
                        employeeid: employee?.employeeid || null,
                        customerid: customer?.customerid || null,
                        voucherid: null,
                    });

                    // Lưu court bookings cho booking này
                    courtBookingsToCreate.push(...courtBookingsForThisBooking);

                    // Receipt for booking only
                    if (Math.random() < 0.2) {
                        receiptsToCreate.push({
                            paymentmethod: 'momo',
                            totalamount: Math.round(totalBookingPrice),
                            createdat: date,
                            bookingid: 0, // Sẽ cập nhật sau
                            orderid: null,
                        });
                    }
                } catch (error) {
                    console.error('    ERROR khi xử lý booking:', error);
                }
            }

            // --- Orders & Order Products ---
            console.log('    Đang xử lý orders...');
            for (let o = 0; o < numOrder; o++) {
                try {
                    const isCustomer = Math.random() < 0.7;
                    const customer = isCustomer ? customers[getRandomInt(0, customers.length - 1)] : null;
                    const employee = !isCustomer ? employees[getRandomInt(0, employees.length - 1)] : null;

                    let totalOrderPrice = 0;
                    const orderProductsForThisOrder: OrderProduct[] = [];

                    // Products
                    const numProduct = saleFactor === 'high' ? getRandomInt(1, 6) :
                        saleFactor === 'low' ? getRandomInt(1, 3) :
                            getRandomInt(1, 4);
                    const numRental = saleFactor === 'high' ? getRandomInt(0, 4) :
                        saleFactor === 'low' ? getRandomInt(0, 2) :
                            getRandomInt(0, 3);

                    console.log(`      Order #${o + 1}: ${numProduct} sản phẩm bán, ${numRental} sản phẩm thuê`);

                    // Sản phẩm bán (1-71)
                    for (let p = 0; p < numProduct; p++) {
                        const prod = products[getRandomInt(0, 70)];
                        const price = Number(prod.sellingprice) || 0;
                        totalOrderPrice += price;
                        orderProductsForThisOrder.push({
                            orderid: 0, // Sẽ cập nhật sau
                            productid: prod.productid,
                            quantity: 1,
                            returndate: null,
                        });
                    }

                    // Sản phẩm thuê (72-87)
                    for (let p = 0; p < numRental; p++) {
                        const prod = products[getRandomInt(71, 86)];
                        const price = Number(prod.rentalprice) || 0;
                        totalOrderPrice += price;
                        // Tìm booking cùng ngày để lấy returndate
                        const booking = bookingsToCreate.find(b => b.bookingdate.getTime() === date.getTime());
                        orderProductsForThisOrder.push({
                            orderid: 0, // Sẽ cập nhật sau
                            productid: prod.productid,
                            quantity: 1,
                            returndate: booking ? booking.bookingdate : date,
                        });
                    }

                    ordersToCreate.push({
                        orderid: 0, // Sẽ để DB tự tạo
                        ordertype: Math.random() < 0.5 ? 'Bán hàng' : 'Cho thuê',
                        orderdate: date,
                        totalprice: Math.round(totalOrderPrice),
                        status: 'Hoàn thành',
                        employeeid: employee?.employeeid || null,
                        customerid: customer?.customerid || null,
                    });

                    // Lưu order products cho order này
                    orderProductsToCreate.push(...orderProductsForThisOrder);

                    // Receipt for order only
                    if (Math.random() < 0.2) {
                        receiptsToCreate.push({
                            paymentmethod: 'momo',
                            totalamount: Math.round(totalOrderPrice),
                            createdat: date,
                            bookingid: null,
                            orderid: 0, // Sẽ cập nhật sau
                        });
                    }
                } catch (error) {
                    console.error('    ERROR khi xử lý order:', error);
                }
            }

            // --- Receipt booking + order ---
            if (Math.random() < 0.6) {
                const booking = bookingsToCreate[bookingsToCreate.length - 1];
                const order = ordersToCreate[ordersToCreate.length - 1];
                if (booking && order) {
                    const total = Number(booking.totalprice) + Number(order.totalprice);
                    receiptsToCreate.push({
                        paymentmethod: 'momo',
                        totalamount: Math.round(total),
                        createdat: date,
                        bookingid: 0, // Sẽ cập nhật sau
                        orderid: 0, // Sẽ cập nhật sau
                    });
                }
            }

            // Log số lượng record đã tạo cho ngày này
            console.log(`    Đã tạo xong:`);
            console.log(`    - Bookings: ${bookingsToCreate.length - totalBookings}`);
            console.log(`    - Orders: ${ordersToCreate.length - totalOrders}`);
        }

        // Insert batch data using transaction
        console.log('\nĐang lưu dữ liệu vào database...');
        await prisma.$transaction(async (tx) => {
            // Tạo bookings và lưu mapping index -> bookingid
            const bookingIdMap: number[] = [];
            for (let i = 0; i < bookingsToCreate.length; i++) {
                const booking = bookingsToCreate[i];
                const createdBooking = await tx.bookings.create({
                    data: {
                        guestphone: booking.guestphone,
                        bookingdate: booking.bookingdate,
                        totalprice: booking.totalprice,
                        bookingstatus: booking.bookingstatus,
                        createdat: booking.createdat,
                        updatedat: booking.updatedat,
                        employeeid: booking.employeeid,
                        customerid: booking.customerid,
                        voucherid: booking.voucherid,
                    }
                });
                bookingIdMap[i] = createdBooking.bookingid;
            }

            // Tạo court bookings với bookingid thực tế
            const courtBookingsWithRealIds = courtBookingsToCreate.map((cb, index) => {
                const bookingIndex = Math.floor(index / 3); // Giả sử mỗi booking có 3 court_booking
                return {
                    date: cb.date,
                    starttime: cb.starttime,
                    endtime: cb.endtime,
                    duration: cb.duration,
                    bookingid: bookingIdMap[bookingIndex] || bookingIdMap[0],
                    courtid: cb.courtid,
                };
            });
            if (courtBookingsWithRealIds.length > 0) {
                await tx.court_booking.createMany({ data: courtBookingsWithRealIds });
            }

            // Tạo orders và lưu mapping index -> orderid
            const orderIdMap: number[] = [];
            for (let i = 0; i < ordersToCreate.length; i++) {
                const order = ordersToCreate[i];
                const createdOrder = await tx.orders.create({
                    data: {
                        ordertype: order.ordertype,
                        orderdate: order.orderdate,
                        totalprice: order.totalprice,
                        status: order.status,
                        employeeid: order.employeeid,
                        customerid: order.customerid,
                    }
                });
                orderIdMap[i] = createdOrder.orderid;
            }

            // Tạo order products với orderid thực tế
            const orderProductsWithRealIds = orderProductsToCreate.map((op, index) => {
                const orderIndex = Math.floor(index / 4); // Giả sử mỗi order có 4 order_product
                return {
                    orderid: orderIdMap[orderIndex] || orderIdMap[0],
                    productid: op.productid,
                    quantity: op.quantity,
                    returndate: op.returndate,
                };
            }).filter((op, index, self) =>
                // Filter out duplicates based on orderid and productid combination
                index === self.findIndex(p =>
                    p.orderid === op.orderid && p.productid === op.productid
                )
            );
            if (orderProductsWithRealIds.length > 0) {
                await tx.order_product.createMany({ data: orderProductsWithRealIds });
            }

            // Tạo receipts với bookingid/orderid thực tế
            const receiptsWithRealIds = receiptsToCreate.map((receipt, index) => {
                const bookingIndex = Math.floor(index / 2);
                const orderIndex = Math.floor(index / 2);
                return {
                    paymentmethod: receipt.paymentmethod,
                    totalamount: receipt.totalamount,
                    createdat: receipt.createdat,
                    bookingid: receipt.bookingid === 0 ? (bookingIdMap[bookingIndex] || null) : receipt.bookingid,
                    orderid: receipt.orderid === 0 ? (orderIdMap[orderIndex] || null) : receipt.orderid,
                };
            });
            if (receiptsWithRealIds.length > 0) {
                await tx.receipts.createMany({ data: receiptsWithRealIds });
            }
        });

        totalBookings = bookingsToCreate.length;
        totalOrders = ordersToCreate.length;

        const progress = ((currentDate.getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime()) * 100).toFixed(2);
        console.log(`\nĐã xử lý xong batch (${progress}% hoàn thành)`);
        console.log(`Tổng số record đã tạo:`);
        console.log(`- Bookings: ${totalBookings}`);
        console.log(`- Court Bookings: ${courtBookingsToCreate.length}`);
        console.log(`- Orders: ${totalOrders}`);
        console.log(`- Order Products: ${orderProductsToCreate.length}`);
        console.log(`- Receipts: ${receiptsToCreate.length}`);

        currentDate = new Date(batchEndDate);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    const totalTime = (Date.now() - startTime) / 1000;
    console.log(`\nHoàn thành seed dữ liệu sau ${totalTime.toFixed(2)} giây`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 