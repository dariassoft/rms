import { RestaurantsService } from './restaurants.service';
export declare class RestaurantsController {
    private readonly restaurantsService;
    constructor(restaurantsService: RestaurantsService);
    findAll(): Promise<import("./restaurant.entity").Restaurant[]>;
    findMe(req: any): Promise<import("./restaurant.entity").Restaurant>;
    search(q: string, lat?: number, lng?: number): Promise<any[]>;
    getTables(id: string): Promise<import("./table.entity").TableEntity[]>;
    updateTables(id: string, tables: any[]): Promise<void>;
}
