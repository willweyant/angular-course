import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as RecipesActions from './recipe.actions';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../recipe.model';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

@Injectable()
export class RecipeEffects {

  constructor(private actions$: Actions, private httpClient: HttpClient, private store: Store<fromApp.AppState>) {}

  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(RecipesActions.FETCH_RECIPES),
    switchMap(() => {
      return this.httpClient
        .get<Recipe[]>('https://ng-course-recipe-book-de103.firebaseio.com/recipes.json'
      );
    }),
    map(recipes => {
      console.log('recipes length = ' + recipes.length);
      return recipes.map(recipe => {
        console.log('recipe name = ' + recipe.name);
        return {...recipe,
                ingredients: recipe.ingredients ? recipe.ingredients : []};
      });
    }),
    map(recipes => {
      return new RecipesActions.SetRecipes(recipes);
    })
  );

  @Effect({ dispatch: false })
  storeRecipes = this.actions$.pipe(
    ofType(RecipesActions.STORE_RECIPES),
    withLatestFrom(this.store.select('recipes')), //allows us to merge a value from one observable stream into this one
    switchMap(([actionData, recipesState]) => {
      return this.httpClient.put(
        'https://ng-course-recipe-book-de103.firebaseio.com/recipes.json',
        recipesState.recipes);
    })
  );
}
