import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PredictionService } from './prediction.service';
import { ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly predictionService: PredictionService
  ) { }

  @Get('dashboard/revenue/:year')
  @ApiParam({ name: 'year', description: 'Year for which to get total revenue', type: String })
  @ApiResponse({ status: 200, description: 'Total revenue for the year' })
  @ApiResponse({ status: 400, description: 'Invalid year format' })
  async getTotalRevenue(@Param('year') year: string) {
    return this.dashboardService.totalRevenue(+year);
  }

  @Get('dashboard/duration/:year')
  @ApiParam({ name: 'year', description: 'Year for which to get total duration', type: String })
  @ApiResponse({ status: 200, description: 'Total duration for the year' })
  @ApiResponse({ status: 400, description: 'Invalid year format' })
  async getTotalDuration(@Param('year') year: string) {
    return this.dashboardService.totalDuration(+year);
  }

  @Get('dashboard/top-courts/:year')
  @ApiParam({ name: 'year', description: 'Year for which to get top courts by booking count', type: String })
  @ApiResponse({ status: 200, description: 'Top courts by booking count for the year' })
  @ApiResponse({ status: 400, description: 'Invalid year format' })
  async getTopCourtsByBookingCount(@Param('year') year: string) {
    return this.dashboardService.getTopCourtsByBookingCount(+year);
  }

  @Get('dashboard/zone-revenue/:year')
  @ApiParam({ name: 'year', description: 'Year for which to get zone revenue by month', type: String })
  @ApiResponse({ status: 200, description: 'Zone revenue by month for the year' })
  @ApiResponse({ status: 400, description: 'Invalid year format' })
  async getZoneRevenueByMonth(@Param('year') year: string) {
    return this.dashboardService.getZoneRevenueByMonth(+year);
  }

  @Get('dashboard/new-customers/:year')
  @ApiParam({ name: 'year', description: 'Year for which to count new customers', type: String })
  @ApiResponse({ status: 200, description: 'Number of new customers for the year' })
  @ApiResponse({ status: 400, description: 'Invalid year format' })
  async countNewCustomersByYear(@Param('year') year: string) {
    return this.dashboardService.countNewCustomersByYear(+year);
  }

  @Get('dashboard/booking-count-timeslot/:year')
  @ApiParam({ name: 'year', description: 'Year for which to get booking count by time slot per month', type: String })
  @ApiResponse({ status: 200, description: 'Booking count by time slot per month for the year' })
  @ApiResponse({ status: 400, description: 'Invalid year format' })
  async getBookingCountByTimeSlotPerMonth(@Param('year') year: string) {
    return this.dashboardService.getBookingCountByTimeSlotPerMonth(+year);
  }

  @Get('dashboard/product-sales-rentals/:year')
  @ApiParam({ name: 'year', description: 'Year for which to get product sales and rentals by month', type: String })
  @ApiResponse({ status: 200, description: 'Product sales and rentals by month for the year' })
  @ApiResponse({ status: 400, description: 'Invalid year format' })
  async getProductSalesAndRentalsByMonth(@Param('year') year: string) {
    return this.dashboardService.getProductSalesAndRentalsByMonth(+year);
  }

  @Get('dashboard/top-products/:year')
  @ApiParam({ name: 'year', description: 'Year for which to get top 10 best selling products', type: String })
  @ApiResponse({ status: 200, description: 'Top 10 best selling products for the year' })
  @ApiResponse({ status: 400, description: 'Invalid year format' })
  async getTop10BestSellingProducts(@Param('year') year: string) {
    return this.dashboardService.getTop10BestSellingProducts(+year);
  }

  @Get('dashboard/top-rented-products/:year')
  @ApiParam({ name: 'year', description: 'Year for which to get top 10 most rented products', type: String })
  @ApiResponse({ status: 200, description: 'Top 10 most rented products for the year' })
  @ApiResponse({ status: 400, description: 'Invalid year format' })
  async getTop10MostRentedProducts(@Param('year') year: string) {
    return this.dashboardService.getTop10MostRentedProducts(+year);
  }

  @Get('dashboard/new-customer-rate/:year')
  @ApiParam({ name: 'year', description: 'Year for which to get new customer rate', type: String })
  @ApiResponse({ status: 200, description: 'New customer rate for the year' })
  @ApiResponse({ status: 400, description: 'Invalid year format' })
  async getNewCustomerRateByYear(@Param('year') year: string) {
    const result = await this.dashboardService.getNewCustomerRateByYear(+year);
    return result.rate * 100;
  }
}
