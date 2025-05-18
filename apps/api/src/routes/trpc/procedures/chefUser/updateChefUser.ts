import { db } from "../../../../db";
import { ChefUser } from "@prisma/client";
import { chefUserProcedure } from "../../trpcBase";
import { z } from "zod";

const input = z.object({
  data: z.object({
    stripeOnboardingComplete: z.boolean().optional(),
  }),
});

type UpdateChefUserResponse = {
  chefUser: ChefUser;
};

export const updateChefUser = chefUserProcedure
  .input(input)
  .mutation<UpdateChefUserResponse>(async ({ ctx, input }) => {
    try {
      const { data } = input;

    console.log("data", data);

    const chefUser = await db.chefUser.update({
        where: { id: ctx.chefUserId },
        data,
      });

      return { chefUser };
    } catch (error) {
      console.error("Error updating chef user", error);
      throw new Error("Error updating chef user");
    }
  });
