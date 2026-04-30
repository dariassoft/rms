import { Repository } from 'typeorm';
import { Ingredient } from './entities/ingredient.entity';
import { Supplier } from './entities/supplier.entity';
import { Recipe } from './entities/recipe.entity';
export declare class InventoryService {
    private ingredientRepository;
    private supplierRepository;
    private recipeRepository;
    constructor(ingredientRepository: Repository<Ingredient>, supplierRepository: Repository<Supplier>, recipeRepository: Repository<Recipe>);
    findAllIngredients(tenantId: string): Promise<Ingredient[]>;
    createIngredient(tenantId: string, data: any): Promise<Ingredient[]>;
    findAllSuppliers(tenantId: string): Promise<Supplier[]>;
    createSupplier(tenantId: string, data: any): Promise<Supplier[]>;
    getRecipesByDish(dishId: string, tenantId: string): Promise<Recipe[]>;
    createRecipe(tenantId: string, data: any): Promise<Recipe[]>;
    discountStockByDish(dishId: string, quantity: number, tenantId: string): Promise<void>;
}
