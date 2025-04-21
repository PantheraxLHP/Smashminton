import { AvailableCourts } from "./court_booking.interface";

export interface CacheCourtBooking {
    zoneid: number;
    courtid: number;
    starttime: Date;      
    duration: number;       
    endtime: Date;       
  }
  
export interface CacheBooking {
  customerid: number;
  court_booking: CacheCourtBooking[];
}

export interface AvailableCourtsAndUnavailableStartTime {
  availableCourts: AvailableCourts[]; // Danh sách các sân khả dụng
  unavailableStartTimes: string[];   // Danh sách các khung giờ không khả dụng
}