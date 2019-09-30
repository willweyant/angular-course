import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from '../recipe.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as RecipeActions from '../store/recipe.actions';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  recipeId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    // switchMap used to switch from route params observable to the store observable
    this.route.params
      .pipe(
        map(params => {
          console.log('params = ' + params);
          return +params['id'];
        }),
        switchMap(recipeId => {
          console.log('recipeId = ' + recipeId);
          this.recipeId = recipeId;
          return this.store.select('recipes');
        }),
        map(recipesState => {
          return recipesState.recipes.find((recipe, index) => {
            return index === this.recipeId;
          });
        })
      )
      .subscribe(recipe => {
        console.log('recipe = ' + recipe);
        this.recipe = recipe;
      });
  }

  onAddIngredientsToShoppingList() {
    this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipe.ingredients));
  }

  onEditRecipe() {
    this.router.navigate(['edit'], {relativeTo: this.route});
    // Example of more complex navigation: //this.router.navigate(['../', this.recipeId, 'edit'], {relativeTo: this.route});
  }

  onDeleteRecipe() {
    this.store.dispatch(new RecipeActions.DeleteRecipe(this.recipeId));
    this.router.navigate(['/recipes']);
  }
}
