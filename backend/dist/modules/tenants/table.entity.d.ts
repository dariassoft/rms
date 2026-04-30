import { Restaurant } from './restaurant.entity';
export declare class TableEntity {
    id: string;
    number: string;
    name: string;
    description: string;
    capacity: number;
    baseCapacity: number;
    joinedWith: string[];
    occupiedSides: number;
    posX: number;
    posY: number;
    rotation: number;
    shape: string;
    status: string;
    restaurantId: string;
    restaurant: Restaurant;
    tenantId: string;
    createdAt: Date;
    updatedAt: Date;
}
