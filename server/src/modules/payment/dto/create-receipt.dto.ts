import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReceiptDto {
    @ApiPropertyOptional({
        example: 'payos',
        description: 'Phương thức thanh toán (payos, momo, cash, bank_transfer)'
    })
    paymentmethod?: string;

    @ApiPropertyOptional({
        example: 250000,
        description: 'Tổng số tiền thanh toán'
    })
    totalamount?: number;

    @ApiPropertyOptional({
        example: 1,
        description: 'ID đơn hàng (dành cho thanh toán sản phẩm)'
    })
    orderid?: number;

    @ApiPropertyOptional({
        example: 2,
        description: 'ID booking (dành cho thanh toán đặt sân)'
    })
    bookingid?: number;
}