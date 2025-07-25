import { Controller, Get, Post, Body, Param, Res, Query, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { PaymentService } from './payment.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { paymentData } from 'src/interfaces/payment.interface';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Public } from 'src/decorators/public.decorator';

@ApiTags('Payment')
@UseGuards(JwtAuthGuard)
@Controller('payment')
export class PaymentsController {
	constructor(private readonly paymentsService: PaymentService) { }

	@Post('success-payment')
	@ApiBearerAuth()
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
	@ApiParam({ name: 'resultCode', required: false, description: 'Status after payment', example: '00' })
	async handleSuccessfulPayment(
		@Query('userId') userId: string,
		@Query('userName') userName: string,
		@Query('paymentMethod') paymentMethod: string,
		@Query('totalAmount') totalAmount: number,
		@Query('guestPhoneNumber') guestPhoneNumber?: string,
		@Query('voucherId') voucherId?: string,
		@Query('status') status?: string,
		@Query('resultCode') resultCode?: string
	) {
		if (status && status !== 'PAID') {
			if (resultCode && resultCode !== '0') {
				throw new Error('Result code or Payment status is failed');
			}
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
	@ApiBearerAuth()
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
	@ApiBearerAuth()
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

	@Get('momo/callback')
	@Public() // Make this public as MoMo will call it directly
	@ApiOperation({ summary: 'Handle MoMo callback redirect', description: 'Process MoMo payment callback and redirect based on resultCode' })
	@ApiResponse({ status: 302, description: 'Redirect to success or fail page' })
	async momoCallback(@Query() query: any, @Res() res: Response) {
		try {
			// Extract original payment data from query params
			const originalParams = {
				userId: query.userId,
				userName: query.userName,
				paymentMethod: query.paymentMethod,
				guestPhoneNumber: query.guestPhoneNumber,
				voucherId: query.voucherId,
				totalAmount: query.totalAmount,
			};

			// Get the redirect URL based on resultCode
			const redirectUrl = await this.paymentsService.handleMomoCallback(query, originalParams);

			// Redirect user to the appropriate page
			return res.redirect(redirectUrl);
		} catch (error) {
			console.error('Error handling MoMo callback:', error);
			// In case of error, redirect to fail page
			const DOMAIN = process.env.CLIENT || 'http://localhost:3000';
			return res.redirect(`${DOMAIN}/payment/fail`);
		}
	}

	@Post('momo/payment-link')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Create MoMo payment link', description: 'Generate a payment link using MoMo' })
	@ApiResponse({ status: 200, description: 'Payment link created successfully' })
	@ApiResponse({ status: 500, description: 'Failed to create payment link' })
	@ApiResponse({ status: 400, description: 'Bad request' })
	@ApiQuery({ name: 'userId', required: true, description: 'User ID', example: '15' })
	@ApiQuery({ name: 'userName', required: true, description: 'User name', example: 'nguyenvun' })
	@ApiQuery({ name: 'guestPhoneNumber', required: false, description: 'Guest phone number', example: '0987654321' })
	@ApiQuery({ name: 'paymentMethod', required: true, description: 'Payment method', example: 'momo' })
	@ApiQuery({ name: 'voucherId', required: false, description: 'Voucher ID', example: '1' })
	@ApiQuery({ name: 'totalAmount', required: true, description: 'Total amount', example: 200000 })
	async createMomoPaymentLink(
		@Query('userId') userId: string,
		@Query('userName') userName: string,
		@Query('paymentMethod') paymentMethod: string,
		@Query('totalAmount') totalAmount: number,
		@Res() res: Response,
		@Query('guestPhoneNumber') guestPhoneNumber?: string,
		@Query('voucherId') voucherId?: string
	) {
		try {
			if (!userId || !userName || !paymentMethod || !totalAmount) {
				return res.status(400).json({
					status: 'ERROR',
					message: 'Missing required query parameters',
				});
			}

			const paymentData: paymentData = {
				userId,
				userName,
				guestPhoneNumber,
				paymentMethod,
				voucherId,
				totalAmount: Number(totalAmount),
			};

			const result = await this.paymentsService.createMomoPaymentLink(paymentData);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(500).json({
				status: 'ERROR',
				message: 'Failed to create MoMo payment link',
			});
		}
	}

	@Post('payos/payment-link')
	@ApiBearerAuth()
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

	@Get('receipt-detail-by-employee-or-customer')
	@ApiBearerAuth()
	@ApiQuery({ name: 'employeeid', required: false, type: Number, example: 2 })
	@ApiQuery({ name: 'customerid', required: false, type: Number, example: 16 })
	async getReceiptDetailByEmployeeOrCustomer(
		@Query('employeeid') employeeid?: number,
		@Query('customerid') customerid?: number,
	) {
		const empId = employeeid ? Number(employeeid) : null;
		const cusId = customerid ? Number(customerid) : null;
		if (!empId && !cusId) {
			return { message: 'Phải truyền vào employeeid hoặc customerid!' };
		}
		return this.paymentsService.getReceiptDetailByEmployeeOrCustomer(empId, cusId);
	}
}