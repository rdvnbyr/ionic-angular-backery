export interface Recipe {
  id: string;
  title: string;
  imageUrl: string;
  ingredients: {
    material: string;
    size?: string;
    descrition?: string;
  }[];
  preparation: string;
  createdAt: Date;
  userId?: string;
}

export class RecipeClass {
  constructor(
    id: string,
    title: string,
    imageUrl: string,
    ingredients: {
      material: string;
      size?: string;
      description?: string;
    }[],
    preparation: string,
    createdAt: Date,
    userId: string
  ) {}
}
