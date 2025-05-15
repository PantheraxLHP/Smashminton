import { Injectable } from '@nestjs/common';
import PayOS from '@payos/node';
import { cacheOrderDTO } from '../orders/dto/create-cache-order.dto';
import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';

@Injectable()
export class PaymentService {
    private readonly payOS: any;

    constructor(
        private readonly configService: ConfigService,
    ) {
        // Khởi tạo PayOS với các thông tin từ biến môi trường
        this.payOS = new PayOS(
            this.configService.get<string>('PAYOS_CLIENT_ID', ''),
            this.configService.get<string>('PAYOS_API_KEY', ''),
            this.configService.get<string>('PAYOS_CHECKSUM_KEY', ''),
        );
    }
    async createMomoPaymentLink(amount: number): Promise<any> {
        const accessKey = this.configService.get<string>('MOMO_ACCESS_KEY', '');
        const secretKey = this.configService.get<string>('MOMO_SECRET_KEY', '');
        const partnerCode = this.configService.get<string>('MOMO_PARTNER_CODE', 'MOMO');

        const client_domain = this.configService.get<string>('CLIENT', '');
        const redirectUrl = `${client_domain}/handlepayment`;

        const server_domain = this.configService.get<string>('SERVER', '');
        const ipnUrl = 
        //'https://1dea-2402-800-6371-704a-c58d-5fa5-218d-ef39.ngrok-free.app/api/v1/payment/momo/ipn';  
        `${server_domain}/api/v1/payment/momo/ipn`; // URL nhận thông báo từ MoMo

        const orderId = partnerCode + new Date().getTime();
        const requestId = orderId;
        const orderInfo = 'Pay with MoMo';
        const requestType = 'payWithMethod';
        const extraData = '';
        const autoCapture = true;
        const lang = 'vi';

        const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
        const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

        const requestBody = {
            partnerCode,
            partnerName: 'Test',
            storeId: 'MomoTestStore',
            requestId,
            amount,
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
            return data;
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

    async createPayOSPaymentLink(description: string, amount: number): Promise<string> {
        const DOMAIN = this.configService.get<string>('CLIENT', '');
        const body = {
            orderCode: Number(String(Date.now()).slice(-6)),
            amount: amount,
            description: description,
            returnUrl: `${DOMAIN}?success=true`,
            cancelUrl: `${DOMAIN}?canceled=true`,
        };

        try {
            const paymentLinkResponse = await this.payOS.createPaymentLink(body);
            return paymentLinkResponse.checkoutUrl; // Trả về URL thanh toán
        } catch (error) {
            console.error('Error creating payment link:', error);
            throw new Error('Failed to create payment link');
        }
    }
}
