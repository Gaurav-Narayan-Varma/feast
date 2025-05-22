import { db } from "@/db.js";
import { chefUserProcedure } from "@/routes/trpc/trpcBase.js";
import { Menu } from "@prisma/client";
import { z } from "zod";

const inputSchema = z.object({
  menuId: z.string(),
});

type responseType = { menu: Menu };

export const deleteMenu = chefUserProcedure
  .input(inputSchema)
  .mutation<responseType>(async ({ ctx, input }) => {
    const menu = await db.menu.delete({
      where: {
        id: input.menuId,
      },
    });

    return { menu };
  });
