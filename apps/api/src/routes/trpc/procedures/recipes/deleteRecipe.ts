import { db } from "@/db.js";
import { chefUserProcedure } from "@/routes/trpc/trpcBase.js";
import { Recipe } from "@prisma/client";
import { z } from "zod";

const inputSchema = z.object({
  recipeId: z.string(),
});

type responseType = Recipe;

export const deleteRecipe = chefUserProcedure
  .input(inputSchema)
  .mutation<responseType>(async ({ ctx, input }) => {
    const existingRecipe = await db.recipe.findUnique({
      where: { id: input.recipeId },
      include: { menu: true },
    });

    if (!existingRecipe) {
      throw new Error("Recipe not found");
    }

    if (existingRecipe.menu) {
      throw new Error(
        `To delete recipe, first remove it from the following menu: ${existingRecipe.menu.name}`
      );
    }

    const recipe = await db.recipe.delete({
      where: {
        id: input.recipeId,
      },
    });
    return recipe;
  });
