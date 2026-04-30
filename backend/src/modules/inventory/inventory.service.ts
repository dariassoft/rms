import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ingredient } from './entities/ingredient.entity';
import { Supplier } from './entities/supplier.entity';
import { Recipe } from './entities/recipe.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
  ) {}

  async findAllIngredients(tenantId: string) {
    return this.ingredientRepository.find({ where: { tenantId } });
  }

  async createIngredient(tenantId: string, data: any) {
    const ingredient = this.ingredientRepository.create({ ...data, tenantId });
    return this.ingredientRepository.save(ingredient);
  }

  async findAllSuppliers(tenantId: string) {
    return this.supplierRepository.find({ where: { tenantId } });
  }

  async createSupplier(tenantId: string, data: any) {
    const supplier = this.supplierRepository.create({ ...data, tenantId });
    return this.supplierRepository.save(supplier);
  }

  async getRecipesByDish(dishId: string, tenantId: string) {
    return this.recipeRepository.find({
      where: { dishId, tenantId },
      relations: ['ingredient'],
    });
  }

  async createRecipe(tenantId: string, data: any) {
    const recipe = this.recipeRepository.create({ ...data, tenantId });
    return this.recipeRepository.save(recipe);
  }

  async discountStockByDish(dishId: string, quantity: number, tenantId: string) {
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
}
