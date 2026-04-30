import { Controller, Get, UseGuards, UnauthorizedException, Req } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRole } from '../users/user.entity';

@Controller('super-admin')
@UseGuards(JwtAuthGuard)
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  private checkSuperAdmin(req) {
    if (req.user.role !== UserRole.SUPERADMIN) {
      throw new UnauthorizedException('Solo accesible para SuperAdmin');
    }
  }

  @Get('stats')
  getStats(@Req() req) {
    this.checkSuperAdmin(req);
    return this.superAdminService.getGlobalStats();
  }

  @Get('restaurants')
  getRestaurants(@Req() req) {
    this.checkSuperAdmin(req);
    return this.superAdminService.getAllRestaurants();
  }
}
