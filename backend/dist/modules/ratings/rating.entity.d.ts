import { Restaurant } from '../tenants/restaurant.entity';
import { Dish } from '../tenants/dish.entity';
import { User } from '../users/user.entity';
export declare class Rating {
    id: string;
    restaurantId: string;
    restaurant: Restaurant;
    dishId: string;
    dish: Dish;
    userId: string;
    user: User;
    score: number;
    comment: string;
    type: string;
    tenantId: string;
    createdAt: Date;
}
