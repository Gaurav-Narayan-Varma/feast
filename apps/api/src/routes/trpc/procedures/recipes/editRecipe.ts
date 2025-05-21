import { db } from "@/db.js";
import { chefUserProcedure } from "@/routes/trpc/trpcBase.js";
import { recipeSchema } from "@feast/shared";
import z from "zod";

const editRecipeSchema = z.object({
  recipeId: z.string(),
  recipe: recipeSchema,
});

export const editRecipe = chefUserProcedure
  .input(editRecipeSchema)
  .mutation(async ({ input }) => {
    const recipe = await db.recipe.update({
      where: {
        id: input.recipeId,
      },
      data: {
        name: input.recipe.name,
        description: input.recipe.description,
        priceRange: input.recipe.priceRange,
        cuisines: input.recipe.cuisines,
        dietaryTags: input.recipe.dietaryTags,
        foodAllergens: input.recipe.foodAllergens,
        ingredients: input.recipe.ingredients,
      },
    });
    return recipe;
  });
