import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { PaymentService } from './payment.service';
import { cacheOrderDTO } from '../orders/dto/create-cache-order.dto';
import { ApiOperation, ApiParam, ApiProperty, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMomoPaymentDto } from './dto/create-payment.dto';
import { paymentData } from 'src/interfaces/payment.interface';
import { stat } from 'fs';

@ApiTags('Payment')
@Controller('payment')
export class PaymentsController {
	constructor(private readonly paymentsService: PaymentService) { }

	@Post('success-payment')
	@ApiOperation({ summary: 'Handle successful payment', description: 'Process successful payment and create order, booking, receipt' })
	@ApiResponse({ status: 201, description: 'Payment processed successfully' })
	@ApiResponse({ status: 400, description: 'Bad request' })
	@ApiQuery({ name: 'userId', required: true, description: 'User ID', example: '15' })
	@ApiQuery({ name: 'userName', required: true, description: 'User name', example: 'nguyenvun' })
	@ApiQuery({ name: 'paymentMethod', required: true, description: 'Payment method', example: 'payos' })
	@ApiQuery({ name: 'totalAmount', required: true, description: 'Total amount', example: 750000 })
	@ApiQuery({ name: 'guestPhoneNumber', required: false, description: 'Guest phone number', example: null })
	@ApiQuery({ name: 'voucherId', required: false, description: 'Voucher ID', example: 1 })
	@ApiQuery({ name: 'status', required: false, description: 'Status of the transaction', example: 'PAID' })
	async handleSuccessfulPayment(
		@Query('userId') userId: string,
		@Query('userName') userName: string,
		@Query('paymentMethod') paymentMethod: string,
		@Query('totalAmount') totalAmount: number,
		@Query('guestPhoneNumber') guestPhoneNumber?: string,
		@Query('voucherId') voucherId?: string,
		@Query('status') status?: string
	) {
		if (status !== 'PAID') {
			throw new Error('Payment status must be PAID');
		}
		const paymentData: paymentData = {
			userId,
			userName,
			paymentMethod,
			totalAmount: Number(totalAmount),
			guestPhoneNumber,
			voucherId,
		};

		return await this.paymentsService.handleSuccessfulPayment(paymentData);
	}

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

	@Post('payos/payment-link')
	@ApiOperation({ summary: 'Create payment link', description: 'Generate a payment link using PayOS' })
	@ApiResponse({ status: 201, description: 'Payment link created successfully' })
	@ApiResponse({ status: 400, description: 'Bad request' })
	@ApiQuery({ name: 'userId', required: true, description: 'User ID', example: '15' })
	@ApiQuery({ name: 'userName', required: true, description: 'User name', example: 'nguyenvun' })
	@ApiQuery({ name: 'guestPhoneNumber', required: false, description: 'Guest phone number', example: '0987654321' })
	@ApiQuery({ name: 'paymentMethod', required: true, description: 'Payment method', example: 'payos' })
	@ApiQuery({ name: 'voucherId', required: false, description: 'Voucher ID', example: '1' })
	@ApiQuery({ name: 'totalAmount', required: true, description: 'Total amount', example: 200000 })
	create(
		@Query('userId') userId: string,
		@Query('userName') userName: string,
		@Query('guestPhoneNumber') guestPhoneNumber?: string,
		@Query('paymentMethod') paymentMethod?: string,
		@Query('voucherId') voucherId?: string,
		@Query('totalAmount') totalAmount?: number
	) {
		if (!userId || !userName || !paymentMethod || !totalAmount) {
			throw new Error('Missing required query parameters');
		}
			const paymentData: paymentData = {
				userId,
				userName,
				guestPhoneNumber,
				paymentMethod,
				voucherId,
				totalAmount,
			};

			return this.paymentsService.createPayOSPaymentLink(paymentData);
		}
	}