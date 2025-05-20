import { db } from "@/db.js";
import { adminProcedure } from "@/routes/trpc/trpcBase.js";
import { ChefUser } from "@prisma/client";
import { z } from "zod";

const input = z.object({
  chefId: z.string(),
});

type ApproveChefResponse = {
  chefUser: ChefUser;
};

export const approveChef = adminProcedure
  .input(input)
  .mutation<ApproveChefResponse>(async ({ ctx, input }) => {
    const chefToApprove = await db.chefUser.findUniqueOrThrow({
      where: { id: input.chefId },
    });

    if (
      !chefToApprove.isIdVerified ||
      !chefToApprove.stripeOnboardingComplete ||
      chefToApprove.form1099Status !== "Submitted"
    ) {
      throw new Error(
        "Chef must complete all onboarding steps before approval"
      );
    }

    const chefUser = await db.chefUser.update({
      where: { id: input.chefId },
      data: {
        isApproved: true,
        form1099Status: "Approved",
      },
    });

    return { chefUser };
  });
