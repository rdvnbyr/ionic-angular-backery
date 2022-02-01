import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecipesPage } from './recipes.page';

const routes: Routes = [
  {
    path: '',
    component: RecipesPage,
  },
  {
    path: 'new-recipe',
    loadChildren: () =>
      import('./new-recipe/new-recipe.module').then(
        (m) => m.NewRecipePageModule
      ),
  },
  {
    path: 'edit/:recipeId',
    loadChildren: () =>
      import('./edit-recipe/edit-recipe.module').then(
        (m) => m.EditRecipePageModule
      ),
  },
  {
    path: ':recipeId',
    loadChildren: () =>
      import('./recipe-detail/recipe-detail.module').then(
        (m) => m.RecipeDetailPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipesPageRoutingModule {}
