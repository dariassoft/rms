import { Controller, Get, Query, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  async findAll() {
    return this.restaurantsService.findAllPublic();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async findMe(@Req() req: any) {
    return this.restaurantsService.findByTenantId(req.user.tenantId);
  }

  @Get('search')
  async search(
    @Query('q') q: string,
    @Query('lat') lat?: number,
    @Query('lng') lng?: number,
  ) {
    return this.restaurantsService.search(q, lat, lng);
  }

  @Get(':id/tables')
  async getTables(@Param('id') id: string) {
    return this.restaurantsService.getTables(id);
  }

  @Post(':id/tables')
  async updateTables(@Param('id') id: string, @Body() tables: any[]) {
    return this.restaurantsService.updateTables(id, tables);
  }
}
