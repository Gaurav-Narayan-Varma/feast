import { db } from "@/db.js";
import { chefUserProcedure } from "@/routes/trpc/trpcBase.js";
import { menuSchema } from "@feast/shared";
import { Menu } from "@prisma/client";
import { z } from "zod";

const updateMenuSchema = z.object({
  menuId: z.string(),
  menu: menuSchema,
});

type UpdateMenuResponse = {
  menu: Menu;
};

export const updateMenu = chefUserProcedure
  .input(updateMenuSchema)
  .mutation<UpdateMenuResponse>(async ({ ctx, input }) => {
    /**
     * We are manually checking this because recipes > 0 zod validator
     * is not working.
     */
    if (input.menu.recipes.length === 0) {
      throw new Error("At least one recipe is required");
    }

    const menu = await db.menu.update({
      where: {
        id: input.menuId,
      },
      data: {
        name: input.menu.name,
        description: input.menu.description,
        recipes: {
          connect: input.menu.recipes.map((recipeId) => ({ id: recipeId })),
        },
      },
    });

    return { menu };
  });
