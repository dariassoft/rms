import { Dish } from '../../tenants/dish.entity';
import { Ingredient } from './ingredient.entity';
export declare class Recipe {
    id: string;
    dishId: string;
    dish: Dish;
    ingredientId: string;
    ingredient: Ingredient;
    quantity: number;
    tenantId: string;
}
