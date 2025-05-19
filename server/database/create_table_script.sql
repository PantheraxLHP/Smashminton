drop table if exists receipts CASCADE;
drop table if exists order_product CASCADE;
drop table if exists orders CASCADE;
drop table if exists purchase_order CASCADE;
drop table if exists products CASCADE;
drop table if exists product_types CASCADE;
drop table if exists product_filter CASCADE;
drop table if exists product_filter_values CASCADE;
drop table if exists product_attributes CASCADE;
drop table if exists suppliers CASCADE;
drop table if exists court_booking CASCADE;
drop table if exists bookings CASCADE;
drop table if exists voucher CASCADE;
drop table if exists courts CASCADE;
drop table if exists zone_prices CASCADE;
drop table if exists zones CASCADE;
drop table if exists student_card CASCADE;
drop table if exists customers CASCADE;
drop table if exists timesheet CASCADE;
drop table if exists autoassignment_rules CASCADE;
drop table if exists reward_records CASCADE;
drop table if exists reward_rules CASCADE;
drop table if exists penalty_records CASCADE;
drop table if exists penalty_rules CASCADE;
drop table if exists shift_assignment CASCADE;
drop table if exists shift_enrollment CASCADE;
drop table if exists shift_date CASCADE;
drop table if exists shift CASCADE;
drop table if exists bank_detail CASCADE;
drop table if exists employees CASCADE;
drop table if exists accounts CASCADE;

create table if not exists accounts (
	accountid integer generated always as identity primary key,
	username text,
	password text,
	status text check (status in ('Active', 'Inactive')),
	fullname text,
	email text,
	dob timestamptz,
	gender text,
	phonenumber text,
	address text,
	avatarurl text default NULL,
	accounttype text check (accounttype in ('Employee', 'Customer')),
	createdat timestamptz default now(),
	updatedat timestamptz default now()
);

create table if not exists employees (
	employeeid integer primary key,
	fingerprintid integer default NULL,
	last_week_shift_type text check (last_week_shift_type in ('Morning', 'Evening', 'Mix')),
	employee_type text check (employee_type in ('Full-time', 'Part-time')),
	role text,
	constraint fk_employees_accounts foreign key (employeeid) references accounts(accountid)
);

create table if not exists bank_detail (
	bankdetailid integer generated always as identity primary key,
	bankname text,
	banknumber text,
	bankholder text,
	bankbranch text,
	linkedphonenumber text,
	employeeid integer,
	constraint fk_bankdetail_employeeid foreign key (employeeid) references employees(employeeid)
);

create table if not exists shift (
	shiftid integer generated always as identity primary key,
	shiftstarthour text,
	shiftendhour text,
	shifttype text
);

create table if not exists shift_date (
	shiftid integer,
	shiftdate timestamptz,
	constraint pk_shiftdate primary key (shiftid, shiftdate),
	constraint fk_shiftdate_shift foreign key (shiftid) references shift(shiftid) on delete cascade
);

create table if not exists shift_enrollment (
	employeeid integer,
	shiftid integer,
	shiftdate timestamptz,
	enrollmentdate timestamptz default now(),
	constraint pk_shiftenrollment primary key (employeeid, shiftid, shiftdate),
	constraint fk_shiftenrollment_employees foreign key (employeeid) references employees(employeeid),
	constraint fk_shiftenrollment_shiftdate foreign key (shiftid, shiftdate) references shift_date(shiftid, shiftdate)
);

create table if not exists shift_assignment (
	employeeid integer,
	shiftid integer,
	shiftdate timestamptz,
	constraint pk_shiftassignment primary key (employeeid, shiftid, shiftdate),
	constraint fk_shiftassignment_employees foreign key (employeeid) references employees(employeeid),
	constraint fk_shiftassignment_shiftdate foreign key (shiftid, shiftdate) references shift_date(shiftid, shiftdate)
);

