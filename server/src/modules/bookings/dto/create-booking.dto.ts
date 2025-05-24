import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiPropertyOptional({ example: '0987654321', description: 'Số điện thoại khách' })
  guestphone?: string;

  @ApiPropertyOptional({ example: '2025-05-25T10:00:00Z', description: 'Ngày đặt lịch', type: String, format: 'date-time' })
  bookingdate?: Date;

  @ApiPropertyOptional({ example: 500000, description: 'Tổng giá tiền' })
  totalprice?: number;

  @ApiPropertyOptional({ example: 'pending', description: 'Trạng thái đặt lịch' })
  bookingstatus?: string;

  @ApiPropertyOptional({ example: 1, description: 'ID nhân viên' })
  employeeid?: number;

  @ApiPropertyOptional({ example: 2, description: 'ID khách hàng' })
  customerid?: number;

  @ApiPropertyOptional({ example: 3, description: 'ID voucher' })
  voucherid?: number;
}