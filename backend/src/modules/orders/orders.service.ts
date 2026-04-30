import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { KitchenGateway } from './kitchen.gateway';
import { InventoryService } from '../inventory/inventory.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private kitchenGateway: KitchenGateway,
    private inventoryService: InventoryService,
  ) {}

  async create(data: any, tenantId: string): Promise<Order> {
    const { restaurantId, tableId, waiterId, items } = data;

    const order = this.orderRepository.create({
      restaurantId,
      tableId,
      waiterId,
      tenantId,
      status: 'pending',
      totalAmount: 0, // Se calculará abajo
    });

    const savedOrder = await this.orderRepository.save(order);

    let total = 0;
    const orderItems = items.map((item: any) => {
      const orderItem = this.orderItemRepository.create({
        orderId: savedOrder.id,
        dishId: item.dishId,
        quantity: item.quantity,
        price: item.price,
        notes: item.notes,
        status: 'pending',
      });
      total += Number(item.price) * item.quantity;
      return orderItem;
    });

    await this.orderItemRepository.save(orderItems);

    // Descontar stock
    for (const item of orderItems) {
      await this.inventoryService.discountStockByDish(item.dishId, item.quantity, tenantId);
    }

    savedOrder.totalAmount = total;
    savedOrder.items = orderItems;
    const finalOrder = await this.orderRepository.save(savedOrder);
    
    // Notificar a cocina
    this.kitchenGateway.notifyNewOrder(tenantId, finalOrder);
    
    return finalOrder;
  }

  async findByRestaurant(restaurantId: string, tenantId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { restaurantId, tenantId },
      relations: ['items', 'items.dish', 'table', 'waiter'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateOrderStatus(id: string, status: string, tenantId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id, tenantId } });
    if (!order) throw new BadRequestException('Pedido no encontrado');
    order.status = status;
    const updated = await this.orderRepository.save(order);
    
    this.kitchenGateway.notifyStatusUpdate(tenantId, { type: 'order', id, status });
    
    return updated;
  }

  async updateItemStatus(itemId: string, status: string, tenantId: string): Promise<OrderItem> {
    const item = await this.orderItemRepository.findOne({ 
      where: { id: itemId },
      relations: ['order']
    });
    if (!item || item.order.tenantId !== tenantId) throw new BadRequestException('Item no encontrado');
    item.status = status;
    const updated = await this.orderItemRepository.save(item);
    
    this.kitchenGateway.notifyStatusUpdate(tenantId, { type: 'item', id: itemId, status, orderId: item.orderId });
    
    return updated;
  }

  async getPendingForKitchen(tenantId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { 
        tenantId, 
        status: 'preparing' 
      },
      relations: ['items', 'items.dish', 'table'],
      order: { createdAt: 'ASC' }
    });
  }
}
