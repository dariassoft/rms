"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./order.entity");
const order_item_entity_1 = require("./order-item.entity");
const kitchen_gateway_1 = require("./kitchen.gateway");
const inventory_service_1 = require("../inventory/inventory.service");
let OrdersService = class OrdersService {
    constructor(orderRepository, orderItemRepository, kitchenGateway, inventoryService) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.kitchenGateway = kitchenGateway;
        this.inventoryService = inventoryService;
    }
    async create(data, tenantId) {
        const { restaurantId, tableId, waiterId, items } = data;
        const order = this.orderRepository.create({
            restaurantId,
            tableId,
            waiterId,
            tenantId,
            status: 'pending',
            totalAmount: 0,
        });
        const savedOrder = await this.orderRepository.save(order);
        let total = 0;
        const orderItems = items.map((item) => {
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
        for (const item of orderItems) {
            await this.inventoryService.discountStockByDish(item.dishId, item.quantity, tenantId);
        }
        savedOrder.totalAmount = total;
        savedOrder.items = orderItems;
        const finalOrder = await this.orderRepository.save(savedOrder);
        this.kitchenGateway.notifyNewOrder(tenantId, finalOrder);
        return finalOrder;
    }
    async findByRestaurant(restaurantId, tenantId) {
        return this.orderRepository.find({
            where: { restaurantId, tenantId },
            relations: ['items', 'items.dish', 'table', 'waiter'],
            order: { createdAt: 'DESC' },
        });
    }
    async updateOrderStatus(id, status, tenantId) {
        const order = await this.orderRepository.findOne({ where: { id, tenantId } });
        if (!order)
            throw new common_1.BadRequestException('Pedido no encontrado');
        order.status = status;
        const updated = await this.orderRepository.save(order);
        this.kitchenGateway.notifyStatusUpdate(tenantId, { type: 'order', id, status });
        return updated;
    }
    async updateItemStatus(itemId, status, tenantId) {
        const item = await this.orderItemRepository.findOne({
            where: { id: itemId },
            relations: ['order']
        });
        if (!item || item.order.tenantId !== tenantId)
            throw new common_1.BadRequestException('Item no encontrado');
        item.status = status;
        const updated = await this.orderItemRepository.save(item);
        this.kitchenGateway.notifyStatusUpdate(tenantId, { type: 'item', id: itemId, status, orderId: item.orderId });
        return updated;
    }
    async getPendingForKitchen(tenantId) {
        return this.orderRepository.find({
            where: {
                tenantId,
                status: 'preparing'
            },
            relations: ['items', 'items.dish', 'table'],
            order: { createdAt: 'ASC' }
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        kitchen_gateway_1.KitchenGateway,
        inventory_service_1.InventoryService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map