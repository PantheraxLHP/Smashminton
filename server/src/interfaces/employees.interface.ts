// Interface cơ bản cho Employee
export interface BankDetail {
  bankdetailid?: number;
  bankname?: string;
  banknumber?: string;
  bankholder?: string;
  active?: boolean;
  employeeid?: number;
}
export interface RewardRecord {
  rewardrecordid?: number;
  rewarddate?: Date;
  finalrewardamount?: number; // Decimal -> number
  rewardapplieddate?: Date;
  rewardruleid?: number;
  employeeid?: number;
}
export interface PenaltyRecord {
  penaltyrecordid?: number;
  penaltyruleid?: number;
  employeeid?: number;
  violationdate?: Date;
  finalpenaltyamount?: number; // Decimal -> number
  penaltyapplieddate?: Date;
}

export interface Employee {
    employeeid: number;
    username?: string;
    fullname?: string;
    gender?: string;
    status?: string;
    email?: string;
    dob?: Date;
    phonenumber?: string;
    address?: string;
    avatarurl?: string;
    fingerprintid?: number;
    employee_type?: string;
    role?: string;
    cccd?: string;
    expiry_cccd?: Date;
    taxcode?: string;
    salary?: number;
    bankdetails?: BankDetail;
    rewardrecords?: RewardRecord[];
    penaltyrecords?: PenaltyRecord[];
}