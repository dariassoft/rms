import { Restaurant } from '../tenants/restaurant.entity';
import { TableEntity } from '../tenants/table.entity';
import { User } from '../users/user.entity';
import { PreOrderItem } from './pre-order-item.entity';
export declare class Reservation {
    id: string;
    restaurantId: string;
    restaurant: Restaurant;
    tableId: string;
    table: TableEntity;
    userId: string;
    user: User;
    preOrderItems: PreOrderItem[];
    reservationTime: Date;
    adults: number;
    children: number;
    babies: number;
    status: string;
    notes: string;
    tenantId: string;
    createdAt: Date;
    updatedAt: Date;
}
