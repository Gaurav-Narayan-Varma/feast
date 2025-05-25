import { db } from "@/db.js";
import { chefUserProcedure } from "@/routes/trpc/trpcBase.js";
import { Recipe } from "@prisma/client";
import { z } from "zod";

const input = z.object({
  menuId: z.string(),
});

type listAvailableRecipesResponse = {
  recipes: Recipe[];
};

export const listAvailableRecipes = chefUserProcedure
  .input(input)
  .query<listAvailableRecipesResponse>(async ({ ctx, input }) => {
    const recipes = await db.recipe.findMany({
      where: {
        OR: [{ menuId: null }, { menuId: { not: input.menuId } }],
        chefUserId: ctx.chefUserId,
      },
    });

    return { recipes };
  });
