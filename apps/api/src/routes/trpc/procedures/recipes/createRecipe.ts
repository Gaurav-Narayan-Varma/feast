import { db } from "@/db.js";
import { chefUserProcedure } from "@/routes/trpc/trpcBase.js";
import { nid } from "@/utils/generalUtils.js";
import { recipeSchema } from "@feast/shared";

export const createRecipe = chefUserProcedure
  .input(recipeSchema)
  .mutation(async ({ ctx, input }) => {
    const recipe = await db.recipe.create({
      data: {
        id: nid(),
        chefUserId: ctx.chefUserId,
        name: input.name,
        description: input.description,
        priceRange: input.priceRange,
        cuisines: input.cuisines,
        dietaryTags: input.dietaryTags,
        foodAllergens: input.foodAllergens,
        ingredients: input.ingredients,
      },
    });
    return recipe;
  });
