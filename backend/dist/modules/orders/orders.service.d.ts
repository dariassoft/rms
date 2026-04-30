import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { KitchenGateway } from './kitchen.gateway';
import { InventoryService } from '../inventory/inventory.service';
export declare class OrdersService {
    private orderRepository;
    private orderItemRepository;
    private kitchenGateway;
    private inventoryService;
    constructor(orderRepository: Repository<Order>, orderItemRepository: Repository<OrderItem>, kitchenGateway: KitchenGateway, inventoryService: InventoryService);
    create(data: any, tenantId: string): Promise<Order>;
    findByRestaurant(restaurantId: string, tenantId: string): Promise<Order[]>;
    updateOrderStatus(id: string, status: string, tenantId: string): Promise<Order>;
    updateItemStatus(itemId: string, status: string, tenantId: string): Promise<OrderItem>;
    getPendingForKitchen(tenantId: string): Promise<Order[]>;
}
