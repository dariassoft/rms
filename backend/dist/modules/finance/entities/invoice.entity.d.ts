import { Order } from '../../orders/order.entity';
export declare class Invoice {
    id: string;
    invoiceNumber: string;
    orderId: string;
    order: Order;
    amount: number;
    tip: number;
    paymentMethod: string;
    status: string;
    cae: string;
    tenantId: string;
    createdAt: Date;
}
