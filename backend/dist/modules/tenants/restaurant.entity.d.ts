import { Dish } from './dish.entity';
import { TableEntity } from './table.entity';
import { RoomElement } from './room-element.entity';
export declare class Restaurant {
    id: string;
    tenantId: string;
    name: string;
    description: string;
    address: string;
    latitude: number;
    longitude: number;
    cuisineType: string;
    rating: number;
    logoUrl: string;
    bannerUrl: string;
    dishes: Dish[];
    tables: TableEntity[];
    roomElements: RoomElement[];
    createdAt: Date;
    updatedAt: Date;
}
