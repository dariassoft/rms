import { InventoryService } from './inventory.service';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    findAllIngredients(req: any): Promise<import("./entities/ingredient.entity").Ingredient[]>;
    createIngredient(req: any, data: any): Promise<import("./entities/ingredient.entity").Ingredient[]>;
    findAllSuppliers(req: any): Promise<import("./entities/supplier.entity").Supplier[]>;
    createSupplier(req: any, data: any): Promise<import("./entities/supplier.entity").Supplier[]>;
    createRecipe(req: any, data: any): Promise<import("./entities/recipe.entity").Recipe[]>;
}
