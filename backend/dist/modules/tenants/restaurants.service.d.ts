import { Repository } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { Dish } from './dish.entity';
import { TableEntity } from './table.entity';
export declare class RestaurantsService {
    private restaurantRepository;
    private dishRepository;
    private tableRepository;
    constructor(restaurantRepository: Repository<Restaurant>, dishRepository: Repository<Dish>, tableRepository: Repository<TableEntity>);
    getTables(restaurantId: string): Promise<TableEntity[]>;
    updateTables(restaurantId: string, tables: any[]): Promise<void>;
    findByTenantId(tenantId: string): Promise<Restaurant | null>;
    findAllPublic(): Promise<Restaurant[]>;
    search(query: string, lat?: number, lng?: number, radius?: number): Promise<any[]>;
}
