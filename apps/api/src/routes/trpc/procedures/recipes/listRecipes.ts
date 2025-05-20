import { db } from "@/db.js";
import { chefUserProcedure } from "@/routes/trpc/trpcBase.js";
import { Recipe } from "@prisma/client";

type listRecipesResponse = {
  recipes: Recipe[];
};

export const listRecipes = chefUserProcedure.query<listRecipesResponse>(
  async ({ ctx }) => {
    const recipes = await db.recipe.findMany({
      where: { chefUserId: ctx.chefUserId },
    });

    return { recipes };
  }
);
