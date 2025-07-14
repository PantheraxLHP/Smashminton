import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PredictionService } from './prediction.service';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { Public } from 'src/decorators/public.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly predictionService: PredictionService
  ) { }

  @Get('dashboard/revenue/:year')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiParam({ name: 'year', description: 'Year for which to get total revenue', type: String })
  @ApiResponse({ status: 200, description: 'Total revenue for the year' })
  @ApiResponse({ status: 400, description: 'Invalid year format' })
  async getTotalRevenue(@Param('year') year: string) {
    return this.dashboardService.totalRevenue(+year);
  }

  @Get('dashboard/duration/:year')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiParam({ name: 'year', description: 'Year for which to get total duration', type: String })
  @ApiResponse({ status: 200, description: 'Total duration for the year' })
  @ApiResponse({ status: 400, description: 'Invalid year format' })
  async getTotalDuration(@Param('year') year: string) {
    return this.dashboardService.totalDuration(+year);
  }

  @Get('dashboard/top-courts/:year')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiParam({ name: 'year', description: 'Year for which to get top courts by booking count', type: String })
  @ApiResponse({ status: 200, description: 'Top courts by booking count for the year' })
  @ApiResponse({ status: 400, description: 'Invalid year format' })
  async getTopCourtsByBookingCount(@Param('year') year: string) {
    return this.dashboardService.getTopCourtsByBookingCount(+year);
  }

  @Get('dashboard/zone-revenue/:year')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiParam({ name: 'year', description: 'Year for which to get zone revenue by month', type: String })
  @ApiResponse({ status: 200, description: 'Zone revenue by month for the year' })
  @ApiResponse({ status: 400, description: 'Invalid year format' })
  async getZoneRevenueByMonth(@Param('year') year: string) {
    return this.dashboardService.getZoneRevenueByMonth(+year);
  }

  @Get('dashboard/new-customers/:year')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiParam({ name: 'year', description: 'Year for which to count new customers', type: String })
  @ApiResponse({ status: 200, description: 'Number of new customers for the year' })
  @ApiResponse({ status: 400, description: 'Invalid year format' })
  async countNewCustomersByYear(@Param('year') year: string) {
    return this.dashboardService.countNewCustomersByYear(+year);
  }

  @Get('dashboard/booking-count-timeslot/:year')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiParam({ name: 'year', description: 'Year for which to get booking count by time slot per month', type: String })
  @ApiResponse({ status: 200, description: 'Booking count by time slot per month for the year' })
  @ApiResponse({ status: 400, description: 'Invalid year format' })
  async getBookingCountByTimeSlotPerMonth(@Param('year') year: string) {
    return this.dashboardService.getBookingCountByTimeSlotPerMonth(+year);
  }

  @Get('dashboard/product-sales-rentals/:year')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiParam({ name: 'year', description: 'Year for which to get product sales and rentals by month', type: String })
  @ApiResponse({ status: 200, description: 'Product sales and rentals by month for the year' })
  @ApiResponse({ status: 400, description: 'Invalid year format' })
  async getProductSalesAndRentalsByMonth(@Param('year') year: string) {
    return this.dashboardService.getProductSalesAndRentalsByMonth(+year);
  }

  @Get('dashboard/top-products/:year')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiParam({ name: 'year', description: 'Year for which to get top 10 best selling products', type: String })
  @ApiResponse({ status: 200, description: 'Top 10 best selling products for the year' })
  @ApiResponse({ status: 400, description: 'Invalid year format' })
  async getTop10BestSellingProducts(@Param('year') year: string) {
    return this.dashboardService.getTop10BestSellingProducts(+year);
  }

  @Get('dashboard/top-rented-products/:year')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiParam({ name: 'year', description: 'Year for which to get top 10 most rented products', type: String })
  @ApiResponse({ status: 200, description: 'Top 10 most rented products for the year' })
  @ApiResponse({ status: 400, description: 'Invalid year format' })
  async getTop10MostRentedProducts(@Param('year') year: string) {
    return this.dashboardService.getTop10MostRentedProducts(+year);
  }

  @Get('dashboard/new-customer-rate/:year')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiParam({ name: 'year', description: 'Year for which to get new customer rate', type: String })
  @ApiResponse({ status: 200, description: 'New customer rate for the year' })
  @ApiResponse({ status: 400, description: 'Invalid year format' })
  async getNewCustomerRateByYear(@Param('year') year: string) {
    const result = await this.dashboardService.getNewCustomerRateByYear(+year);
    return result.rate * 100;
  }

  @Get('prediction/sold-ratio-by-filter-value')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiQuery({ name: 'type', description: 'Type of filter', type: String, required: false, example: 'month' })
  @ApiQuery({ name: 'month', description: 'Month of filter', type: Number, required: false, example: 1 })
  @ApiQuery({ name: 'quarter', description: 'Quarter of filter', type: Number, required: false, example: 1 })
  @ApiQuery({ name: 'year', description: 'Year of filter', type: Number, required: true, example: 2024 })
  @ApiResponse({ status: 200, description: 'Sold ratio by filter value' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async getSoldRatioByFilterValue(
    @Query('type') type: string,
    @Query('month') month?: number,
    @Query('quarter') quarter?: number,
    @Query('year') year?: number,
  ) {
    if (type !== 'month' && type !== 'quarter') {
      throw new BadRequestException("Type must be either 'month' or 'quarter'");
    }
    if (type === 'month') {
      if (!month || isNaN(Number(month)) || Number(month) < 1 || Number(month) > 12) {
        throw new BadRequestException('If type is month, month must be provided and in range 1-12');
      }
    }
    if (type === 'quarter') {
      if (!quarter || isNaN(Number(quarter)) || Number(quarter) < 1 || Number(quarter) > 4) {
        throw new BadRequestException('If type is quarter, quarter must be provided and in range 1-4');
      }
    }
    return this.predictionService.getSoldRatioByFilterValue({
      type: type as 'month' | 'quarter',
      month: month ? +month : undefined,
      quarter: quarter ? +quarter : undefined,
      year: year ? +year : undefined,
    });
  }

  @Get('prediction/purchased-ratio-by-filter-value')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiQuery({ name: 'type', description: 'Type of filter', type: String, required: false, example: 'month' })
  @ApiQuery({ name: 'month', description: 'Month of filter', type: Number, required: false, example: 1 })
  @ApiQuery({ name: 'quarter', description: 'Quarter of filter', type: Number, required: false })
  @ApiQuery({ name: 'year', description: 'Year of filter', type: Number, required: true, example: 2025 })
  @ApiResponse({ status: 200, description: 'Purchased ratio by filter value' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async getPurchasedRatioByFilterValue(
    @Query('type') type: 'month' | 'quarter',
    @Query('month') month?: string,
    @Query('quarter') quarter?: string,
    @Query('year') year?: string,
  ) {
    if (!year) throw new BadRequestException('Missing required parameter: year');
    if (type !== 'month' && type !== 'quarter') {
      throw new BadRequestException("Type must be either 'month' or 'quarter'");
    }
    if (type === 'month') {
      if (!month || isNaN(Number(month)) || Number(month) < 1 || Number(month) > 12) {
        throw new BadRequestException('If type is month, month must be provided and in range 1-12');
      }
    }
    if (type === 'quarter') {
      if (!quarter || isNaN(Number(quarter)) || Number(quarter) < 1 || Number(quarter) > 4) {
        throw new BadRequestException('If type is quarter, quarter must be provided and in range 1-4');
      }
    }
    return this.predictionService.getPurchasedRatioByFilterValue({
      type,
      month: month ? +month : undefined,
      quarter: quarter ? +quarter : undefined,
      year: +year,
    });
  }

  @Get('prediction/sales-purchase-by-filter-value')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiQuery({ name: 'type', description: 'Type of filter', type: String, required: false, example: 'month' })
  @ApiQuery({ name: 'month', description: 'Month of filter', type: Number, required: false, example: 1 })
  @ApiQuery({ name: 'quarter', description: 'Quarter of filter', type: Number, required: false })
  @ApiQuery({ name: 'year', description: 'Year of filter', type: Number, required: true, example: 2025 })
  @ApiResponse({ status: 200, description: 'Sales and purchase by filter value' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async getSalesAndPurchaseByFilterValue(
    @Query('type') type: 'month' | 'quarter',
    @Query('month') month?: string,
    @Query('quarter') quarter?: string,
    @Query('year') year?: string,
  ) {
    if (!year) throw new BadRequestException('Missing required parameter: year');
    if (type !== 'month' && type !== 'quarter') {
      throw new BadRequestException("Type must be either 'month' or 'quarter'");
    }
    if (type === 'month') {
      if (!month || isNaN(Number(month)) || Number(month) < 1 || Number(month) > 12) {
        throw new BadRequestException('If type is month, month must be provided and in range 1-12');
      }
    }
    if (type === 'quarter') {
      if (!quarter || isNaN(Number(quarter)) || Number(quarter) < 1 || Number(quarter) > 4) {
        throw new BadRequestException('If type is quarter, quarter must be provided and in range 1-4');
      }
    }
    return this.predictionService.getSalesAndPurchaseByFilterValue({
      type,
      month: month ? +month : undefined,
      quarter: quarter ? +quarter : undefined,
      year: +year,
    });
  }

  @Get('prediction/train-bestseller-model')
  @Public()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Train bestseller models (month & quarter) and return training info' })
  @ApiResponse({ status: 400, description: 'Failed to train bestseller model' })
  async trainBestsellerModel() {
    return this.predictionService.trainBestsellerModel();
  }

  @Get('prediction/predict-bestseller-by-time')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Predict bestseller by time' })
  @ApiResponse({ status: 400, description: 'Failed to predict bestseller by time' })
  @ApiQuery({ name: 'filter_type', description: 'Filter type', type: String, required: true, example: 'month' })
  @ApiQuery({ name: 'value', description: 'Value', type: Number, required: true, example: 1 })
  async predictBestsellerByTime(@Query('filter_type') filter_type: 'month' | 'quarter', @Query('value') value: number) {
    if (filter_type === 'month' && (value < 1 || value > 12)) {
      throw new BadRequestException('For month, value must be between 1 and 12');
    }
    if (filter_type === 'quarter' && (value < 1 || value > 4)) {
      throw new BadRequestException('For quarter, value must be between 1 and 4');
    }
    return this.predictionService.predictBestsellerByTime({ filter_type, value });
  }
}
