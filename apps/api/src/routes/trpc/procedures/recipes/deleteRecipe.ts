import { db } from "@/db.js";
import { chefUserProcedure } from "@/routes/trpc/trpcBase.js";
import { Recipe } from "@prisma/client";
import { z } from "zod";

const inputSchema = z.object({
  id: z.string(),
});

type responseType = Recipe;

export const deleteRecipe = chefUserProcedure
  .input(inputSchema)
  .mutation<responseType>(async ({ ctx, input }) => {
    const recipe = await db.recipe.delete({
      where: {
        id: input.id,
      },
    });
    return recipe;
  });
