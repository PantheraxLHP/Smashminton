import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ZonePricesService } from '../zone_prices/zone_prices.service';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    private zonePricesService: ZonePricesService
  ) { }
  async totalRevenue(year: number): Promise<number> {
    const receipts = await this.prisma.receipts.findMany({
      where: {
        createdat: {
          gte: new Date(`${year}-01-01`),
          lt: new Date(`${year + 1}-01-01`),
        },
      },
    });
    return receipts.reduce((acc, receipt) => acc + (receipt.totalamount ? Number(receipt.totalamount) : 0), 0);
  }

  async totalDuration(year: number): Promise<number> {
    const bookings = await this.prisma.court_booking.findMany({
      where: {
        bookings: {
          createdat: {
            gte: new Date(`${year}-01-01T00:00:00Z`),
            lt: new Date(`${year + 1}-01-01T00:00:00Z`),
          },
        },
      },
      select: {
        duration: true,
      },
    });
    return bookings.reduce((acc, booking) => acc + Number(booking.duration ?? 0), 0);
  }

  async getTopCourtsByBookingCount(year: number) {
    const courts = await this.prisma.court_booking.groupBy({
      by: ['courtid'],
      where: {
        bookings: {
          createdat: {
            gte: new Date(`${year}-01-01T00:00:00Z`),
            lt: new Date(`${year + 1}-01-01T00:00:00Z`),
          },
        },
      },
      _count: {
        courtid: true,
      },
      orderBy: {
        _count: {
          courtid: 'desc',
        },
      },
      take: 10,
    });

    const courtDetails = await Promise.all(
      courts.map(async (court) => {
        const courtInfo = await this.prisma.courts.findUnique({
          where: {
            courtid: court.courtid || 0,
          },
          select: {
            courtname: true,
          },
        });

        if (!courtInfo) {
          return {
            courtname: 'Unknown Court',
            numberBooking: court._count.courtid || 0,
          };
        }

        return {
          courtname: courtInfo.courtname,
          numberBooking: court._count.courtid || 0,
        };
      })
    );

    return courtDetails;
  }

  async getZoneRevenueByMonth(year: number) {
    // Get all zones
    const zones = await this.prisma.zones.findMany({
      select: { zoneid: true, zonename: true }
    });
    // Only use zones with non-null, non-undefined names
    const validZones = zones.filter(z => typeof z.zonename === 'string' && z.zonename);
    // Prepare result: array of 12 months, each with zone revenue
    const result = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const monthObj: Record<string, any> = { month };
      for (const zone of validZones) {
        monthObj[zone.zonename!] = 0;
      }
      return monthObj;
    });
    // Get all receipts in the year, with booking -> court_booking -> court -> zone
    const receipts = await this.prisma.receipts.findMany({
      where: {
        createdat: {
          gte: new Date(`${year}-01-01T00:00:00Z`),
          lt: new Date(`${year + 1}-01-01T00:00:00Z`),
        },
      },
      select: {
        totalamount: true,
        createdat: true,
        bookingid: true,
        bookings: {
          select: {
            court_booking: {
              select: {
                courtid: true,
                courts: {
                  select: {
                    zoneid: true,
                    zones: { select: { zonename: true } },
                  },
                },
              },
            },
          },
        },
      },
    });
    // For each receipt, assign revenue to the correct month and zone
    for (const receipt of receipts) {
      if (!receipt.createdat) continue;
      const month = (receipt.createdat.getMonth() + 1);
      const courtBookings = receipt.bookings?.court_booking || [];
      // For each unique zone in this receipt, split revenue equally
      const validZoneNames = validZones.map(z => z.zonename!);
      const zoneNames = Array.from(new Set(courtBookings.map(cb => cb.courts?.zones?.zonename).filter((z): z is string => !!z && validZoneNames.includes(z))));
      if (zoneNames.length === 0) continue;
      const revenuePerZone = Number(receipt.totalamount || 0) / zoneNames.length;
      for (const zoneName of zoneNames) {
        if (!zoneName) continue;
        result[month - 1][zoneName] += revenuePerZone;
      }
    }
    return result;
  }

  async countNewCustomersByYear(year: number): Promise<number> {
    return this.prisma.accounts.count({
      where: {
        accounttype: 'Customer',
        createdat: {
          gte: new Date(`${year}-01-01T00:00:00Z`),
          lt: new Date(`${year + 1}-01-01T00:00:00Z`),
        },
      },
    });
  }

  async getBookingCountByTimeSlotPerMonth(year: number) {
    // Định nghĩa các khung giờ cố định
    const timeSlots = [
      { label: '06:00 - 09:00', from: '06:00', to: '09:00' },
      { label: '09:00 - 12:00', from: '09:00', to: '12:00' },
      { label: '12:00 - 18:00', from: '12:00', to: '18:00' },
      { label: '18:00 - 22:00', from: '18:00', to: '22:00' },
    ];
    // Lấy tất cả court_booking trong năm
    const bookings = await this.prisma.court_booking.findMany({
      where: {
        date: {
          gte: new Date(`${year}-01-01T00:00:00Z`),
          lt: new Date(`${year + 1}-01-01T00:00:00Z`),
        },
      },
      select: {
        starttime: true,
        endtime: true,
      },
    });
    // Chuẩn bị kết quả: mảng 12 tháng, mỗi tháng là object với các slot
    const result = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const obj: any = { month };
      for (const slot of timeSlots) {
        obj[slot.label] = 0;
      }
      return obj;
    });
    for (const booking of bookings) {
      if (!booking.starttime || !booking.endtime) continue;
      const month = booking.starttime.getMonth(); // 0-based
      const bookingStart = booking.starttime;
      const bookingEnd = booking.endtime;
      // Chuyển bookingStart và bookingEnd sang HH:mm
      const startHour = bookingStart.getHours();
      const startMinute = bookingStart.getMinutes();
      const endHour = bookingEnd.getHours();
      const endMinute = bookingEnd.getMinutes();
      const bookingStartHM = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
      const bookingEndHM = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
      for (const slot of timeSlots) {
        if (bookingStartHM < slot.to && bookingEndHM > slot.from) {
          result[month][slot.label]++;
        }
      }
    }
    return result;
  }

  async getProductSalesAndRentalsByMonth(year: number) {
    // Lấy tất cả order_product trong năm, join với orders để lấy orderdate
    const orderProducts = await this.prisma.order_product.findMany({
      include: {
        orders: true,
      },
      where: {
        orders: {
          orderdate: {
            gte: new Date(`${year}-01-01T00:00:00Z`),
            lt: new Date(`${year + 1}-01-01T00:00:00Z`),
          },
        },
      },
    });
    // Chuẩn bị kết quả: mảng 12 tháng
    const result = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, sales: 0, rentals: 0 }));
    for (const op of orderProducts) {
      if (!op.orders || !op.orders.orderdate) continue;
      const orderMonth = op.orders.orderdate.getMonth(); // 0-based
      if (op.returndate) {
        result[orderMonth].rentals += op.quantity ?? 1;
      } else {
        result[orderMonth].sales += op.quantity ?? 1;
      }
    }
    return result;
  }

  async getTop10BestSellingProducts(year: number) {
    // Group by productid, chỉ tính sản phẩm bán (returndate=null) và orders trong năm
    const grouped = await this.prisma.order_product.groupBy({
      by: ['productid'],
      where: {
        returndate: null,
        orders: {
          orderdate: {
            gte: new Date(`${year}-01-01T00:00:00Z`),
            lt: new Date(`${year + 1}-01-01T00:00:00Z`),
          },
        },
      },
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 10,
    });
    // Lấy tên sản phẩm
    const result = await Promise.all(grouped.map(async (item) => {
      const product = await this.prisma.products.findUnique({
        where: { productid: item.productid },
        select: { productname: true },
      });
      return {
        productid: item.productid,
        productname: product?.productname || 'Unknown',
        totalSold: item._sum.quantity ?? 0,
      };
    }));
    return result;
  }

  async getTop10MostRentedProducts(year: number) {
    // Group by productid, chỉ tính sản phẩm cho thuê (returndate != null) và orders trong năm
    const grouped = await this.prisma.order_product.groupBy({
      by: ['productid'],
      where: {
        returndate: {
          not: null,
        },
        orders: {
          orderdate: {
            gte: new Date(`${year}-01-01T00:00:00Z`),
            lt: new Date(`${year + 1}-01-01T00:00:00Z`),
          },
        },
      },
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 10,
    });
    // Lấy tên sản phẩm
    const result = await Promise.all(grouped.map(async (item) => {
      const product = await this.prisma.products.findUnique({
        where: { productid: item.productid },
        select: { productname: true },
      });
      return {
        productid: item.productid,
        productname: product?.productname || 'Unknown',
        totalRented: item._sum.quantity ?? 0,
      };
    }));
    return result;
  }

  /**
   * Trả về tỉ lệ khách hàng mới trong năm = số khách hàng mới / tổng số khách hàng (tính đến hết năm đó)
   */
  async getNewCustomerRateByYear(year: number) {
    // Số khách hàng mới trong năm
    const newCustomers = await this.prisma.accounts.count({
      where: {
        accounttype: 'Customer',
        createdat: {
          gte: new Date(`${year}-01-01T00:00:00Z`),
          lt: new Date(`${year + 1}-01-01T00:00:00Z`),
        },
      },
    });
    // Tổng số khách hàng tính đến hết năm đó
    const totalCustomers = await this.prisma.accounts.count({
      where: {
        accounttype: 'Customer',
        createdat: {
          lt: new Date(`${year + 1}-01-01T00:00:00Z`),
        },
      },
    });
    // Tỉ lệ
    const rate = totalCustomers === 0 ? 0 : newCustomers / totalCustomers;
    return { year, newCustomers, totalCustomers, rate };
  }
}