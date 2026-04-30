import { Repository } from 'typeorm';
import { Rating } from './rating.entity';
import { Restaurant } from '../tenants/restaurant.entity';
export declare class RatingsService {
    private ratingRepository;
    private restaurantRepository;
    constructor(ratingRepository: Repository<Rating>, restaurantRepository: Repository<Restaurant>);
    create(data: any, tenantId: string): Promise<Rating>;
    findByRestaurant(restaurantId: string): Promise<Rating[]>;
    private updateRestaurantAverageRating;
}
