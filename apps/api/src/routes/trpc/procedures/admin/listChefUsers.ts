import { ChefUser } from "@prisma/client";
import { db } from "../../../../db";
import { adminProcedure } from "../../trpcBase";

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
