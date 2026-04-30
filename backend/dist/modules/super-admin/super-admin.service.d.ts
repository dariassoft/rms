import { Repository } from 'typeorm';
import { Restaurant } from '../tenants/restaurant.entity';
import { User } from '../users/user.entity';
import { Invoice } from '../finance/entities/invoice.entity';
export declare class SuperAdminService {
    private restaurantRepository;
    private userRepository;
    private invoiceRepository;
    constructor(restaurantRepository: Repository<Restaurant>, userRepository: Repository<User>, invoiceRepository: Repository<Invoice>);
    getGlobalStats(): Promise<{
        totalRestaurants: number;
        totalUsers: number;
        totalRevenue: number;
        recentActivity: Invoice[];
    }>;
    getAllRestaurants(): Promise<Restaurant[]>;
}
