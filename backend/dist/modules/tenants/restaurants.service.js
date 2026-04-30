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
exports.RestaurantsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const restaurant_entity_1 = require("./restaurant.entity");
const dish_entity_1 = require("./dish.entity");
const table_entity_1 = require("./table.entity");
let RestaurantsService = class RestaurantsService {
    constructor(restaurantRepository, dishRepository, tableRepository) {
        this.restaurantRepository = restaurantRepository;
        this.dishRepository = dishRepository;
        this.tableRepository = tableRepository;
    }
    async getTables(restaurantId) {
        return this.tableRepository.find({ where: { restaurantId } });
    }
    async updateTables(restaurantId, tables) {
        await this.tableRepository.delete({ restaurantId });
        const entities = tables.map(t => {
            const entity = new table_entity_1.TableEntity();
            Object.assign(entity, t);
            entity.restaurantId = restaurantId;
            return entity;
        });
        await this.tableRepository.save(entities);
    }
    async findByTenantId(tenantId) {
        return this.restaurantRepository.findOne({
            where: { tenantId },
            relations: ['dishes', 'tables'],
        });
    }
    async findAllPublic() {
        return this.restaurantRepository.find({
            relations: ['dishes'],
        });
    }
    async search(query, lat, lng, radius = 10) {
        const qb = this.restaurantRepository.createQueryBuilder('restaurant')
            .leftJoinAndSelect('restaurant.dishes', 'dish')
            .where('(restaurant.name LIKE :query OR restaurant.cuisineType LIKE :query OR dish.name LIKE :query)', { query: `%${query}%` });
        if (lat && lng) {
            qb.addSelect(`6371 * acos(cos(radians(:lat)) * cos(radians(restaurant.latitude)) * cos(radians(restaurant.longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(restaurant.latitude)))`, 'distance')
                .andWhere(`6371 * acos(cos(radians(:lat)) * cos(radians(restaurant.latitude)) * cos(radians(restaurant.longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(restaurant.latitude))) <= :radius`, { lat, lng, radius })
                .orderBy('distance', 'ASC');
        }
        return qb.getMany();
    }
};
exports.RestaurantsService = RestaurantsService;
exports.RestaurantsService = RestaurantsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(restaurant_entity_1.Restaurant)),
    __param(1, (0, typeorm_1.InjectRepository)(dish_entity_1.Dish)),
    __param(2, (0, typeorm_1.InjectRepository)(table_entity_1.TableEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RestaurantsService);
//# sourceMappingURL=restaurants.service.js.map