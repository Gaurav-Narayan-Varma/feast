import { ChefUser } from "@prisma/client";
import { db } from "@/db.js";
import { adminProcedure } from "@/routes/trpc/trpcBase.js";

type ListChefUsersResponse = {
  chefUsers: ChefUser[];
};

export const listChefUsers = adminProcedure.query<ListChefUsersResponse>(
  async () => {
    const chefUsers = await db.chefUser.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return { chefUsers };
  }
);
