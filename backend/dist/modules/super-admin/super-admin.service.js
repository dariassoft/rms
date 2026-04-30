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
exports.SuperAdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const restaurant_entity_1 = require("../tenants/restaurant.entity");
const user_entity_1 = require("../users/user.entity");
const invoice_entity_1 = require("../finance/entities/invoice.entity");
let SuperAdminService = class SuperAdminService {
    constructor(restaurantRepository, userRepository, invoiceRepository) {
        this.restaurantRepository = restaurantRepository;
        this.userRepository = userRepository;
        this.invoiceRepository = invoiceRepository;
    }
    async getGlobalStats() {
        const [totalRestaurants, totalUsers, totalRevenue] = await Promise.all([
            this.restaurantRepository.count(),
            this.userRepository.count(),
            this.invoiceRepository.sum('amount'),
        ]);
        const recentInvoices = await this.invoiceRepository.find({
            order: { createdAt: 'DESC' },
            take: 10,
        });
        return {
            totalRestaurants,
            totalUsers,
            totalRevenue: totalRevenue || 0,
            recentActivity: recentInvoices,
        };
    }
    async getAllRestaurants() {
        return this.restaurantRepository.find();
    }
};
exports.SuperAdminService = SuperAdminService;
exports.SuperAdminService = SuperAdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(restaurant_entity_1.Restaurant)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(invoice_entity_1.Invoice)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SuperAdminService);
//# sourceMappingURL=super-admin.service.js.map