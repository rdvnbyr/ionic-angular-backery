import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewRecipePageRoutingModule } from './new-recipe-routing.module';

import { NewRecipePage } from './new-recipe.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    NewRecipePageRoutingModule,
  ],
  declarations: [NewRecipePage],
})
export class NewRecipePageModule {}
