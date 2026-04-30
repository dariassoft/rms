import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('finance')
@UseGuards(JwtAuthGuard)
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('invoices')
  findAll(@Req() req) {
    return this.financeService.getInvoicesByTenant(req.user.tenantId);
  }

  @Post('invoices')
  create(@Req() req, @Body() data) {
    return this.financeService.createInvoice(req.user.tenantId, data);
  }
}
