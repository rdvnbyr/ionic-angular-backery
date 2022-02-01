import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { RecipesService } from 'src/app/recipes.service';
import { Recipe } from '../recipes.model';

@Component({
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.page.html',
  styleUrls: ['./edit-recipe.page.scss'],
})
export class EditRecipePage implements OnInit {
  recipe: Recipe;
  recipeId: string;
  form: FormGroup;
  isLoading = false;
  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private recipesService: RecipesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((pm) => {
      if (!pm.has('recipeId')) {
        this.navController.navigateBack('/recipes');
        return;
      }
      this.isLoading = true;
      this.recipeId = pm.get('recipeId');
      this.recipesService
        .getRecipeById(this.recipeId)
        .subscribe((recipe: Recipe) => {
          this.recipe = recipe;
          const { title, imageUrl, preparation } = this.recipe;
          this.form = new FormGroup({
            title: new FormControl(title, {
              updateOn: 'blur',
              validators: [Validators.required],
            }),
            imageUrl: new FormControl(imageUrl, {
              updateOn: 'blur',
              validators: [Validators.required],
            }),
            preparation: new FormControl(preparation, {
              updateOn: 'blur',
              validators: [Validators.required],
            }),
          });
          this.isLoading = false;
        });
    });
  }
  onUpdateRecipe() {
    if (!this.form.valid) {
      return;
    }
    const { title, imageUrl, preparation } = this.form.value;
    this.recipesService
      .updateRecipe(this.recipe.id, title, preparation, imageUrl)
      .subscribe(() => {
        this.form.reset();
        this.router.navigateByUrl('/recipes');
      });
  }

  closeEditRecipe() {
    console.log('navigate');
    this.router.navigateByUrl('/recipes');
  }
}