create table if not exists penalty_rules (
	penaltyruleid integer generated always as identity primary key,
	penaltyname text,
	penaltydescription text,
	basepenalty numeric,
	incrementalpenalty numeric,
	maxiumpenalty numeric,
	disciplineaction text
);

create table if not exists penalty_records (
	penaltyrecordid integer generated always as identity primary key,
	penaltyruleid integer,
	employeeid integer,
	violationdate timestamptz,
	finalpenaltyamount numeric,
	penaltyapplieddate timestamptz,
	constraint fk_penaltyrecords_penaltyrules foreign key (penaltyruleid) references penalty_rules(penaltyruleid),
	constraint fk_penaltyrecords_employees foreign key (employeeid) references employees(employeeid)
);

create table if not exists reward_rules (
	rewardruleid integer generated always as identity primary key,
	rewardname text,
	rewarddescription text,
	rewardtype text,
	rewardvalue numeric
);

create table if not exists reward_records (
	rewardrecordid integer generated always as identity primary key,
	rewarddate timestamptz,
	finalrewardamount numeric,
	rewardapplieddate timestamptz,
	rewardruleid integer,
	employeeid integer,
	constraint fk_rewardrecords_rewardrules foreign key (rewardruleid) references reward_rules(rewardruleid),
	constraint fk_rewardrecords_employees foreign key (employeeid) references employees(employeeid)
);

create table if not exists autoassignment_rules (
    aaruleid integer generated always as identity primary key,
    rulename text,
    ruledescription text,
    rulestatus text check (rulestatus in ('Active', 'Inactive')),
    ruleforemptype text,
    rulevalue text,
    ruleappliedfor text,
    ruletype text,
    rulesql text,
    columnname text,
    ctename text,
    canbecollided boolean default false,
    condition text,
    createdat timestamptz default now(),
    updatedat timestamptz default now()
);

create table if not exists timesheet (
	timesheetid integer generated always as identity primary key,
	timesheetdate timestamptz,
	starthour timestamptz,
	endhour timestamptz,
	employeeid integer,
	constraint fk_timesheet_employees foreign key (employeeid) references employees(employeeid)
);

create table if not exists customers (
	customerid integer primary key,
	totalpurchase numeric,
	constraint fk_customers_accounts foreign key (customerid) references accounts(accountid)
);

create table if not exists student_card (
	studentcardid integer primary key,
	schoolname text,
	studentid text,
	studyperiod text,
	constraint fk_studentcard_customers foreign key (studentcardid) references customers(customerid)
);

create table if not exists zones (
	zoneid integer generated always as identity primary key,
	zonename text,
	zonetype text check (zonetype in ('Normal', 'AirConditioner', 'Private')),
	zoneimgurl text,
	zonedescription text
);

create table if not exists zone_prices (
	zonepriceid integer generated always as identity primary key,
	dayfrom text,
	dayto text,
	starttime text,
	endtime text,
	price numeric,
	createdat timestamptz default now(),
	updatedat timestamptz default now(),
	zoneid integer,
	constraint fk_zoneprices_zones foreign key (zoneid) references zones(zoneid)
);

create table if not exists courts (
	courtid integer generated always as identity primary key,
	courtname text,
	courtimgurl text,
	avgrating numeric,
	timecalculateavg timestamptz,
	zoneid integer,
	constraint fk_courts_zones foreign key (zoneid) references zones(zoneid)
);

create table if not exists voucher (
	voucherid integer generated always as identity primary key,
	vouchername text,
	vouchertype text,
	discountamount numeric,
	duration text,
	expireddate timestamptz
);

create table if not exists bookings (
	bookingid integer generated always as identity primary key,
	guestphone text,
	bookingdate timestamptz,
	totalprice numeric,
	bookingstatus text check (bookingstatus in ('Completed', 'Processing', 'Schedule')),
	createdat timestamptz default now(),
	updatedat timestamptz default now(),
	employeeid integer,
	customerid integer,
	voucherid integer,
	constraint fk_bookings_employees foreign key (employeeid) references employees(employeeid),
	constraint fk_bookings_customers foreign key (customerid) references customers(customerid),
	constraint fk_bookings_voucher foreign key (voucherid) references voucher(voucherid)
);

