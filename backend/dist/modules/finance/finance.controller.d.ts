import { FinanceService } from './finance.service';
export declare class FinanceController {
    private readonly financeService;
    constructor(financeService: FinanceService);
    findAll(req: any): Promise<import("./entities/invoice.entity").Invoice[]>;
    create(req: any, data: any): Promise<import("./entities/invoice.entity").Invoice[]>;
}
