import { OrderStatus, PaymentMethod } from '@prisma/client';
export declare class CreateOrderItemDto {
    productId: string;
    variantId?: string;
    quantity: number;
}
export declare class CreateOrderDto {
    items: CreateOrderItemDto[];
    voucherIds?: string[];
    shippingFee: number;
    addressId: string;
    paymentMethod: PaymentMethod;
}
export declare class UpdateOrderStatusDto {
    status: OrderStatus;
}
