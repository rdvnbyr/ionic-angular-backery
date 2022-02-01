/* eslint-disable max-len */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from './recipes/recipes.model';
import { take, map, tap, delay, switchMap, filter } from 'rxjs/operators';
import { BehaviorSubject, of } from 'rxjs';
import { AuthService } from './auth/auth.service';

interface FetchedRecipe {
  createdAt: Date;
  imageUrl: string;
  ingredients: { material: string; size: string }[];
  preparation: string;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  private recipes = new BehaviorSubject<Recipe[]>([]);
  constructor(private http: HttpClient, private authService: AuthService) {}

  getRecipes() {
    return this.recipes.asObservable();
  }
  fetchRecipes() {
    const userId = 'user1';
    return this.http
      .get<{ [key: string]: FetchedRecipe }>(
        `https://crafts-unfolded-default-rtdb.europe-west1.firebasedatabase.app/recipes.json?orderBy="userId"&equalTo="${userId}"`
      )
      .pipe(
        map((res) => {
          const newRecipes = [];
          for (const key in res) {
            if (res.hasOwnProperty(key)) {
              const { title, imageUrl, ingredients, preparation, createdAt } =
                res[key];
              const newRecipe: Recipe = {
                title,
                imageUrl,
                ingredients,
                preparation,
                createdAt,
                userId,
                id: key,
              };
              newRecipes.push(newRecipe);
            }
          }
          return newRecipes;
        }),
        tap((recipes) => {
          this.recipes.next(recipes);
        })
      );
  }
  getRecipeById(recipeId: string) {
    return this.http
      .get(
        `https://crafts-unfolded-default-rtdb.europe-west1.firebasedatabase.app/recipes/${recipeId}.json`
      )
      .pipe(
        map((resp) => {
          const newRecipe = {
            ...resp,
            id: recipeId,
          };
          return newRecipe;
        })
      );
  }
  deleteRecipeById(recipeId: string) {
    return this.http
      .delete(
        `https://crafts-unfolded-default-rtdb.europe-west1.firebasedatabase.app/recipes/${recipeId}.json`
      )
      .pipe(
        switchMap(() => this.recipes),
        take(1),
        tap((recipes) => {
          this.recipes.next(recipes.filter((rp) => rp.id !== recipeId));
        })
      );
  }
  createRecipe(title: string, preparation: string, imageUrl: string) {
    return this.authService.getUserId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error('user id not found');
        }
        const newwRecipe: Recipe = {
          id: '',
          title,
          preparation,
          ingredients: [
            { material: 'floor', size: '200gr' },
            { material: 'oil', size: '5gr' },
            { material: 'salz', size: '2gr' },
          ],
          createdAt: new Date(),
          imageUrl,
          userId: 'user1',
        };
        return this.http.post<{ name: string }>(
          'https://crafts-unfolded-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
          { ...newwRecipe, id: null }
        );
      }),
      take(1),
      tap(() => this.recipes)
    );
  }

  updateRecipe(
    recipeId: string,
    title: string,
    preparation: string,
    imageUrl: string
  ) {
    console.log({ recipeId, title, preparation, imageUrl });
    let updatedRecipes: Recipe[];
    return this.recipes.pipe(
      take(1),
      switchMap((recipes) => {
        if (!recipes || recipes.length <= 0) {
          return this.fetchRecipes();
        } else {
          return of(recipes);
        }
      }),
      switchMap((recipes) => {
        const index = recipes.findIndex((rp) => rp.id === recipeId);

        updatedRecipes = [...recipes];
        updatedRecipes[index] = {
          ...updatedRecipes[index],
          title,
          preparation,
          imageUrl,
        };
        return this.http.put(
          `https://crafts-unfolded-default-rtdb.europe-west1.firebasedatabase.app/recipes/${recipeId}.json`,
          { ...updatedRecipes[index], id: null }
        );
      }),
      tap(() => {
        this.fetchRecipes();
      })
    );
  }
}
