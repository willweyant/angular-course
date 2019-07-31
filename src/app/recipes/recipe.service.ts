import { Recipe } from './recipe.model';
import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [
    new Recipe(1,
      'Chicken Schnitzel',
      'Best Schnitzel Recipe Ever!!!',
      'https://upload.wikimedia.org/wikipedia/commons/7/72/Schnitzel.JPG',
      [
        new Ingredient('Chicken Breast', 1),
        new Ingredient('French Fries', 20),
        new Ingredient('Lemon', 1)
      ]),
    new Recipe(2,
      'Spaghetti',
      'Just Like Grandma Rosa Used to Make!!!',
      'https://upload.wikimedia.org/wikipedia/commons/2/2a/Spaghetti_al_Pomodoro.JPG',
      [
        new Ingredient('Pasta Sauce', 1),
        new Ingredient('Noodles', 100),
        new Ingredient('Mozzarella Cheese', 2),
        new Ingredient('Parsley', 2)
      ])
  ];

  constructor(private shoppingListService: ShoppingListService) {}

  getRecipes() {
    // returns new array object
    return this.recipes.slice();
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }

  getRecipeById(id: number) {
    return this.recipes.find(recipe => recipe.id === id);
  }

  addRecipe(recipe: Recipe) {
    recipe.id = this.recipes[this.recipes.length - 1].id + 1;
    this.recipes.push(recipe);
    this.recipesChanged.next(this.getRecipes());
  }

  updateRecipe(newRecipe: Recipe) {
    console.log('newRecipe = ' + newRecipe);
    const recipeIndex = this.recipes.findIndex(recipe => recipe.id === newRecipe.id);
    this.recipes[recipeIndex] = newRecipe;
    this.recipesChanged.next(this.getRecipes());
  }

  deleteRecipe(recipe: Recipe) {
    this.recipes.splice(this.recipes.findIndex(existingRecipe => existingRecipe.id === recipe.id), 1);
    this.recipesChanged.next(this.getRecipes());
  }
}
