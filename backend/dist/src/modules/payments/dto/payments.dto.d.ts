import { PaymentMethod, PaymentStatus } from '@prisma/client';
export declare class CreatePaymentDto {
    orderId: string;
    method: PaymentMethod;
}
export declare class UpdatePaymentDto {
    status: PaymentStatus;
    transactionId?: string;
}
export declare class VNPayCallbackDto {
    vnp_TxnRef: string;
    vnp_Amount: string;
    vnp_ResponseCode: string;
    vnp_TransactionNo: string;
    vnp_BankCode: string;
    vnp_PayDate: string;
    vnp_OrderInfo: string;
    vnp_SecureHash: string;
    [key: string]: any;
}
export declare class PayPalCallbackDto {
    paymentId: string;
    PayerID: string;
    token: string;
}
