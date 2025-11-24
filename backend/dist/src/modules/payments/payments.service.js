"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const crypto = require("crypto");
const qs = require("qs");
const date_fns_1 = require("date-fns");
let PaymentsService = class PaymentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    sortObject(obj) {
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
    async create(dto, ipAddr = '127.0.0.1') {
        const order = await this.prisma.order.findUnique({
            where: { id: dto.orderId },
            include: { payment: true },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        let payment = order.payment;
        if (payment) {
            if (payment.status === client_1.PaymentStatus.SUCCESS) {
                throw new common_1.BadRequestException('Order is already paid');
            }
            if (payment.method !== dto.method) {
                payment = await this.prisma.payment.update({
                    where: { id: payment.id },
                    data: { method: dto.method }
                });
            }
        }
        else {
            payment = await this.prisma.payment.create({
                data: {
                    orderId: dto.orderId,
                    method: dto.method,
                    status: client_1.PaymentStatus.PENDING,
                    amount: order.totalAmount,
                },
            });
        }
        switch (dto.method) {
            case client_1.PaymentMethod.VNPAY:
                return this.createVNPayPayment(payment, order, ipAddr);
            case client_1.PaymentMethod.PAYPAL:
                return this.createPayPalPayment(payment, order);
            case client_1.PaymentMethod.COD:
                return this.createCODPayment(payment, order);
            default:
                throw new common_1.BadRequestException('Invalid payment method');
        }
    }
    async createVNPayPayment(payment, order, ipAddr) {
        const tmnCode = process.env.VNPAY_TMN_CODE;
        const secretKey = process.env.VNPAY_HASH_SECRET;
        const vnpUrl = process.env.VNPAY_URL;
        const returnUrl = `${process.env.FRONTEND_URL}/payment/vnpay-return`;
        const date = new Date();
        const createDate = (0, date_fns_1.format)(date, 'yyyyMMddHHmmss');
        const txnRef = payment.id;
        const amount = Math.round(order.totalAmount * 100);
        let vnp_Params = {};
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
        return Object.assign(Object.assign({}, payment), { paymentUrl: paymentUrl });
    }
    async handleVNPayCallback(params) {
        console.log("🔹 VNPAY Callback Params:", params);
        let vnp_Params = Object.assign({}, params);
        const secureHash = vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];
        vnp_Params = this.sortObject(vnp_Params);
        const secretKey = process.env.VNPAY_HASH_SECRET;
        console.log("🔹 Hash Secret:", secretKey ? `${secretKey.substring(0, 5)}...` : "UNDEFINED");
        const signData = qs.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac('sha512', secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        console.log("🔹 My Signed Hash:", signed);
        console.log("🔹 VNPAY Hash:   ", secureHash);
        if (secureHash === signed) {
            const paymentId = vnp_Params['vnp_TxnRef'];
            const rspCode = vnp_Params['vnp_ResponseCode'];
            console.log(`✅ Chữ ký hợp lệ. PaymentID: ${paymentId}, Code: ${rspCode}`);
            const payment = await this.prisma.payment.findUnique({
                where: { id: paymentId },
            });
            if (!payment) {
                console.error("❌ Không tìm thấy Payment ID trong DB");
                throw new common_1.NotFoundException('Payment not found');
            }
            if (rspCode === '00') {
                console.log("🚀 Đang cập nhật trạng thái SUCCESS...");
                await this.prisma.$transaction([
                    this.prisma.payment.update({
                        where: { id: paymentId },
                        data: {
                            status: client_1.PaymentStatus.SUCCESS,
                            transactionId: vnp_Params['vnp_TransactionNo']
                        },
                    }),
                    this.prisma.order.update({
                        where: { id: payment.orderId },
                        data: { status: client_1.OrderStatus.PROCESSING }
                    })
                ]);
                console.log("🎉 Cập nhật thành công!");
                return { message: 'Success', code: '00' };
            }
            else {
                console.log("⚠️ Thanh toán thất bại/Hủy từ phía VNPAY");
                await this.prisma.payment.update({
                    where: { id: paymentId },
                    data: { status: client_1.PaymentStatus.FAILED },
                });
                return { message: 'Failed', code: rspCode };
            }
        }
        else {
            console.error("❌ Chữ ký KHÔNG hợp lệ!");
            throw new common_1.BadRequestException('Invalid signature');
        }
    }
    async createPayPalPayment(payment, order) { return Object.assign(Object.assign({}, payment), { paymentUrl: '' }); }
    async createCODPayment(payment, order) { return payment; }
    async handlePayPalCallback(params) { return {}; }
    async findAll() { return this.prisma.payment.findMany({ include: { order: true } }); }
    async findOne(id) { return this.prisma.payment.findUnique({ where: { id }, include: { order: true } }); }
    async findByOrder(orderId) { return this.prisma.payment.findUnique({ where: { orderId }, include: { order: true } }); }
    async updatePayment(id, dto) {
        return this.prisma.payment.update({ where: { id }, data: { status: dto.status } });
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map