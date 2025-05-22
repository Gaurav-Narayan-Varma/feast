import { db } from "@/db.js";
import { chefUserProcedure } from "@/routes/trpc/trpcBase.js";
import { Menu, Recipe } from "@prisma/client";

type MenuWithRecipes = Menu & {
  recipes: Recipe[];
};

type listMenusReturnType = {
  menus: MenuWithRecipes[];
};

export const listMenus = chefUserProcedure.query(async ({ ctx }) => {
  const menus = await db.menu.findMany({
    where: {
      chefUserId: ctx.chefUserId,
    },
    include: {
      recipes: true,
    },
  });
  return {
    menus,
  };
});