create table if not exists court_booking (
	courtbookingid integer generated always as identity primary key,
	date timestamptz,
	starttime timestamptz,
	endtime timestamptz,
	duration numeric,
	bookingid integer,
	courtid integer,
	constraint fk_courtbooking_bookings foreign key (bookingid) references bookings(bookingid),
	constraint fk_courtbooking_courts foreign key (courtid) references courts(courtid)
);

create table if not exists suppliers (
	supplierid integer generated always as identity primary key,
	suppliername text,
	contactname text,
	phonenumber text,
	email text,
	address text,
	createdat timestamptz default now(),
	updatedat timestamptz default now()
);

create table if not exists products (
	productid integer generated always as identity primary key,
	productname text,
	status text,
	sellingprice numeric,
	rentalprice numeric,
	costprice numeric,
	productimgurl text,
	createdat timestamptz default now(),
	updatedat timestamptz default now()
);

create table if not exists product_batch (
	batchid integer generated always as identity primary key,
	batchname text,
	expirydate timestamptz,
	stockquantity integer,
	poid integer,
	constraint fk_productbatch_purchaseorder foreign key (poid) references purchase_order(poid)
);

create table if not exists product_types (
	producttypeid integer generated always as identity primary key,
	producttypename text
);

create table if not exists product_filter (
	productfilterid integer generated always as identity primary key,
	productfiltername text,
	producttypeid integer,
	constraint fk_productfilter_producttypes foreign key (producttypeid) references product_types(producttypeid)
);

create table if not exists product_filter_values (
	productfiltervalueid integer generated always as identity primary key,
	value text,
	productfilterid integer,
	constraint fk_productfiltervalues_productfilter foreign key (productfilterid) references product_filter(productfilterid)
);

create table if not exists product_attributes (
	productid integer,
	productfiltervalueid integer,
	constraint pk_productattributes primary key (productid, productfiltervalueid),
	constraint fk_productattributes_products foreign key (productid) references products(productid),
	constraint fk_productattributes_productfiltervalues foreign key (productfiltervalueid) references product_filter_values(productfiltervalueid)
);

create table if not exists purchase_order (
	poid integer generated always as identity primary key,
	quantity integer,
	deliverydate timestamptz,
	status text,
	createdat timestamptz default now(),
	updatedat timestamptz default now(),
	productid integer,
	employeeid integer,
	supplierid integer,
	constraint fk_purchaseorder_products foreign key (productid) references products(productid),
	constraint fk_purchaseorder_employees foreign key (employeeid) references employees(employeeid),
	constraint fk_purchaseorder_suppliers foreign key (supplierid) references suppliers(supplierid)
);

create table if not exists orders (
	orderid integer generated always as identity primary key,
	ordertype text,
	orderdate timestamptz,
	returndate timestamptz,
	totalprice numeric,
	status text,
	employeeid integer,
	customerid integer,
	constraint fk_orders_employees foreign key (employeeid) references employees(employeeid),
	constraint fk_orders_customers foreign key (customerid) references customers(customerid)
);

create table if not exists order_product (
	orderid integer,
	productid integer,
	quantity integer,
	constraint pk_orderproduct primary key (orderid, productid),
	constraint fk_orderproduct_orders foreign key (orderid) references orders(orderid),
	constraint fk_orderproduct_products foreign key (productid) references products(productid)
);

create table if not exists receipts (
	receiptid integer generated always as identity primary key,
	paymentmethod text,
	totalamount numeric,
	createdat timestamptz default now(),
	updatedat timestamptz default now(),
	orderid integer,
	bookingid integer,
	constraint fk_receipts_orders foreign key (orderid) references orders(orderid),
	constraint fk_receipts_bookings foreign key (bookingid) references bookings(bookingid)
);