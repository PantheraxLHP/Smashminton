# Nodemailer Module

Module để gửi email trong ứng dụng Smashminton sử dụng Nodemailer với Gmail SMTP.

## 🔧 Cấu hình

### 1. Biến môi trường

Thêm các biến sau vào file `.env`:

```env
EMAIL_USER="your_email@gmail.com"
EMAIL_PASSWORD="your_app_password_here"
```

### 2. Cấu hình Gmail

1. **Bật 2-Factor Authentication** cho tài khoản Gmail
2. **Tạo App Password**:
    - Vào Google Account Settings
    - Security → 2-Step Verification → App passwords
    - Tạo mật khẩu ứng dụng mới cho "Mail"
    - Sử dụng mật khẩu này cho `EMAIL_PASSWORD`

## 🚀 Tính năng

### 1. Email xác nhận đặt sân (`sendBookingConfirmation`)

- Gửi email xác nhận đặt sân với thông tin chi tiết
- Template HTML đẹp mắt với thông tin booking
- Bao gồm: mã booking, sân, thời gian, giá tiền

### 2. Email chào mừng (`sendWelcomeEmail`)

- Gửi email chào mừng người dùng mới
- Có thể bao gồm mật khẩu tạm thời
- Hướng dẫn sử dụng dịch vụ

### 3. Email reset mật khẩu (`sendPasswordResetEmail`)

- Gửi link reset mật khẩu với thời gian hết hạn
- Template bảo mật với cảnh báo
- Link tự động và hướng dẫn an toàn

### 4. Email thông báo chung (`sendNotificationEmail`)

- Gửi email thông báo tùy chỉnh
- Hỗ trợ cả HTML và text plain
- Có thể gửi cho nhiều người cùng lúc

## 📡 API Endpoints

### POST `/email/send-general`

Gửi email thông báo chung

```json
{
    "to": "user@example.com",
    "subject": "Thông báo quan trọng",
    "message": "Nội dung thông báo...",
    "isHtml": false
}
```

### POST `/email/send-booking-confirmation`

Gửi email xác nhận đặt sân

```json
{
    "email": "customer@example.com",
    "customerName": "Nguyễn Văn A",
    "bookingId": "BK001",
    "courtName": "Court A1",
    "date": "2025-06-15",
    "startTime": "08:00",
    "endTime": "10:00",
    "totalPrice": 200000,
    "paymentMethod": "MoMo"
}
```

### POST `/email/send-welcome`

Gửi email chào mừng

```json
{
    "email": "newuser@example.com",
    "userName": "Nguyễn Văn B",
    "temporaryPassword": "temp123456"
}
```

### POST `/email/send-password-reset`

Gửi email reset mật khẩu

```json
{
    "email": "user@example.com",
    "userName": "Nguyễn Văn C",
    "resetLink": "https://app.smashminton.com/reset-password?token=abc123",
    "expiryTime": "2025-06-03 10:00:00"
}
```

## 💻 Sử dụng trong Service khác

### 1. Import Module

Trong module bạn muốn sử dụng:

```typescript
import { NodemailerModule } from '../nodemailer/nodemailer.module';

@Module({
    imports: [NodemailerModule],
    // ...
})
export class YourModule {}
```

### 2. Inject Service

```typescript
import { NodemailerService } from '../nodemailer/nodemailer.service';

@Injectable()
export class YourService {
    constructor(private readonly emailService: NodemailerService) {}

    async someMethod() {
        // Gửi email xác nhận đặt sân
        await this.emailService.sendBookingConfirmation('customer@example.com', {
            customerName: 'Nguyễn Văn A',
            bookingId: 'BK001',
            courtName: 'Court A1',
            date: '2025-06-15',
            startTime: '08:00',
            endTime: '10:00',
            totalPrice: 200000,
            paymentMethod: 'MoMo',
        });
    }
}
```

## 🎨 Template Email

Tất cả email đều sử dụng template HTML responsive với:

- Header với logo Smashminton Club 🏸
- Nội dung chính được format đẹp
- Footer với thông tin liên hệ
- Màu sắc nhất quán theo brand

## ⚠️ Lỗi thường gặp

### 1. "Invalid login: 535-5.7.8 Username and Password not accepted"

- Kiểm tra EMAIL_USER và EMAIL_PASSWORD
- Đảm bảo đã bật 2FA và tạo App Password

### 2. "Connection timeout"

- Kiểm tra kết nối internet
- Kiểm tra firewall có chặn port 587/465 không

### 3. "Message not sent"

- Kiểm tra định dạng email address
- Kiểm tra log để xem lỗi cụ thể

## 🔒 Bảo mật

- Không commit EMAIL_PASSWORD vào git
- Sử dụng App Password thay vì mật khẩu chính
- Kiểm tra email address trước khi gửi
- Log các hoạt động gửi email để audit

## 🧪 Test

Để test module, bạn có thể:

1. **Sử dụng Swagger UI**: Truy cập `/api` và test các endpoint Email
2. **Test trực tiếp**: Gọi các method trong service
3. **Integration test**: Kiểm tra trong luồng đặt sân thực tế

## 📝 Ví dụ sử dụng

```typescript
// Trong BookingService
async createBooking(bookingData: any) {
  // ... logic tạo booking

  // Gửi email xác nhận
  await this.emailService.sendBookingConfirmation(
    bookingData.customerEmail,
    {
      customerName: bookingData.customerName,
      bookingId: booking.id,
      courtName: booking.court.name,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      totalPrice: booking.totalPrice,
      paymentMethod: booking.paymentMethod
    }
  );
}
```
