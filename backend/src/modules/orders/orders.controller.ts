import { Controller, Get, Post, Body, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() data: any, @Req() req: any) {
    return this.ordersService.create(data, req.user.tenantId);
  }

  @Get('restaurant/:restaurantId')
  async findByRestaurant(@Param('restaurantId') restaurantId: string, @Req() req: any) {
    return this.ordersService.findByRestaurant(restaurantId, req.user.tenantId);
  }

  @Get('kitchen')
  async getKitchenOrders(@Req() req: any) {
    return this.ordersService.getPendingForKitchen(req.user.tenantId);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string, @Req() req: any) {
    return this.ordersService.updateOrderStatus(id, status, req.user.tenantId);
  }

  @Patch('items/:itemId/status')
  async updateItemStatus(@Param('itemId') itemId: string, @Body('status') status: string, @Req() req: any) {
    return this.ordersService.updateItemStatus(itemId, status, req.user.tenantId);
  }
}
