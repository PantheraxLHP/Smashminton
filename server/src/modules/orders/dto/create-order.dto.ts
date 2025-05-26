import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderDto {
    @ApiPropertyOptional({
        example: 500000,
        description: 'Tổng giá tiền'
    })
    totalprice?: number;

    @ApiPropertyOptional({
        example: '2025-05-25T10:00:00Z',
        description: 'Ngày đặt lịch',
        type: String,
        format: 'date-time'
    })
    orderdate?: Date;

    @ApiPropertyOptional({
        example: 1,
        description: 'ID nhân viên xử lý',
    })
    employeeid?: number;

    @ApiPropertyOptional({
        example: 15,
        description: 'ID khách hàng',
    })
    customerid?: number;
}