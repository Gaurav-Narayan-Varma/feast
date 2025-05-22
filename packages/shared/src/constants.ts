import { z } from "zod";
import { Cuisine, DietaryTags, FoodAllergen, PriceRange } from "./types";

export const recipeSchema = z.object({
  name: z.string().min(1, "Recipe name is required"),
  description: z.string().min(1, "Recipe description is required"),
  priceRange: z.nativeEnum(PriceRange),
  cuisines: z.array(z.nativeEnum(Cuisine)),
  dietaryTags: z.array(z.nativeEnum(DietaryTags)),
  foodAllergens: z.array(z.nativeEnum(FoodAllergen)),
  ingredients: z.array(
    z.object({
      name: z.string(),
      quantity: z.number(),
      unit: z.string(),
      preparation: z.string(),
    })
  ),
});

export const menuSchema = z.object({
  name: z.string().min(1, "Menu name is required"),
  description: z.string().min(1, "Menu description is required"),
  recipes: z.array(z.string()).nonempty("At least one recipe is required"),
});
