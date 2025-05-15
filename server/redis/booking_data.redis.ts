import Keyv from "keyv";
import KeyvRedis from '@keyv/redis';
import { CacheBooking } from "../src/interfaces/bookings.interface";
import Redis from 'ioredis';
import { CacheCourtBooking } from "../src/interfaces/bookings.interface";
import { CacheOrder } from "src/interfaces/orders.interface";
// Kết nối Keyv với Redis
const redisUrl = "redis://localhost:6379";
const booking_keyv = new Keyv({ store: new KeyvRedis({ url: redisUrl }), namespace: 'booking' }); // Sử dụng Keyv với KeyvRedis
const order_keyv = new Keyv({ store: new KeyvRedis({ url: redisUrl }), namespace: 'order' }); // Sử dụng Keyv với KeyvRedis
// Khởi tạo Redis client
const redisClient = new Redis(redisUrl);
// Hàm lưu dữ liệu vào Keyv
async function saveCacheBooking(username: string, data: CacheBooking): Promise<void> {
    // Kiểm tra và xóa dữ liệu nếu đã tồn tại
    const existingData = await booking_keyv.get(username);
    if (existingData) {
        console.log(`Data for user ${username} already exists. Deleting...`);
        await booking_keyv.delete(username); // Xóa dữ liệu cũ
    }

    // Lưu dữ liệu mới
    await booking_keyv.set(username, data,);
    console.log(`Data saved for user: ${username}`);
}

async function saveCacheOrder(username: string, data: CacheOrder): Promise<void> {
    // Kiểm tra và xóa dữ liệu nếu đã tồn tại
    const existingData = await order_keyv.get(username);
    if (existingData) {
        console.log(`Data for user ${username} already exists. Deleting...`);
        await order_keyv.delete(username); // Xóa dữ liệu cũ
    }

    // Lưu dữ liệu mới
    await order_keyv.set(username, data,);
    console.log(`Data saved for user: ${username}`);
}
// Hàm lấy dữ liệu từ Keyv
async function getCacheBooking(username: string): Promise<CacheBooking | null> {
    const data = await booking_keyv.get(username); // Lấy dữ liệu từ Keyv
    return data || null; // Nếu không có dữ liệu, trả về null
}

async function getAllBookings(): Promise<any[]> {
    // Lấy tất cả các key trong namespace 'booking'
    const keys = await redisClient.keys('booking:*');
    const bookings: CacheCourtBooking[] = [];

    for (const key of keys) {
        // Loại bỏ prefix 'booking:' để lấy key gốc
        const actualKey = key.replace('booking::booking:', ''); // Loại bỏ prefix 'booking:'
        const value = await booking_keyv.get(actualKey); // Lấy giá trị từ Keyv
        console.log("Key:", actualKey, "Value:", value); // In key và value ra console
        if (value) {
            bookings.push(value); // Thêm key và value vào danh sách
        }
    }
    // Trả về danh sách đầy đủ thông tin
    return bookings
}

