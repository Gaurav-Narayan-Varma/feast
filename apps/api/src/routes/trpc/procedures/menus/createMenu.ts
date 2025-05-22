import { db } from "@/db.js";
import { chefUserProcedure } from "@/routes/trpc/trpcBase.js";
import { nid } from "@/utils/generalUtils.js";
import { menuSchema } from "@feast/shared";
import { Menu } from "@prisma/client";

type CreateMenuResponse = {
  menu: Menu;
};

export const createMenu = chefUserProcedure
  .input(menuSchema)
  .mutation<CreateMenuResponse>(async ({ ctx, input }) => {
    /**
     * We are manually checking this because recipes > 0 zod validator
     * is not working.
     */
    if (input.recipes.length === 0) {
      throw new Error("At least one recipe is required");
    }

    const menu = await db.menu.create({
      data: {
        id: nid(),
        name: input.name,
        description: input.description,
        recipes: {
          connect: input.recipes.map((recipeId) => ({ id: recipeId })),
        },
        chefUserId: ctx.chefUserId,
      },
    });

    return { menu };
  });
