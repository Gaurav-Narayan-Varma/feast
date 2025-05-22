import { db } from "@/db.js";
import { ChefUser } from "@prisma/client";
import { chefUserProcedure } from "@/routes/trpc/trpcBase.js";
import { z } from "zod";
import { Cuisine } from "@feast/shared";

const input = z.object({
  data: z.object({
    name: z.string(),
    bio: z.string().optional(),
    zipCode: z.string(),
    cuisines: z.array(z.nativeEnum(Cuisine)).optional(),
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