async function getAllOrders(): Promise<any[]> {
    // Lấy tất cả các key trong namespace 'order'
    const keys = await redisClient.keys('order:*');
    const orders: CacheOrder[] = [];

    for (const key of keys) {
        // Loại bỏ prefix 'order:' để lấy key gốc
        const actualKey = key.replace('order::order:', ''); // Loại bỏ prefix 'order:'
        const value = await order_keyv.get(actualKey); // Lấy giá trị từ Keyv
        console.log("Key:", actualKey, "Value:", value); // In key và value ra console
        if (value) {
            orders.push(value); // Thêm key và value vào danh sách
        }
    }
    // Trả về danh sách đầy đủ thông tin
    return orders;
}
// Ví dụ sử dụng
(async () => {
    const username1 = "nguyenvun";
    const username2 = "phamthuyo";
    const username3 = "john_doe"; // Tên người dùng trùng với username1 để kiểm tra xóa dữ liệu cũ

    // Dữ liệu mẫu cho user "nguyenvun"
    const bookingData1: CacheBooking = {
        court_booking: [
            {
                zoneid: 1,
                courtid: 2,
                courtname: 'Court A2',
                courtimgurl: 'https://res.cloudinary.com/dnagyxwcl/image/upload/v1745670707/A_2_dnrqpy.jpg',
                date: "2025-05-15",
                starttime: '09:00',
                duration: 1.5,
                endtime: '10:30',
                price: 150000,
            },
            {
                zoneid: 1,
                courtid: 3,
                courtname: 'Court A3',
                courtimgurl: 'https://res.cloudinary.com/dnagyxwcl/image/upload/v1745670707/A_3_wxlkcx.jpg',
                date: "2025-05-15",
                starttime: '09:00',
                duration: 3,
                endtime: '12:00',
                price: 300000,
            },
        ],
        totalprice: 450000, // Tổng giá
        TTL: -1 , // Thời gian sống của cache (giây)
    };

    // Dữ liệu mẫu cho user "phamthuyo"
    const bookingData2: CacheBooking = {
        court_booking: [
            {
                zoneid: 1,
                courtid: 5,
                courtname: 'Court A5',
                courtimgurl: 'https://res.cloudinary.com/dnagyxwcl/image/upload/v1745670707/A_5_m4lot8.jpg',
                date: "2025-05-15",
                starttime: '14:00',
                duration: 2,
                endtime: '16:00',
                price: 200000,
            },
            {
                zoneid: 1,
                courtid: 6,
                courtname: 'Court A6',
                courtimgurl: 'https://res.cloudinary.com/dnagyxwcl/image/upload/v1745670707/A_6_kmlie9.jpg', // Added courtimgurl
                date: "2025-05-15",
                starttime: '16:30',
                duration: 1.5,
                endtime: '18:00',
                price: 150000,
            },
        ],
        totalprice: 350000, // Tổng giá
        TTL: -1, // Thời gian sống của cache
    };

    // Dữ liệu mẫu cho user "phamthuyo"
    const bookingData3: CacheBooking = {
        court_booking: [
            {
                zoneid: 1,
                courtid: 3,
                courtname: 'Court A3',
                courtimgurl: 'https://res.cloudinary.com/dnagyxwcl/image/upload/v1745670707/A_3_wxlkcx.jpg',
                date: "2025-05-30",
                starttime: '14:00',
                duration: 2,
                endtime: '16:00',
                price: 200000,
            },
            {
                zoneid: 1,
                courtid: 6,
                courtname: 'Court A6',
                courtimgurl: 'https://res.cloudinary.com/dnagyxwcl/image/upload/v1745670707/A_6_kmlie9.jpg', // Added courtimgurl
                date: "2025-05-30",
                starttime: '16:30',
                duration: 1.5,
                endtime: '18:00',
                price: 150000,
            },
        ],
        totalprice: 350000, // Tổng giá
        TTL: -1, // Thời gian sống của cache
    };

    const orderData1: CacheOrder = {
        product_order: [
            {
                productid: 1,
                productname: 'Quấn cán cầu lông Yonex AC147EX',
                productimgurl: 'https://res.cloudinary.com/dnagyxwcl/image/upload/v1746447341/quan-can-vot-cau-long-yonex-ac147ex-2_mzac1e.webp',
                unitprice: 150000,
                quantity: 2,
                totalamount: 300000,
            },
            {
                productid: 2,
                productname: 'Túi đựng giày cầu lông',
                productimgurl: 'https://res.cloudinary.com/dnagyxwcl/image/upload/v1746449426/tui-dung-giay-kamito_ruyqgy.webp',
                unitprice: 150000,
                quantity: 1,
                totalamount: 150000,
            },
        ],
        totalprice: 450000, // Tổng giá
    };
    const orderData2: CacheOrder = {
        product_order: [
            {
                productid: 3,
                productname: 'Vớ cầu lông Yonex',
                productimgurl: 'https://res.cloudinary.com/dnagyxwcl/image/upload/v1746449369/vo-cau-long-yonex_emdrie.webp',
                unitprice: 150000,
                quantity: 1,
                totalamount: 150000,
            },
        ],
        totalprice: 150000,
    };

    // Lưu dữ liệu vào Keyv
    await saveCacheBooking(username1, bookingData1);
    await saveCacheBooking(username2, bookingData2);
    await saveCacheBooking(username3, bookingData3); 

    await saveCacheOrder(username1, orderData1);
    await saveCacheOrder(username2, orderData2);
    // Lấy tất cả dữ liệu từ Redis
    const allBookings = await getAllBookings();
    console.log("All bookings in Redis:", allBookings);

    // Đóng kết nối Redis
    await redisClient.quit();

    process.exit(0);
})();