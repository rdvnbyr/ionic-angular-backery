import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Recipe } from '../recipes.model';

@Component({
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.scss'],
})
export class EditRecipeComponent implements OnInit {
  @Input() recipe: Recipe;
  constructor(private modalController: ModalController) {}

  ngOnInit() {}
  onClose() {
    this.modalController.dismiss(null, 'cancel');
  }
  onSave() {
    this.modalController.dismiss(this.recipe, 'confirm');
  }
}
