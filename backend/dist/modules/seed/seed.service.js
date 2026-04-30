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
var SeedService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("../users/user.entity");
let SeedService = SeedService_1 = class SeedService {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.logger = new common_1.Logger(SeedService_1.name);
    }
    async onApplicationBootstrap() {
        const runSeed = process.env.DB_RUN_SEED === 'true';
        if (!runSeed) {
            this.logger.log('Seed disabled (DB_RUN_SEED is not true)');
            return;
        }
        await this.seedUsers();
    }
    async seedUsers() {
        const count = await this.userRepository.count();
        if (count > 0) {
            this.logger.log('Users already exist, skipping seed');
            return;
        }
        this.logger.log('Seeding initial users...');
        const domain = process.env.DOMAIN || 'rms.dev';
        const password = await bcrypt.hash('rms1234!', 10);
        const users = [
            {
                email: `superadmin@${domain}`,
                password,
                name: 'Super Admin',
                role: user_entity_1.UserRole.SUPERADMIN,
                tenantId: 'public',
            },
            {
                email: `admin@labuena.${domain}`,
                password,
                name: 'Admin La Buena',
                role: user_entity_1.UserRole.ADMIN,
                tenantId: 'labuena',
            },
            {
                email: `mozo@labuena.${domain}`,
                password,
                name: 'Mozo La Buena',
                role: user_entity_1.UserRole.WAITER,
                tenantId: 'labuena',
            },
            {
                email: `chef@labuena.${domain}`,
                password,
                name: 'Chef La Buena',
                role: user_entity_1.UserRole.CHEF,
                tenantId: 'labuena',
            },
            {
                email: `comensal@${domain}`,
                password,
                name: 'Comensal Test',
                role: user_entity_1.UserRole.DINER,
                tenantId: 'public',
            },
        ];
        await this.userRepository.save(users);
        this.logger.log(`Seeded ${users.length} users successfully`);
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = SeedService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SeedService);
//# sourceMappingURL=seed.service.js.map