import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() data: any, @Req() req: any) {
    return this.ratingsService.create({ ...data, userId: req.user.id }, req.user.tenantId);
  }

  @Get('restaurant/:restaurantId')
  async findByRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.ratingsService.findByRestaurant(restaurantId);
  }
}
