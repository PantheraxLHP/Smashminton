import { AvailableCourts } from "./court_booking.interface";

export interface CacheCourtBooking {
    zoneid: number;
    courtid: number;
    date: string; // Ngày đặt sân
    starttime: string;      
    duration: number;       
    endtime: string;       
    price: number;
}
  
export interface CacheBooking {
  court_booking: CacheCourtBooking[];
  totalprice: number;
}

export interface AvailableCourtsAndUnavailableStartTime {
  availableCourts: AvailableCourts[]; // Danh sách các sân khả dụng
  unavailableStartTimes: string[];   // Danh sách các khung giờ không khả dụng
}