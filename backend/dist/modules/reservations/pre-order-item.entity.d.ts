import { Reservation } from './reservation.entity';
import { Dish } from '../tenants/dish.entity';
export declare class PreOrderItem {
    id: string;
    reservationId: string;
    reservation: Reservation;
    dishId: string;
    dish: Dish;
    quantity: number;
    priceAtOrder: number;
    notes: string;
}
