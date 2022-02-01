import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecipesPageRoutingModule } from './recipes-routing.module';

import { RecipesPage } from './recipes.page';
import { RecipesItemComponent } from './recipes-item/recipes-item.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RecipesPageRoutingModule],
  declarations: [RecipesPage, RecipesItemComponent],
  entryComponents: [RecipesItemComponent],
})
export class RecipesPageModule {}
