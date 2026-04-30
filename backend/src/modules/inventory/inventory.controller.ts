import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('ingredients')
  findAllIngredients(@Req() req) {
    return this.inventoryService.findAllIngredients(req.user.tenantId);
  }

  @Post('ingredients')
  createIngredient(@Req() req, @Body() data) {
    return this.inventoryService.createIngredient(req.user.tenantId, data);
  }

  @Get('suppliers')
  findAllSuppliers(@Req() req) {
    return this.inventoryService.findAllSuppliers(req.user.tenantId);
  }

  @Post('suppliers')
  createSupplier(@Req() req, @Body() data) {
    return this.inventoryService.createSupplier(req.user.tenantId, data);
  }

  @Post('recipes')
  createRecipe(@Req() req, @Body() data) {
    return this.inventoryService.createRecipe(req.user.tenantId, data);
  }
}
