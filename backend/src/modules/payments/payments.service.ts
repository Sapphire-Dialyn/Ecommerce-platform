import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payments.dto';
import { PaymentMethod, PaymentStatus, OrderStatus } from '@prisma/client';
import * as crypto from 'crypto';
import { format } from 'date-fns';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  // Hàm sắp xếp cực chuẩn của VNPAY
  private buildVNPayQuery(params: Record<string, unknown>) {
    return Object.keys(params)
      .filter((key) => params[key] !== undefined && params[key] !== null && params[key] !== '')
      .sort()
      .map((key) => {
        const encodedKey = encodeURIComponent(key);
        const encodedValue = encodeURIComponent(String(params[key])).replace(/%20/g, '+');
        return `${encodedKey}=${encodedValue}`;
      })
      .join('&');
  }

  async create(dto: CreatePaymentDto, ipAddr: string = '127.0.0.1') {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
      include: { payment: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    let payment = order.payment;

    if (payment) {
      if (payment.status === PaymentStatus.SUCCESS) {
        throw new BadRequestException('Order is already paid');
      }
      if (payment.method !== dto.method) {
         payment = await this.prisma.payment.update({
            where: { id: payment.id },
            data: { method: dto.method }
         });
      }
    } else {
      payment = await this.prisma.payment.create({
        data: {
          orderId: dto.orderId,
          method: dto.method,
          status: PaymentStatus.PENDING,
          amount: order.totalAmount,
        },
      });
    }

    switch (dto.method) {
      case PaymentMethod.VNPAY:
        return this.createVNPayPayment(payment, order, ipAddr);
      case PaymentMethod.PAYPAL:
        return this.createPayPalPayment(payment, order);
      case PaymentMethod.COD:
        return this.createCODPayment(payment, order);
      default:
        throw new BadRequestException('Invalid payment method');
    }
  }

  private async createVNPayPayment(payment: any, order: any, ipAddr: string) {
    // Tự động tương thích cả 2 cách đặt tên biến VNP_ hoặc VNPAY_
    const tmnCode = (process.env.VNP_TMN_CODE || process.env.VNPAY_TMN_CODE)?.trim();
    const secretKey = (process.env.VNP_HASH_SECRET || process.env.VNPAY_HASH_SECRET)?.trim();
    const vnpUrl = (process.env.VNP_URL || process.env.VNPAY_URL)?.trim();
    const returnUrl = process.env.FRONTEND_URL 
        ? `${process.env.FRONTEND_URL}/payment/vnpay-return` 
        : 'http://localhost:3001/payment/vnpay-return';

    if (!tmnCode || !secretKey || !vnpUrl) {
        throw new BadRequestException('Lỗi hệ thống: Thiếu cấu hình VNPAY trong file .env');
    }

    const date = new Date();
    const createDate = format(date, 'yyyyMMddHHmmss');
    const txnRef = payment.id; 
    const amount = Math.round(order.totalAmount * 100);

    // Chặn lỗi IPv6 khiến VNPAY từ chối
    const cleanIpAddr = (ipAddr === '::1' || !ipAddr) ? '127.0.0.1' : ipAddr;

    const vnp_Params: Record<string, string | number> = {}; 
    
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_TxnRef'] = txnRef;
    // Bỏ dấu # để tránh lỗi encode của URL
    vnp_Params['vnp_OrderInfo'] = `Thanh_toan_don_hang_${order.id.slice(-8)}`;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = cleanIpAddr;
    vnp_Params['vnp_CreateDate'] = createDate;

    // Sắp xếp object
    const signData = this.buildVNPayQuery(vnp_Params);

    // DÙNG NỐI CHUỖI THỦ CÔNG THAY VÌ qs.stringify (Chống đạn 100%)
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    
    let paymentUrl = vnpUrl;
    paymentUrl += '?' + signData + `&vnp_SecureHash=${signed}`;

    return {
      ...payment,
      paymentUrl: paymentUrl,
    };
  }

  async handleVNPayCallback(params: any) {
    console.log("🔹 VNPAY Callback Params:", params);

    let vnp_Params = { ...params };
    const secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    const secretKey = (process.env.VNP_HASH_SECRET || process.env.VNPAY_HASH_SECRET)?.trim();
    if (!secretKey) {
      throw new BadRequestException('Missing VNPAY hash secret');
    }
    
    // Nối chuỗi thủ công để so sánh chữ ký
    console.log("--- DEBUG START ---");
    console.log("vnp_Params đã sắp xếp:", JSON.stringify(vnp_Params));
    const signData = this.buildVNPayQuery(vnp_Params);
    console.log("Chuỗi SignData để băm:", signData); 
    console.log("--- DEBUG END ---");
    
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    console.log("🔹 My Signed Hash:", signed);
    console.log("🔹 VNPAY Hash:   ", secureHash);

    if (String(secureHash).toLowerCase() === signed.toLowerCase()) {
      const paymentId = vnp_Params['vnp_TxnRef'];
      const rspCode = vnp_Params['vnp_ResponseCode']; 

      console.log(`✅ Chữ ký hợp lệ. PaymentID: ${paymentId}, Code: ${rspCode}`);

      const payment = await this.prisma.payment.findUnique({
        where: { id: paymentId },
      });

      if (!payment) {
          console.error("❌ Không tìm thấy Payment ID trong DB");
          throw new NotFoundException('Payment not found');
      }

      if (rspCode === '00') {
        console.log("🚀 Đang cập nhật trạng thái SUCCESS...");
        
        await this.prisma.$transaction([
            this.prisma.payment.update({
                where: { id: paymentId },
                data: { 
                    status: PaymentStatus.SUCCESS,
                    transactionId: vnp_Params['vnp_TransactionNo'] 
                },
            }),
            this.prisma.order.update({
                where: { id: payment.orderId },
                data: { status: OrderStatus.PROCESSING } 
            })
        ]);
        
        console.log("🎉 Cập nhật thành công!");
        return { message: 'Success', code: '00' };

      } else {
        console.log("⚠️ Thanh toán thất bại/Hủy từ phía VNPAY");
        await this.prisma.payment.update({
            where: { id: paymentId },
            data: { status: PaymentStatus.FAILED },
        });
        return { message: 'Failed', code: rspCode };
      }

    } else {
      console.error("❌ Chữ ký KHÔNG hợp lệ!");
      throw new BadRequestException('Invalid signature'); 
    }
  }

  private async createPayPalPayment(payment: any, order: any) { return { ...payment, paymentUrl: '' }; }
  private async createCODPayment(payment: any, order: any) { return payment; }
  async handlePayPalCallback(params: any) { return {}; }

  async findAll() { return this.prisma.payment.findMany({ include: { order: true } }); }
  async findOne(id: string) { return this.prisma.payment.findUnique({ where: { id }, include: { order: true } }); }
  async findByOrder(orderId: string) { return this.prisma.payment.findUnique({ where: { orderId }, include: { order: true } }); }
  async updatePayment(id: string, dto: UpdatePaymentDto) {
      return this.prisma.payment.update({ where: { id }, data: { status: dto.status }});
  }
}
