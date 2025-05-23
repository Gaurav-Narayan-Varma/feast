import { db } from "@/db.js";
import { chefUserProcedure } from "@/routes/trpc/trpcBase.js";
import z from "zod";

const input = z.object({
  recurringAvailabilityId: z.string(),
});

export const deleteRecurringAvailability = chefUserProcedure
  .input(input)
  .mutation(async ({ ctx, input }) => {
    const { recurringAvailabilityId } = input;

    await db.recurringAvailability.delete({
      where: { id: recurringAvailabilityId, chefUserId: ctx.chefUserId },
    });
  });
