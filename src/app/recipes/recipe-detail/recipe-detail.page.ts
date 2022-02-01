import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { RecipesService } from 'src/app/recipes.service';
import { EditRecipeComponent } from '../edit-recipe/edit-recipe.component';
import { Recipe } from '../recipes.model';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.page.html',
  styleUrls: ['./recipe-detail.page.scss'],
})
export class RecipeDetailPage implements OnInit, OnDestroy {
  recipe: Recipe;
  isLoading = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private recipesService: RecipesService,
    private router: Router,
    private alertController: AlertController,
    private navController: NavController,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.activatedRoute.paramMap.subscribe((pm) => {
      if (!pm.has('recipeId')) {
        // this.router.navigate(['/recipes']);
        this.isLoading = false;
        this.navController.navigateBack('/recipes');
        return;
      }
      const id = pm.get('recipeId');
      this.recipesService.getRecipeById(id).subscribe((recipe: Recipe) => {
        this.recipe = recipe;
        this.isLoading = false;
      });
    });
  }

  ngOnDestroy() {
    console.log('on-destroy');
  }

  ionViewDidEnter() {
    console.log('did-enter');
  }
  ionViewDidLeave() {
    console.log('did-leave');
  }
  ionViewDidLoad() {
    console.log('did-load');
  }
  ionViewWillEnter() {}
  ionViewWillLeave() {
    console.log('will-leave');
  }

  onEditRecipe() {
    console.log('edit');
    this.modalController
      .create({
        component: EditRecipeComponent,
        componentProps: {
          recipe: this.recipe,
        },
      })
      .then((modal) => {
        modal.present();
        return modal.onDidDismiss();
      })
      .then((data) => {
        console.log(data);
        if (data.role === 'confirm') {
          console.log('confirmed!');
        }
      });
  }

  onDeleteRecipe() {
    this.alertController
      .create({
        header: 'Are you sure',
        message: 'Do you want to delete the recepi?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Delete',
            handler: () => {
              this.recipesService
                .deleteRecipeById(this.recipe.id)
                .subscribe((rec) => {
                  console.log(rec);
                });
              this.router.navigate(['/recipes']);
            },
          },
        ],
      })
      .then((alert) => alert.present())
      .catch();
  }
}
