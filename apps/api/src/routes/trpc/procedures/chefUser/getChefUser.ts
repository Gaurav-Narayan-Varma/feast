import { ChefUser } from "@prisma/client";
import { db } from "@/db.js";
import { chefUserProcedure } from "@/routes/trpc/trpcBase.js";

type GetChefUserResponse = {
  chefUser: ChefUser;
};

export const getChefUser = chefUserProcedure.query<GetChefUserResponse>(
  async ({ ctx }) => {
    const chefUser = await db.chefUser.findUniqueOrThrow({
      where: { id: ctx.chefUserId },
    });

    return { chefUser };
  }
);
