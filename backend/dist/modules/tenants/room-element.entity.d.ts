import { Restaurant } from './restaurant.entity';
export declare class RoomElement {
    id: string;
    type: string;
    posX: number;
    posY: number;
    width: number;
    height: number;
    rotation: number;
    color: string;
    restaurantId: string;
    restaurant: Restaurant;
    tenantId: string;
    createdAt: Date;
    updatedAt: Date;
}
