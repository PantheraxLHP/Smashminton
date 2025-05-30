import { Injectable } from '@nestjs/common';
import PayOS from '@payos/node';
import { cacheOrderDTO } from '../orders/dto/create-cache-order.dto';
import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';
import { paymentData } from 'src/interfaces/payment.interface';
import { OrdersService } from '../orders/orders.service';
import { BookingsService } from '../bookings/bookings.service';
import { CreateBookingDto } from '../bookings/dto/create-booking.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from '../orders/dto/create-order.dto';
import { CacheService } from '../cache/cache.service';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { Booking } from 'src/interfaces/bookings.interface';
import { Order } from 'src/interfaces/orders.interface';
import { query } from 'express';

@Injectable()
export class PaymentService {
    private readonly payOS: any;

    constructor(
        private readonly configService: ConfigService,
        private ordersService: OrdersService,
        private bookingsService: BookingsService,
        private prisma: PrismaService,
        private cacheService: CacheService,
    ) {
        // Khởi tạo PayOS với các thông tin từ biến môi trường
        this.payOS = new PayOS(
            this.configService.get<string>('PAYOS_CLIENT_ID', ''),
            this.configService.get<string>('PAYOS_API_KEY', ''),
            this.configService.get<string>('PAYOS_CHECKSUM_KEY', ''),
        );
    }
    async createMomoPaymentLink(paymentData: paymentData): Promise<any> {
        const accessKey = this.configService.get<string>('MOMO_ACCESS_KEY', '');
        const secretKey = this.configService.get<string>('MOMO_SECRET_KEY', '');
        const partnerCode = this.configService.get<string>('MOMO_PARTNER_CODE', 'MOMO');

        const DOMAIN = this.configService.get<string>('CLIENT', '');
                const queryParams = new URLSearchParams({
            userId: paymentData.userId || '',
            userName: paymentData.userName || '',
            paymentMethod: paymentData.paymentMethod || '',
            ...(paymentData.guestPhoneNumber && { guestPhoneNumber: paymentData.guestPhoneNumber }),
            ...(paymentData.voucherId && { voucherId: paymentData.voucherId }),
            totalAmount: paymentData.totalAmount ? String(paymentData.totalAmount) : '0',
        });
        const redirectUrl = `${DOMAIN}/payment/success?${queryParams.toString()}`;

        const server_domain = this.configService.get<string>('SERVER', '');
        const ipnUrl =
            'https://c904-2402-800-6371-704a-89ef-92be-7d07-74e2.ngrok-free.app/api/v1/payment/momo/ipn';  
            `${server_domain}/api/v1/payment/momo/ipn`; // URL nhận thông báo từ MoMo

        const orderId = partnerCode + new Date().getTime();
        const requestId = orderId;
        const orderInfo = 'Pay with MoMo';
        const requestType = 'payWithMethod';
        const extraData = '';
        const autoCapture = true;
        const lang = 'vi';

        const rawSignature = `accessKey=${accessKey}&amount=${paymentData.totalAmount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
        const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

        const requestBody = {
            partnerCode,
            partnerName: 'Test',
            storeId: 'MomoTestStore',
            requestId,
            amount: paymentData.totalAmount,
            orderId,
            orderInfo,
            redirectUrl,
            ipnUrl,
            lang,
            requestType,
            autoCapture,
            extraData,
            signature,
        };

        try {
            const response = await fetch('https://test-payment.momo.vn/v2/gateway/api/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const payUrl = data.payUrl;
            return payUrl;
        } catch (error) {
            console.error('Error creating MoMo payment link:', error);
            throw new Error('Failed to create MoMo payment link');
        }
    }

    async checkTransactionStatusMomo(orderId: string): Promise<any> {
        const accessKey = this.configService.get<string>('MOMO_ACCESS_KEY', '');
        const secretKey = this.configService.get<string>('MOMO_SECRET_KEY', '');
        const partnerCode = this.configService.get<string>('MOMO_PARTNER_CODE', '');

        const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${orderId}`;
        const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

        const requestBody = {
            partnerCode,
            orderId,
            requestId: orderId,
            signature,
            lang: 'vi',
        };

        try {
            const response = await fetch('https://test-payment.momo.vn/v2/gateway/api/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error checking MoMo transaction status:', error);
            throw new Error('Failed to check MoMo transaction status');
        }
    }

    async handleMomoIPN(data: any): Promise<any> {
        try {
            // const secretKey = this.configService.get<string>('MOMO_SECRET_KEY', '');

            // // Tạo raw signature từ dữ liệu IPN
            // const rawSignature = `amount=${data.amount}&extraData=${data.extraData}&message=${data.message}&orderId=${data.orderId}&orderInfo=${data.orderInfo}&orderType=${data.orderType}&partnerCode=${data.partnerCode}&payType=${data.payType}&requestId=${data.requestId}&responseTime=${data.responseTime}&resultCode=${data.resultCode}&transId=${data.transId}`;
            // const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

            // // Kiểm tra chữ ký
            // if (signature !== data.signature) {
            //     throw new Error('Invalid signature');
            // }

            console.log('IPN data received and verified:', data);

            // Thực hiện các xử lý cần thiết
            // Ví dụ: cập nhật trạng thái giao dịch trong cơ sở dữ liệu
            // await this.updateTransactionStatus(data.orderId, data.resultCode);

            return {
                status: 'OK',
                message: 'IPN processed successfully',
                data: data,
            };
        } catch (error) {
            console.error('Error processing IPN:', error);
            throw new Error('Failed to process IPN');
        }
    }

