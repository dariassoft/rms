import { Order } from './order.entity';
import { Dish } from '../tenants/dish.entity';
export declare class OrderItem {
    id: string;
    orderId: string;
    order: Order;
    dishId: string;
    dish: Dish;
    quantity: number;
    price: number;
    notes: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
