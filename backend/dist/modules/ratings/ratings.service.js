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
exports.RatingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const rating_entity_1 = require("./rating.entity");
const restaurant_entity_1 = require("../tenants/restaurant.entity");
let RatingsService = class RatingsService {
    constructor(ratingRepository, restaurantRepository) {
        this.ratingRepository = ratingRepository;
        this.restaurantRepository = restaurantRepository;
    }
    async create(data, tenantId) {
        const rating = this.ratingRepository.create({
            ...data,
            tenantId,
        });
        const saved = await this.ratingRepository.save(rating);
        if (data.type === 'restaurant') {
            await this.updateRestaurantAverageRating(data.restaurantId);
        }
        return saved;
    }
    async findByRestaurant(restaurantId) {
        return this.ratingRepository.find({
            where: { restaurantId },
            relations: ['user', 'dish'],
            order: { createdAt: 'DESC' },
        });
    }
    async updateRestaurantAverageRating(restaurantId) {
        const ratings = await this.ratingRepository.find({
            where: { restaurantId, type: 'restaurant' },
        });
        if (ratings.length > 0) {
            const average = ratings.reduce((acc, curr) => acc + curr.score, 0) / ratings.length;
            await this.restaurantRepository.update(restaurantId, { rating: average });
        }
    }
};
exports.RatingsService = RatingsService;
exports.RatingsService = RatingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(rating_entity_1.Rating)),
    __param(1, (0, typeorm_1.InjectRepository)(restaurant_entity_1.Restaurant)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RatingsService);
//# sourceMappingURL=ratings.service.js.map