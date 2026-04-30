import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { KitchenGateway } from './kitchen.gateway';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    InventoryModule,
  ],
  providers: [OrdersService, KitchenGateway],
  controllers: [OrdersController],
  exports: [OrdersService, KitchenGateway],
})
export class OrdersModule {}
