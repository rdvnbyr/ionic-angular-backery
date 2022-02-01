import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecipeDetailPageRoutingModule } from './recipe-detail-routing.module';

import { RecipeDetailPage } from './recipe-detail.page';
import { EditRecipeComponent } from '../edit-recipe/edit-recipe.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecipeDetailPageRoutingModule,
  ],
  declarations: [RecipeDetailPage, EditRecipeComponent],
})
export class RecipeDetailPageModule {}
