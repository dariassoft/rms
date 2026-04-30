import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(data: any, req: any): Promise<import("./order.entity").Order>;
    findByRestaurant(restaurantId: string, req: any): Promise<import("./order.entity").Order[]>;
    getKitchenOrders(req: any): Promise<import("./order.entity").Order[]>;
    updateStatus(id: string, status: string, req: any): Promise<import("./order.entity").Order>;
    updateItemStatus(itemId: string, status: string, req: any): Promise<import("./order-item.entity").OrderItem>;
}
