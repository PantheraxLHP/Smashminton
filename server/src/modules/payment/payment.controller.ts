import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { Response } from 'express';
import { PaymentService } from './payment.service';
import { cacheOrderDTO } from '../orders/dto/create-cache-order.dto';
import { ApiOperation, ApiParam, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMomoPaymentDto } from './dto/create-payment.dto';

@ApiTags('Payment')
@Controller('payment')
export class PaymentsController {
	constructor(private readonly paymentsService: PaymentService) { }

	@Post('momo/transaction-status/:orderId')
	@ApiOperation({ summary: 'Check MoMo transaction status', description: 'Check the status of a MoMo transaction using orderId' })
	@ApiResponse({ status: 200, description: 'Transaction status retrieved successfully' })
	@ApiResponse({ status: 500, description: 'Failed to check transaction status' })
	async checkTransactionStatusMomo(@Param('orderId') orderId: string, @Res() res: Response) {
		try {
			const result = await this.paymentsService.checkTransactionStatusMomo(orderId);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(500).json({
				status: 'ERROR',
				message: 'Failed to check transaction status',
			});
		}
	}

	@Post('momo/ipn')
	async momoIPN(@Body() body: any, @Res() res: Response) {
		try {
			console.log('Received MoMo IPN:', body);
			const result = await this.paymentsService.handleMomoIPN(body);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(500).json({
				status: 'ERROR',
				message: 'Failed to process IPN',
			});
		}
	}

	@Post('momo/payment-link/:amount')
	@ApiOperation({ summary: 'Create MoMo payment link', description: 'Generate a payment link using MoMo' })
	@ApiResponse({ status: 200, description: 'Payment link created successfully' })
	@ApiResponse({ status: 500, description: 'Failed to create payment link' })
	@ApiResponse({ status: 400, description: 'Bad request' })
	async createMomoPaymentLink(@Param('amount') amount: number, @Res() res: Response) {
		try {
			const result = await this.paymentsService.createMomoPaymentLink(amount);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(500).json({
				status: 'ERROR',
				message: 'Failed to create MoMo payment link',
			});
		}
	}

	@Post('payos/payment-link/:amount')
	@ApiOperation({ summary: 'Create payment link', description: 'Generate a payment link using PayOS' })
	@ApiResponse({ status: 201, description: 'Payment link created successfully' })
	@ApiResponse({ status: 400, description: 'Bad request' })
	@ApiParam({ name: 'amount', required: true, description: 'Amount to be paid', example: 2000 })
	create(@Param('amount') amount: number) {
		const description = 'Payment for order';
		return this.paymentsService.createPayOSPaymentLink(description, Number(amount));
	}
}