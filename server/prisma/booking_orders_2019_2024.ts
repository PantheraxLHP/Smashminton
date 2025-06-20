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

// --- Thêm Type Definitions cho Purchase Order ---
type ProductBatch = {
    batchname: string;
    expirydate: Date;
    stockquantity: number;
    status: string;
    createdat: Date;
    updatedat: Date;
};

type PurchaseOrder = {
    poid: number; // Sẽ để DB tự tạo
    quantity: number;
    statusorder: string;
    deliverydate: Date;
    createdat: Date;
    updatedat: Date;
    productid: number;
    employeeid: number | null;
    supplierid: number;
    batchid: number; // Sẽ cập nhật sau
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

function getSaleFactorValue(month: number): number {
    const factor = getSaleFactor(month);
    if (factor === 'high') return 1.5;
    if (factor === 'low') return 0.7;
    return 1.0;
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
    // --- Lấy dữ liệu suppliers ---
    const suppliers = await prisma.suppliers.findMany();
    const supplyProducts = await prisma.supply_products.findMany();


    console.log('Đã load xong dữ liệu tham chiếu');
    console.log(`- ${courts.length} sân`);
    console.log(`- ${products.length} sản phẩm`);
    console.log(`- ${customers.length} khách hàng`);
    console.log(`- ${employees.length} nhân viên`);
    console.log(`- ${suppliers.length} nhà cung cấp`);


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

    // --- Map productid -> supplierid[] ---
    const productToSuppliers: Record<number, number[]> = {};
    for (const sp of supplyProducts) {
        if (!productToSuppliers[sp.productid]) {
            productToSuppliers[sp.productid] = [];
        }
        productToSuppliers[sp.productid].push(sp.supplierid);
    }


    const startDate = new Date('2019-01-01');
    const endDate = new Date('2024-12-31');

    // --- Thay đổi logic để chạy theo tháng ---
    let totalBookings = 0;
    let totalOrders = 0;
    let totalPurchaseOrders = 0;
    let monthlySoldProducts: Record<number, number> = {}; // { productid: quantity }

    for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
        const date = new Date(currentDate);
        const currentMonth = date.getMonth();
        const currentYear = date.getFullYear();

        const bookingsToCreate: Booking[] = [];
        const courtBookingsToCreate: CourtBooking[] = [];
        const ordersToCreate: Order[] = [];
        const orderProductsToCreate: OrderProduct[] = [];
        const receiptsToCreate: Receipt[] = [];

        // --- Bắt đầu xử lý từng ngày ---
        console.log(`\n  Đang xử lý ngày ${date.toLocaleDateString()}`);
        const month = date.getMonth();
        const saleFactor = getSaleFactor(month);

        const numBooking = Math.max(1, getRandomInt(2, 5));
        const numOrder = Math.max(1, getRandomInt(2, 5));
        // console.log(`    Tạo ${numBooking} bookings và ${numOrder} orders`);

        // --- Bookings & Court Bookings ---
        // console.log('    Đang xử lý bookings...');
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
                const bookingId = totalBookings + bookingsToCreate.length;

                // Court bookings for this booking
                const numCourt = saleFactor === 'high' ? getRandomInt(1, 4) :
                    saleFactor === 'low' ? getRandomInt(1, 2) :
                        getRandomInt(1, 3);

                // console.log(`      Booking #${b + 1}: ${numCourt} sân`);

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

                    // console.log(`        Sân ${court.courtid}: ${starttime.toLocaleTimeString()} - ${endtime.toLocaleTimeString()} (${duration}h)`);

                    // Tính giá theo zone_prices
                    let price = 0;
                    let remain = duration;
                    let cur = new Date(starttime);

                    while (remain > 0.01) {
                        const day = cur.getDay();
                        const zps = zonePrices.filter(zp => zp.zoneid === court.zoneid && (
                            ((zp.dayfrom === 'Monday' || zp.dayfrom === 'weekday') && day >= 1 && day <= 5) ||
                            ((zp.dayfrom === 'Saturday' || zp.dayfrom === 'weekend') && (day === 6 || day === 0))
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
                            // console.log('        WARN: Không tìm thấy zone_price phù hợp');
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
                        bookingid: bookingId, // Sẽ cập nhật sau
                        courtid: court.courtid,
                    });
                }

                bookingsToCreate.push({
                    bookingid: bookingId, // Sẽ để DB tự tạo
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
                        bookingid: bookingId, // Sẽ cập nhật sau
                        orderid: null,
                    });
                }
            } catch (error) {
                console.error('    ERROR khi xử lý booking:', error);
            }
        }

        // --- Orders & Order Products ---
        // console.log('    Đang xử lý orders...');
        for (let o = 0; o < numOrder; o++) {
            try {
                const isCustomer = Math.random() < 0.7;
                const customer = isCustomer ? customers[getRandomInt(0, customers.length - 1)] : null;
                const employee = !isCustomer ? employees[getRandomInt(0, employees.length - 1)] : null;

                let totalOrderPrice = 0;
                const orderProductsForThisOrder: OrderProduct[] = [];
                const orderId = totalOrders + ordersToCreate.length;

                // Products
                const numProduct = saleFactor === 'high' ? getRandomInt(1, 6) :
                    saleFactor === 'low' ? getRandomInt(1, 3) :
                        getRandomInt(1, 4);
                const numRental = saleFactor === 'high' ? getRandomInt(0, 4) :
                    saleFactor === 'low' ? getRandomInt(0, 2) :
                        getRandomInt(0, 3);

                // console.log(`      Order #${o + 1}: ${numProduct} sản phẩm bán, ${numRental} sản phẩm thuê`);

                // Sản phẩm bán (1-71)
                for (let p = 0; p < numProduct; p++) {
                    const prod = products[getRandomInt(0, 70)];
                    const quantity = 1;
                    const price = Number(prod.sellingprice) * quantity || 0;
                    totalOrderPrice += price;
                    orderProductsForThisOrder.push({
                        orderid: orderId, // Sẽ cập nhật sau
                        productid: prod.productid,
                        quantity: quantity,
                        returndate: null,
                    });
                    // Ghi nhận sản phẩm đã bán cho tháng này
                    monthlySoldProducts[prod.productid] = (monthlySoldProducts[prod.productid] || 0) + quantity;
                }

                // Sản phẩm thuê (72-87)
                for (let p = 0; p < numRental; p++) {
                    const prod = products[getRandomInt(71, 86)];
                    const price = Number(prod.rentalprice) || 0;
                    totalOrderPrice += price;
                    // Tìm booking cùng ngày để lấy returndate
                    const booking = bookingsToCreate.find(b => b.bookingdate.getTime() === date.getTime());
                    orderProductsForThisOrder.push({
                        orderid: orderId, // Sẽ cập nhật sau
                        productid: prod.productid,
                        quantity: 1,
                        returndate: booking ? booking.bookingdate : date,
                    });
                }

                ordersToCreate.push({
                    orderid: orderId, // Sẽ để DB tự tạo
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
                        orderid: orderId, // Sẽ cập nhật sau
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
                    bookingid: booking.bookingid, // Sẽ cập nhật sau
                    orderid: order.orderid, // Sẽ cập nhật sau
                });
            }
        }


        // --- Insert data into database ---
        // console.log('  Đang lưu dữ liệu vào database...');
        const tempBookingIdMap: Record<number, number> = {};
        const tempOrderIdMap: Record<number, number> = {};

        await prisma.$transaction(async (tx) => {
            // --- Create Bookings ---
            for (const booking of bookingsToCreate) {
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
                tempBookingIdMap[booking.bookingid] = createdBooking.bookingid;
            }

            // --- Create Court Bookings ---
            const courtBookingsWithRealIds = courtBookingsToCreate.map(cb => ({
                ...cb,
                bookingid: tempBookingIdMap[cb.bookingid],
            }));
            if (courtBookingsWithRealIds.length > 0) {
                await tx.court_booking.createMany({ data: courtBookingsWithRealIds });
            }

            // --- Create Orders ---
            for (const order of ordersToCreate) {
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
                tempOrderIdMap[order.orderid] = createdOrder.orderid;
            }

            // --- Create Order Products ---
            const orderProductsWithRealIds = orderProductsToCreate.map(op => ({
                ...op,
                orderid: tempOrderIdMap[op.orderid],
            })).filter((op, index, self) =>
                index === self.findIndex(p =>
                    p.orderid === op.orderid && p.productid === op.productid
                )
            );
            if (orderProductsWithRealIds.length > 0) {
                await tx.order_product.createMany({ data: orderProductsWithRealIds });
            }

            // --- Create Receipts ---
            const receiptsWithRealIds = receiptsToCreate.map(receipt => ({
                ...receipt,
                bookingid: receipt.bookingid !== null ? tempBookingIdMap[receipt.bookingid] : null,
                orderid: receipt.orderid !== null ? tempOrderIdMap[receipt.orderid] : null,
            }));
            if (receiptsWithRealIds.length > 0) {
                await tx.receipts.createMany({ data: receiptsWithRealIds });
            }
        });

        totalBookings += bookingsToCreate.length;
        totalOrders += ordersToCreate.length;

        // --- Xử lý cuối tháng: Tạo Purchase Orders ---
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);

        if (nextDay.getMonth() !== currentMonth || nextDay > endDate) {
            console.log(`\n--- KẾT THÚC THÁNG ${currentMonth + 1}/${currentYear} ---`);
            console.log('Tổng hợp sản phẩm đã bán và tạo đơn nhập hàng cho tháng sau...');

            const productBatchesToCreate: ProductBatch[] = [];
            const purchaseOrdersToCreate: Omit<PurchaseOrder, 'batchid' | 'poid'>[] = [];

            const nextMonth = (currentMonth + 1) % 12;
            const currentMonthFactor = getSaleFactorValue(currentMonth);
            const nextMonthFactor = getSaleFactorValue(nextMonth);
            const adjustmentFactor = nextMonthFactor / currentMonthFactor;

            for (const productIdStr in monthlySoldProducts) {
                const productId = parseInt(productIdStr);
                const soldQuantity = monthlySoldProducts[productId];

                // Ước tính số lượng cần cho tháng sau
                const estimatedQuantity = Math.ceil(soldQuantity * adjustmentFactor * getRandomFloat(1.1, 1.3));
                if (estimatedQuantity <= 0) continue;

                // Tìm nhà cung cấp
                const possibleSuppliers = productToSuppliers[productId];
                if (!possibleSuppliers || possibleSuppliers.length === 0) {
                    console.log(`  WARN: Không tìm thấy nhà cung cấp cho sản phẩm ${productId}`);
                    continue;
                }
                const supplierid = possibleSuppliers[getRandomInt(0, possibleSuppliers.length - 1)];
                const employee = employees[getRandomInt(0, employees.length - 1)];
                const deliveryDate = new Date(currentYear, currentMonth, date.getDate()); // Cuối tháng

                // Chuẩn bị batch và purchase order
                productBatchesToCreate.push({
                    batchname: `Batch-${productId}-${deliveryDate.toISOString().split('T')[0]}`,
                    expirydate: new Date(deliveryDate.getFullYear() + 1, deliveryDate.getMonth(), deliveryDate.getDate()),
                    stockquantity: estimatedQuantity,
                    status: 'Mới',
                    createdat: deliveryDate,
                    updatedat: deliveryDate,
                });

                purchaseOrdersToCreate.push({
                    quantity: estimatedQuantity,
                    statusorder: 'Hoàn thành',
                    deliverydate: deliveryDate,
                    createdat: deliveryDate,
                    updatedat: deliveryDate,
                    productid: productId,
                    employeeid: employee.employeeid,
                    supplierid: supplierid,
                });
            }

            // --- Lưu Purchase Orders vào DB ---
            if (purchaseOrdersToCreate.length > 0) {
                console.log(`  Đang tạo ${purchaseOrdersToCreate.length} đơn hàng nhập kho...`);
                await prisma.$transaction(async (tx) => {
                    for (let i = 0; i < purchaseOrdersToCreate.length; i++) {
                        const po = purchaseOrdersToCreate[i];
                        const batch = productBatchesToCreate[i];

                        const createdBatch = await tx.product_batch.create({
                            data: batch,
                        });

                        await tx.purchase_order.create({
                            data: {
                                ...po,
                                batchid: createdBatch.batchid,
                            }
                        });
                    }
                });
                totalPurchaseOrders += purchaseOrdersToCreate.length;
            }


            // Reset bộ đếm cho tháng mới
            monthlySoldProducts = {};

            const progress = ((date.getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime()) * 100).toFixed(2);
            console.log(`\nĐã xử lý xong tháng (${progress}% hoàn thành)`);
            console.log(`Tổng số record đã tạo:`);
            console.log(`- Bookings: ${totalBookings}`);
            console.log(`- Orders: ${totalOrders}`);
            console.log(`- Purchase Orders: ${totalPurchaseOrders}`);
        }
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