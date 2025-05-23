import { db } from "@/db.js";
import { chefUserProcedure } from "@/routes/trpc/trpcBase.js";
import { z } from "zod";

const input = z.object({
  dateOverrideId: z.string(),
});

export const deleteDateOverride = chefUserProcedure
  .input(input)
  .mutation(async ({ ctx, input }) => {
    const { dateOverrideId } = input;

    await db.dateOverride.delete({
      where: {
        id: dateOverrideId,
        chefUserId: ctx.chefUserId,
      },
    });
  });
