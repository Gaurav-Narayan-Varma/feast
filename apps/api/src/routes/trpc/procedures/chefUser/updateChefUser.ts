import { db } from "@/db.js";
import { chefUserProcedure } from "@/routes/trpc/trpcBase.js";
import { Cuisine } from "@feast/shared";
import { ChefUser } from "@prisma/client";
import { z } from "zod";

const input = z.object({
  data: z
    .object({
      name: z.string().optional(),
      bio: z.string().optional(),
      zipCode: z.string().optional(),
      cuisines: z.array(z.nativeEnum(Cuisine)).optional(),
      stripeOnboardingComplete: z.boolean().optional(),
    })
    .partial(),
});

type UpdateChefUserResponse = {
  chefUser: ChefUser;
};

export const updateChefUser = chefUserProcedure
  .input(input)
  .mutation<UpdateChefUserResponse>(async ({ ctx, input }) => {
    try {
      const { data } = input;

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
