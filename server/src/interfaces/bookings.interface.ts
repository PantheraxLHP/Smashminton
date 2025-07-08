import { AvailableCourts } from "./court_booking.interface";

export interface CacheCourtBooking {
    zoneid: number;
    courtid: number;
    courtname: string; // Tên sân
    courtimgurl: string; // Hình ảnh sân
    date: string; // Ngày đặt sân
    starttime: string;      
    duration: number;       
    endtime: string;       
    price: number;
}
  
export interface CacheBooking {  
  court_booking: CacheCourtBooking[];
  totalprice: number;
  TTL?: number; // Thời gian sống của cache
}

export interface AvailableCourtsAndUnavailableStartTime {
  availableCourts: AvailableCourts[]; // Danh sách các sân khả dụng
  unavailableStartTimes: string[];   // Danh sách các khung giờ không khả dụng
}

export interface Booking {
  bookingid: number;           // ID booking (auto increment)
  guestphone?: string;          // Số điện thoại khách
  bookingdate?: Date;           // Ngày đặt lịch
  totalprice?: number;          // Tổng giá tiền
  bookingstatus?: string;       // Trạng thái đặt lịch
  employeeid?: number;          // ID nhân viên
  customerid?: number;          // ID khách hàng
  voucherid?: number;           // ID voucher
}