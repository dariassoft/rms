import { Controller, Get, Post, Body, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reservations')
@UseGuards(JwtAuthGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  async create(@Body() data: any, @Req() req: any) {
    // tenantId se obtiene del middleware o de los datos del usuario si aplica
    const tenantId = req.user.tenantId || 'public';
    return this.reservationsService.create({ ...data, userId: req.user.userId }, tenantId);
  }

  @Get()
  async findAll(@Req() req: any) {
    const tenantId = req.user.tenantId || 'public';
    return this.reservationsService.findAll(tenantId);
  }

  @Get('my')
  async findMy(@Req() req: any) {
    return this.reservationsService.findByUser(req.user.userId);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Req() req: any
  ) {
    const tenantId = req.user.tenantId || 'public';
    return this.reservationsService.updateStatus(id, status, tenantId);
  }
}
