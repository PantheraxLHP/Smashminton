export interface Accounts {
    accountid: number;
    username?: string;
    password?: string;
    status?: string;
    fullname?: string;
    email?: string;
    dob?: Date;
    gender?: string;
    phonenumber?: string;
    address?: string;
    avatarurl?: string;
    accounttype?: string;
    createdat?: Date;
    updatedat?: Date;
    customers?: Customers;
    employees?: Employees;
}

export interface Customers {
    customerid: number;
    totalpurchase?: number;
    bookings?: Bookings[];
    accounts?: Accounts;
    orders?: Orders[];
    student_card?: StudentCard;
}

export interface StudentCard {
    studentcardid: number;
    schoolname?: string;
    studentid?: string;
    studyperiod?: string;
    customers?: Customers;
}

export interface Employees {
    employeeid: number;
    fingerprintid?: number;
    last_week_shift_type?: string;
    employee_type?: string;
    role?: string;
    bank_detail?: BankDetail[];
    bookings?: Bookings[];
    accounts?: Accounts;
    orders?: Orders[];
    penalty_records?: PenaltyRecords[];
    purchase_order?: PurchaseOrder[];
    reward_records?: RewardRecords[];
    shift_assignment?: ShiftAssignment[];
    shift_enrollment?: ShiftEnrollment[];
    timesheet?: Timesheet[];
}

export interface AutoassignmentRules {
    aaruleid: number;
    rulename?: string;
    ruledescription?: string;
    rulestatus?: string;
    ruleforemptype?: string;
    rulevalue?: string;
    ruleappliedfor?: string;
    ruletype?: string;
    rulesql?: string;
    columnname?: string;
    ctename?: string;
    canbecollided?: boolean;
    condition?: string;
    createdat?: Date;
    updatedat?: Date;
}

export interface BankDetail {
    bankdetailid: number;
    bankname?: string;
    banknumber?: string;
    bankholder?: string;
    bankbranch?: string;
    linkedphonenumber?: string;
    employeeid?: number;
    employees?: Employees;
}

export interface Bookings {
    bookingid: number;
    guestphone?: string;
    bookingdate?: Date;
    totalprice?: number;
    bookingstatus?: string;
    createdat?: Date;
    updatedat?: Date;
    employeeid?: number;
    customerid?: number;
    voucherid?: number;
    customers?: Customers;
    employees?: Employees;
    voucher?: Voucher;
    court_booking?: CourtBooking[];
    receipts?: Receipts[];
}

export interface CourtBooking {
    courtbookingid: number;
    date?: Date;
    starttime?: Date;
    endtime?: Date;
    duration?: number;
    bookingid?: number;
    courtid?: number;
    bookings?: Bookings;
    courts?: Courts;
}

export interface Courts {
    courtid: number;
    courtname?: string;
    courtimgurl?: string;
    avgrating?: number;
    timecalculateavg?: Date;
    zoneid?: number;
    court_booking?: CourtBooking[];
    zones?: Zones;
}

export interface OrderProduct {
    orderid: number;
    productid: number;
    quantity?: number;
    orders?: Orders;
    products?: Products;
}

export interface Orders {
    orderid: number;
    ordertype?: string;
    orderdate?: Date;
    returndate?: Date;
    totalprice?: number;
    status?: string;
    employeeid?: number;
    customerid?: number;
    order_product?: OrderProduct[];
    customers?: Customers;
    employees?: Employees;
    receipts?: Receipts[];
}

export interface PenaltyRecords {
    penaltyrecordid: number;
    penaltyruleid?: number;
    employeeid?: number;
    violationdate?: Date;
    finalpenaltyamount?: number;
    penaltyapplieddate?: Date;
    employees?: Employees;
    penalty_rules?: PenaltyRules;
}

export interface PenaltyRules {
    penaltyruleid: number;
    penaltyname?: string;
    penaltydescription?: string;
    basepenalty?: number;
    incrementalpenalty?: number;
    maxiumpenalty?: number;
    disciplineaction?: string;
    penalty_records?: PenaltyRecords[];
}

export interface ProductTypes {
    producttypeid: number;
    producttypename?: string;
    product_filter?: ProductFilter[];
}

