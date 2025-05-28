import { db } from "@/db.js";
import { adminProcedure } from "@/routes/trpc/trpcBase.js";
import { ChefUser, Menu } from "@prisma/client";

type ListChefUsersResponse = {
  chefUsers: (ChefUser & { menus: Menu[] })[];
};

export const listChefUsers = adminProcedure.query<ListChefUsersResponse>(
  async () => {
    const chefUsers = await db.chefUser.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        menus: true,
      },
    });

    return { chefUsers };
  }
);
