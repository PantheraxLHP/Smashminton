const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface DashboardData {
    revenue: number;
    duration: number;
    topCourts: Array<{
        courtname: string;
        numberBooking: number;
    }>;
    zoneRevenue: Array<{
        month: number;
        [key: string]: number;
    }>;
    newCustomers: number;
    bookingTimeslot: Array<{
        month: number;
        time1: number;
        time2: number;
        time3: number;
        time4: number;
    }>;
    productSalesRentals: Array<{
        month: number;
        saleCount: number;
        rentalCount: number;
    }>;
    topProducts: Array<{
        productid: number;
        productname: string;
        totalSold: number;
    }>;
    topRentedProducts: Array<{
        productid: number;
        productname: string;
        totalRented: number;
    }>;
    newCustomerRate: number;
}

export async function getDashboardData(year: number): Promise<DashboardData> {
    try {
        // Use Next.js built-in fetch with caching
        const [
            revenueRes,
            durationRes,
            topCourtsRes,
            zoneRevenueRes,
            newCustomersRes,
            bookingTimeslotRes,
            productSalesRentalsRes,
            topProductsRes,
            topRentedProductsRes,
            newCustomerRateRes,
        ] = await Promise.all([
            fetch(`${API_BASE}/api/v1/admin/dashboard/revenue/${year}`, {
                next: { revalidate: 300 }, // Cache for 5 minutes
            }),
            fetch(`${API_BASE}/api/v1/admin/dashboard/duration/${year}`, {
                next: { revalidate: 300 },
            }),
            fetch(`${API_BASE}/api/v1/admin/dashboard/top-courts/${year}`, {
                next: { revalidate: 300 },
            }),
            fetch(`${API_BASE}/api/v1/admin/dashboard/zone-revenue/${year}`, {
                next: { revalidate: 300 },
            }),
            fetch(`${API_BASE}/api/v1/admin/dashboard/new-customers/${year}`, {
                next: { revalidate: 300 },
            }),
            fetch(`${API_BASE}/api/v1/admin/dashboard/booking-count-timeslot/${year}`, {
                next: { revalidate: 300 },
            }),
            fetch(`${API_BASE}/api/v1/admin/dashboard/product-sales-rentals/${year}`, {
                next: { revalidate: 300 },
            }),
            fetch(`${API_BASE}/api/v1/admin/dashboard/top-products/${year}`, {
                next: { revalidate: 300 },
            }),
            fetch(`${API_BASE}/api/v1/admin/dashboard/top-rented-products/${year}`, {
                next: { revalidate: 300 },
            }),
            fetch(`${API_BASE}/api/v1/admin/dashboard/new-customer-rate/${year}`, {
                next: { revalidate: 300 },
            }),
        ]);

        // Check which requests were successful and handle partial failures
        const responses = [
            revenueRes,
            durationRes,
            topCourtsRes,
            zoneRevenueRes,
            newCustomersRes,
            bookingTimeslotRes,
            productSalesRentalsRes,
            topProductsRes,
            topRentedProductsRes,
            newCustomerRateRes,
        ];

        const failedRequests: string[] = [];
        responses.forEach((res, index) => {
            if (!res.ok) {
                const endpoints = [
                    'revenue',
                    'duration',
                    'top-courts',
                    'zone-revenue',
                    'new-customers',
                    'booking-timeslot',
                    'product-sales-rentals',
                    'top-products',
                    'top-rented-products',
                    'new-customer-rate',
                ];
                failedRequests.push(endpoints[index]);
                console.warn(`API request failed for ${endpoints[index]}: ${res.status} ${res.statusText}`);
            }
        });

        if (failedRequests.length === responses.length) {
            throw new Error('All API requests failed');
        }

        const data = await Promise.all([
            revenueRes.ok ? revenueRes.json().catch(() => 0) : 0,
            durationRes.ok ? durationRes.json().catch(() => 0) : 0,
            topCourtsRes.ok ? topCourtsRes.json().catch(() => []) : [],
            zoneRevenueRes.ok ? zoneRevenueRes.json().catch(() => []) : [],
            newCustomersRes.ok ? newCustomersRes.json().catch(() => 0) : 0,
            bookingTimeslotRes.ok ? bookingTimeslotRes.json().catch(() => []) : [],
            productSalesRentalsRes.ok ? productSalesRentalsRes.json().catch(() => []) : [],
            topProductsRes.ok ? topProductsRes.json().catch(() => []) : [],
            topRentedProductsRes.ok ? topRentedProductsRes.json().catch(() => []) : [],
            newCustomerRateRes.ok ? newCustomerRateRes.json().catch(() => 0) : 0,
        ]);

        // Log raw data for debugging (only in development)
        if (process.env.NODE_ENV === 'development') {
            console.log('Raw API responses:', {
                revenue: data[0],
                duration: data[1],
                topCourts: data[2],
                zoneRevenue: data[3],
                newCustomers: data[4],
                bookingTimeslot: data[5],
                productSalesRentals: data[6],
                topProducts: data[7],
                topRentedProducts: data[8],
                newCustomerRate: data[9],
            });
        }

        // Transform booking timeslot data to match chart expectations
        const transformedBookingTimeslot =
            data[5]?.map((item: any) => ({
                month: item.month,
                time1: item['06:00 - 09:00'] || 0,
                time2: item['09:00 - 12:00'] || 0,
                time3: item['12:00 - 18:00'] || 0,
                time4: item['18:00 - 22:00'] || 0,
            })) || [];

        // Transform product sales rentals data to match chart expectations
        const transformedProductSalesRentals =
            data[6]?.map((item: any) => ({
                month: item.month,
                saleCount: item.sales || 0,
                rentalCount: item.rentals || 0,
            })) || [];

        // Transform zone revenue data - ensure consistent zone naming
        const transformedZoneRevenue =
            data[3]?.map((item: any) => {
                const transformed: any = { month: item.month };

                // Map actual zone names from API to chart-expected names
                Object.keys(item).forEach((key) => {
                    if (key !== 'month') {
                        // Use actual zone names from API, or map to expected format
                        transformed[key] = item[key] || 0;
                    }
                });

                return transformed;
            }) || [];

        return {
            revenue: data[0],
            duration: data[1],
            topCourts: data[2],
            zoneRevenue: transformedZoneRevenue,
            newCustomers: data[4],
            bookingTimeslot: transformedBookingTimeslot,
            productSalesRentals: transformedProductSalesRentals,
            topProducts: data[7],
            topRentedProducts: data[8],
            newCustomerRate: data[9],
        };
    } catch (error) {
        console.error('Dashboard data fetch error:', error);
        throw new Error('Failed to fetch dashboard data');
    }
}