    async createPayOSPaymentLink(paymentData: paymentData): Promise<string> {
        const DOMAIN = this.configService.get<string>('CLIENT', '');
        // Tạo query parameters từ paymentData
        const queryParams = new URLSearchParams({
            userId: paymentData.userId || '',
            userName: paymentData.userName || '',
            paymentMethod: paymentData.paymentMethod || '',
            ...(paymentData.guestPhoneNumber && { guestPhoneNumber: paymentData.guestPhoneNumber }),
            ...(paymentData.voucherId && { voucherId: paymentData.voucherId }),
            totalAmount: paymentData.totalAmount ? String(paymentData.totalAmount) : '0',
        });
        const body = {
            orderCode: Number(String(Date.now()).slice(-6)),
            description: `Payment for ${paymentData.userName}`,
            amount: (paymentData.totalAmount ?? 0) / 100,
            returnUrl: `${DOMAIN}/payment/success?${queryParams.toString()}`,
            cancelUrl: `${DOMAIN}/payment/fail`,
        };

        try {
            const paymentLinkResponse = await this.payOS.createPaymentLink(body);
            console.log(queryParams.toString());
            return paymentLinkResponse.checkoutUrl; // Trả về URL thanh toán
        } catch (error) {
            console.error('Error creating payment link:', error);
            throw new Error('Failed to create payment link');
        }
    }

    async createReciept(createReceiptDto: CreateReceiptDto): Promise<any> {
        const { paymentmethod, totalamount, orderid, bookingid } = createReceiptDto;

        // Kiểm tra các trường bắt buộc
        if (!paymentmethod || !totalamount) {
            throw new Error('Payment method and total amount are required');
        }

        // Tạo đối tượng biên lai
        const receipt = {
            paymentmethod,
            totalamount,
            orderid: orderid ? Number(orderid) : null,
            bookingid: bookingid ? Number(bookingid) : null,
        };

        return this.prisma.receipts.create({
            data: receipt,
        });
    }

    async handleSuccessfulPayment(
        paymentData: paymentData
    ): Promise<any> {
        const account = await this.prisma.accounts.findUnique({
            where: { accountid: Number(paymentData.userId) },
        });
        if (!account) {
            throw new Error('Account not found');
        }
        const accounttype = account?.accounttype || '';

        let bookingTotalPrice = 0;
        let orderTotalPrice = 0;

        const bookingCache = await this.cacheService.getBooking(paymentData.userName);
        if (bookingCache)
            bookingTotalPrice = bookingCache?.totalprice || 0;

        const orderCache = await this.cacheService.getOrder(paymentData.userName);
        if (orderCache)
            orderTotalPrice = orderCache?.totalprice || 0;

        // Explicitly type booking and order to avoid 'never' type errors
        let booking: Booking | null = null;
        let order: Order | null = null;
        if (accounttype === 'Customer') {
            // Xử lý booking
            if (bookingTotalPrice > 0) {
                const createBookingDto: CreateBookingDto = {
                    totalprice: bookingTotalPrice,
                    customerid: Number(paymentData.userId),
                    voucherid: paymentData.voucherId ? Number(paymentData.voucherId) : undefined,
                };
                booking = await this.bookingsService.addBookingToDatabase(createBookingDto);
                await this.cacheService.deleteBooking(paymentData.userName);
            }
            // Xử lý order
            if (orderTotalPrice > 0) {
                const createOrderDto: CreateOrderDto = {
                    totalprice: orderTotalPrice,
                    customerid: Number(paymentData.userId),
                };
                order = await this.ordersService.addOrderToDatabase(createOrderDto);
                await this.cacheService.deleteOrder(paymentData.userName);
            }
        } else if (accounttype === 'Employee') {
            // Xử lý booking
            if (bookingTotalPrice > 0) {
                const createBookingDto: CreateBookingDto = {
                    totalprice: bookingTotalPrice,
                    employeeid: Number(paymentData.userId),
                    voucherid: paymentData.voucherId ? Number(paymentData.voucherId) : undefined,
                };
                booking = await this.bookingsService.addBookingToDatabase(createBookingDto);
                await this.cacheService.deleteBooking(paymentData.userName);
            }
            // Xử lý order
            if (orderTotalPrice > 0) {
                const createOrderDto: CreateOrderDto = {
                    totalprice: orderTotalPrice,
                    employeeid: Number(paymentData.userId),
                };
                order = await this.ordersService.addOrderToDatabase(createOrderDto);
                await this.cacheService.deleteOrder(paymentData.userName);
            }
        }

        // Tạo biên lai
        const createReceiptDto: CreateReceiptDto = {
            paymentmethod: paymentData.paymentMethod || '',
            totalamount: paymentData.totalAmount || 0,
            orderid: order ? order.orderid : undefined,
            bookingid: booking ? booking.bookingid : undefined,
        };

        return this.createReciept(createReceiptDto);
    }
}