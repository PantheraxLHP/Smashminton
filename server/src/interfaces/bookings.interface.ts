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

