import { SuperAdminService } from './super-admin.service';
export declare class SuperAdminController {
    private readonly superAdminService;
    constructor(superAdminService: SuperAdminService);
    private checkSuperAdmin;
    getStats(req: any): Promise<{
        totalRestaurants: number;
        totalUsers: number;
        totalRevenue: number;
        recentActivity: import("../finance/entities/invoice.entity").Invoice[];
    }>;
    getRestaurants(req: any): Promise<import("../tenants/restaurant.entity").Restaurant[]>;
}
