/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';
import { RecipesService } from '../recipes.service';
import { Recipe } from './recipes.model';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss'],
})
export class RecipesPage implements OnInit {
  recipes: Recipe[] = [];
  isLoading = false;
  constructor(private recipesService: RecipesService) {}

  ngOnInit() {
    // console.log(this.recipes);
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.recipesService.fetchRecipes().subscribe();
    this.recipesService.getRecipes().subscribe((recipe) => {
      this.recipes = recipe;
      this.isLoading = false;
    });
  }
}
