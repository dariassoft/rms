import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
  ) {}

  async createInvoice(tenantId: string, data: any) {
    // Generar un número de factura aleatorio para simulación
    const lastInvoice = await this.invoiceRepository.findOne({
      where: { tenantId },
      order: { createdAt: 'DESC' }
    });
    
    let nextNum = 1;
    if (lastInvoice && lastInvoice.invoiceNumber) {
      const parts = lastInvoice.invoiceNumber.split('-');
      nextNum = parseInt(parts[1]) + 1;
    }
    
    const invoiceNumber = `0001-${nextNum.toString().padStart(8, '0')}`;
    
    // Simular obtención de CAE de AFIP
    const cae = Math.random().toString().substring(2, 16);

    const invoice = this.invoiceRepository.create({
      ...data,
      invoiceNumber,
      cae,
      tenantId,
      status: 'paid'
    });

    return this.invoiceRepository.save(invoice);
  }

  async getInvoicesByTenant(tenantId: string) {
    return this.invoiceRepository.find({
      where: { tenantId },
      relations: ['order'],
      order: { createdAt: 'DESC' }
    });
  }
}
