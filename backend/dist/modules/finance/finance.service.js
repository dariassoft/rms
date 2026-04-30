"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const invoice_entity_1 = require("./entities/invoice.entity");
let FinanceService = class FinanceService {
    constructor(invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }
    async createInvoice(tenantId, data) {
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
    async getInvoicesByTenant(tenantId) {
        return this.invoiceRepository.find({
            where: { tenantId },
            relations: ['order'],
            order: { createdAt: 'DESC' }
        });
    }
};
exports.FinanceService = FinanceService;
exports.FinanceService = FinanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(invoice_entity_1.Invoice)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FinanceService);
//# sourceMappingURL=finance.service.js.map