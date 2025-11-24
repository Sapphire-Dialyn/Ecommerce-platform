import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payments.dto'; // Bỏ import VNPayCallbackDto ở đây cho gọn
import { PaymentMethod, PaymentStatus, OrderStatus } from '@prisma/client';
import * as crypto from 'crypto';
import * as qs from 'qs';
import { format } from 'date-fns';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  private sortObject(obj: any) {
    const sorted = {};
    const str = [];
    let key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
    }
    return sorted;
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
    const tmnCode = process.env.VNPAY_TMN_CODE;
    const secretKey = process.env.VNPAY_HASH_SECRET;
    const vnpUrl = process.env.VNPAY_URL;
    const returnUrl = `${process.env.FRONTEND_URL}/payment/vnpay-return`;

    const date = new Date();
    const createDate = format(date, 'yyyyMMddHHmmss');
    const txnRef = payment.id; 
    const amount = Math.round(order.totalAmount * 100);

    // 👇 SỬA: Khai báo kiểu 'any' để tránh lỗi Type '{}' missing properties...
    let vnp_Params: any = {}; 
    
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_TxnRef'] = txnRef;
    vnp_Params['vnp_OrderInfo'] = `Thanh toan don hang #${order.id.slice(-8)}`;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr || '127.0.0.1';
    vnp_Params['vnp_CreateDate'] = createDate;

    vnp_Params = this.sortObject(vnp_Params);

    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    
    vnp_Params['vnp_SecureHash'] = signed;

    let paymentUrl = vnpUrl;
    paymentUrl += '?' + qs.stringify(vnp_Params, { encode: false });

    return {
      ...payment,
      paymentUrl: paymentUrl,
    };
  }

  // 👇 SỬA: Dùng 'any' cho params đầu vào để xử lý linh hoạt
  async handleVNPayCallback(params: any) {
    console.log("🔹 VNPAY Callback Params:", params); // LOG 1: Xem params nhận được

    let vnp_Params = { ...params };
    const secureHash = vnp_Params['vnp_SecureHash'];

    // Xóa tham số hash để tính toán lại
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    // Sắp xếp lại
    vnp_Params = this.sortObject(vnp_Params);

    const secretKey = process.env.VNPAY_HASH_SECRET;
    
    // Log Secret Key (ẩn bớt ký tự để check xem có load đc env không)
    console.log("🔹 Hash Secret:", secretKey ? `${secretKey.substring(0, 5)}...` : "UNDEFINED"); 

    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    console.log("🔹 My Signed Hash:", signed);
    console.log("🔹 VNPAY Hash:   ", secureHash);

    // Kiểm tra chữ ký
    if (secureHash === signed) {
      const paymentId = vnp_Params['vnp_TxnRef'];
      const rspCode = vnp_Params['vnp_ResponseCode']; 

      console.log(`✅ Chữ ký hợp lệ. PaymentID: ${paymentId}, Code: ${rspCode}`);

      // Tìm Payment
      const payment = await this.prisma.payment.findUnique({
        where: { id: paymentId },
      });

      if (!payment) {
          console.error("❌ Không tìm thấy Payment ID trong DB");
          throw new NotFoundException('Payment not found');
      }

      if (rspCode === '00') {
        console.log("🚀 Đang cập nhật trạng thái SUCCESS...");
        
        // SUCCESS
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
                data: { status: OrderStatus.PROCESSING } // Cập nhật Order sang Processing
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

  // MOCK METHODS
  private async createPayPalPayment(payment: any, order: any) { return { ...payment, paymentUrl: '' }; }
  private async createCODPayment(payment: any, order: any) { return payment; }
  async handlePayPalCallback(params: any) { return {}; }

  // CRUD
  async findAll() { return this.prisma.payment.findMany({ include: { order: true } }); }
  async findOne(id: string) { return this.prisma.payment.findUnique({ where: { id }, include: { order: true } }); }
  async findByOrder(orderId: string) { return this.prisma.payment.findUnique({ where: { orderId }, include: { order: true } }); }
  
  async updatePayment(id: string, dto: UpdatePaymentDto) {
      return this.prisma.payment.update({ where: { id }, data: { status: dto.status }});
  }
}