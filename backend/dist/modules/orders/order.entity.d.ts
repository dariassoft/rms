import { Restaurant } from '../tenants/restaurant.entity';
import { TableEntity } from '../tenants/table.entity';
import { User } from '../users/user.entity';
import { OrderItem } from './order-item.entity';
export declare class Order {
    id: string;
    restaurantId: string;
    restaurant: Restaurant;
    tableId: string;
    table: TableEntity;
    waiterId: string;
    waiter: User;
    items: OrderItem[];
    status: string;
    totalAmount: number;
    tenantId: string;
    createdAt: Date;
    updatedAt: Date;
}
