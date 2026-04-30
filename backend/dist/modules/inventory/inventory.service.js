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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ingredient_entity_1 = require("./entities/ingredient.entity");
const supplier_entity_1 = require("./entities/supplier.entity");
const recipe_entity_1 = require("./entities/recipe.entity");
let InventoryService = class InventoryService {
    constructor(ingredientRepository, supplierRepository, recipeRepository) {
        this.ingredientRepository = ingredientRepository;
        this.supplierRepository = supplierRepository;
        this.recipeRepository = recipeRepository;
    }
    async findAllIngredients(tenantId) {
        return this.ingredientRepository.find({ where: { tenantId } });
    }
    async createIngredient(tenantId, data) {
        const ingredient = this.ingredientRepository.create({ ...data, tenantId });
        return this.ingredientRepository.save(ingredient);
    }
    async findAllSuppliers(tenantId) {
        return this.supplierRepository.find({ where: { tenantId } });
    }
    async createSupplier(tenantId, data) {
        const supplier = this.supplierRepository.create({ ...data, tenantId });
        return this.supplierRepository.save(supplier);
    }
    async getRecipesByDish(dishId, tenantId) {
        return this.recipeRepository.find({
            where: { dishId, tenantId },
            relations: ['ingredient'],
        });
    }
    async createRecipe(tenantId, data) {
        const recipe = this.recipeRepository.create({ ...data, tenantId });
        return this.recipeRepository.save(recipe);
    }
    async discountStockByDish(dishId, quantity, tenantId) {
        const recipes = await this.getRecipesByDish(dishId, tenantId);
        for (const recipe of recipes) {
            const ingredient = await this.ingredientRepository.findOne({ where: { id: recipe.ingredientId, tenantId } });
            if (ingredient) {
                const amountToDiscount = recipe.quantity * quantity;
                ingredient.stock = Number(ingredient.stock) - amountToDiscount;
                await this.ingredientRepository.save(ingredient);
            }
        }
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ingredient_entity_1.Ingredient)),
    __param(1, (0, typeorm_1.InjectRepository)(supplier_entity_1.Supplier)),
    __param(2, (0, typeorm_1.InjectRepository)(recipe_entity_1.Recipe)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map