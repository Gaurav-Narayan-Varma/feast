import { db } from "@/db.js";
import { chefUserProcedure } from "@/routes/trpc/trpcBase.js";
import { z } from "zod";

const inputSchema = z.object({
  menuId: z.string(),
  recipeId: z.string(),
});

type responseType = {
  recipeId: string;
};

export const removeRecipeFromMenu = chefUserProcedure
  .input(inputSchema)
  .mutation<responseType>(async ({ ctx, input }) => {
    await db.menu.update({
      where: {
        id: input.menuId,
      },
      data: {
        recipes: {
          disconnect: {
            id: input.recipeId,
          },
        },
      },
    });

    return { recipeId: input.recipeId };
  });
