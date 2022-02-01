import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { RecipesService } from 'src/app/recipes.service';

@Component({
  selector: 'app-new-recipe',
  templateUrl: './new-recipe.page.html',
  styleUrls: ['./new-recipe.page.scss'],
})
export class NewRecipePage implements OnInit {
  form: FormGroup;
  constructor(
    private loadingController: LoadingController,
    private recipesService: RecipesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      imageUrl: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      preparation: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      ingredients: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
    });
  }

  onCreateRecipe() {
    if (!this.form.valid) {
      return;
    }
    this.loadingController
      .create({
        message: 'Creating Recipe...',
      })
      .then((loadingElement) => {
        loadingElement.present();
        this.recipesService
          .createRecipe(
            this.form.value.title,
            this.form.value.preparation,
            this.form.value.imageUrl,
            this.form.value.ingredients
          )
          .subscribe(
            () => {
              loadingElement.dismiss();
              this.form.reset();
              this.router.navigateByUrl('/recipes');
            },
            (err) => {
              loadingElement.dismiss();
              this.form.reset();
              this.router.navigateByUrl('/recipes');
            }
          );
      });
  }
}
