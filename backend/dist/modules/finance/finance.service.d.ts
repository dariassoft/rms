import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
export declare class FinanceService {
    private invoiceRepository;
    constructor(invoiceRepository: Repository<Invoice>);
    createInvoice(tenantId: string, data: any): Promise<Invoice[]>;
    getInvoicesByTenant(tenantId: string): Promise<Invoice[]>;
}
