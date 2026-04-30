import { Restaurant } from './restaurant.entity';
export declare class Dish {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    isAvailable: boolean;
    category: string;
    restaurantId: string;
    restaurant: Restaurant;
    tenantId: string;
    createdAt: Date;
    updatedAt: Date;
}
