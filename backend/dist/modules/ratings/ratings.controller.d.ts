import { RatingsService } from './ratings.service';
export declare class RatingsController {
    private readonly ratingsService;
    constructor(ratingsService: RatingsService);
    create(data: any, req: any): Promise<import("./rating.entity").Rating>;
    findByRestaurant(restaurantId: string): Promise<import("./rating.entity").Rating[]>;
}