export interface Products {
    productid: number;
    productname?: string;
    status?: string;
    sellingprice?: number;
    rentalprice?: number;
    costprice?: number;
    productimgurl?: string;
    createdat?: Date;
    updatedat?: Date;
    order_product?: OrderProduct[];
    product_attributes?: ProductAttributes[];
    purchase_order?: PurchaseOrder[];
}

export interface ProductBatch {
    batchid: number;
    batchname?: string;
    expirydate?: Date;
    stockquantity?: number;
    status?: string;
    createdat?: Date;
    updatedat?: Date;
    purchase_order?: PurchaseOrder[];
}

export interface PurchaseOrder {
    poid: number;
    quantity?: number;
    deliverydate?: Date;
    createdat?: Date;
    updatedat?: Date;
    productid?: number;
    employeeid?: number;
    supplierid?: number;
    batchid?: number;
    product_batch?: ProductBatch;
    employees?: Employees;
    products?: Products;
    suppliers?: Suppliers;
}

export interface Receipts {
    receiptid: number;
    paymentmethod?: string;
    totalamount?: number;
    createdat?: Date;
    updatedat?: Date;
    orderid?: number;
    bookingid?: number;
    bookings?: Bookings;
    orders?: Orders;
}

export interface RewardRecords {
    rewardrecordid: number;
    rewarddate?: Date;
    finalrewardamount?: number;
    rewardnote?: string;
    rewardrecordstatus?: string;
    rewardapplieddate?: Date;
    rewardruleid?: number;
    employeeid?: number;
    employees?: Employees;
    reward_rules?: RewardRules;
}

export interface RewardRules {
    rewardruleid: number;
    rewardname?: string;
    rewarddescription?: string;
    rewardtype?: string;
    rewardvalue?: number;
    reward_records?: RewardRecords[];
}

export interface Shift {
    shiftid: number;
    shiftstarthour?: string;
    shiftendhour?: string;
    shifttype?: string;
    shift_date?: ShiftDate[];
}

export interface ShiftAssignment {
    employeeid: number;
    shiftid: number;
    shiftdate: Date;
    status?: string;
    employees?: Employees;
    shift_date?: ShiftDate;
}

export interface ShiftDate {
    shiftid: number;
    shiftdate: Date;
    shift_assignment?: ShiftAssignment[];
    shift?: Shift;
    shift_enrollment?: ShiftEnrollment[];
}

export interface ShiftEnrollment {
    employeeid: number;
    shiftid: number;
    shiftdate: Date;
    enrollmentdate?: Date;
    employees?: Employees;
    shift_date?: ShiftDate;
}

export interface Suppliers {
    supplierid: number;
    suppliername?: string;
    contactname?: string;
    phonenumber?: string;
    email?: string;
    address?: string;
    createdat?: Date;
    updatedat?: Date;
    purchase_order?: PurchaseOrder[];
}

export interface Timesheet {
    timesheetid: number;
    timesheetdate?: Date;
    starthour?: Date;
    endhour?: Date;
    employeeid?: number;
    employees?: Employees;
}

export interface Voucher {
    voucherid: number;
    vouchername?: string;
    vouchertype?: string;
    discountamount?: number;
    duration?: string;
    expireddate?: Date;
    bookings?: Bookings[];
}

export interface ZonePrices {
    zonepriceid: number;
    dayfrom?: string;
    dayto?: string;
    starttime?: string;
    endtime?: string;
    price?: number;
    createdat?: Date;
    updatedat?: Date;
    zoneid?: number;
    zones?: Zones;
}

export interface Zones {
    zoneid: number;
    zonename?: string;
    zonetype?: string;
    zoneimgurl?: string;
    zonedescription?: string;
    courts?: Courts[];
    zone_prices?: ZonePrices[];
}

export interface ProductAttributes {
    productid: number;
    productfiltervalueid: number;
    product_filter_values?: ProductFilterValues;
    products?: Products;
}

export interface ProductFilter {
    productfilterid: number;
    productfiltername?: string;
    producttypeid?: number;
    product_types?: ProductTypes;
    product_filter_values?: ProductFilterValues[];
}

export interface ProductFilterValues {
    productfiltervalueid: number;
    value?: string;
    productfilterid?: number;
    product_attributes?: ProductAttributes[];
    product_filter?: ProductFilter;
}
