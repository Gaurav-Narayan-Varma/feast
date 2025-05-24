import { db } from "@/db.js";
import { publicProcedure } from "@/routes/trpc/trpcBase.js";
import { sendResetPasswordEmail } from "@/utils/emailUtils.js";
import { nid } from "@/utils/generalUtils.js";
import { z } from "zod";

export const requestPasswordReset = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
    })
  )
  .mutation(async ({ input }) => {
    const { email } = input;

    const chefUser = await db.chefUser.findUnique({
      where: {
        email,
      },
    });

    if (!chefUser) {
      throw new Error("Email not found");
    }

    if (
      chefUser.resetPasswordTokenExpires &&
      new Date(new Date().getTime() - 1000 * 60 * 60 * 24) <
        chefUser.resetPasswordTokenExpires
    ) {
      throw new Error(
        "Password reset link sent within last 24 hours, please check your email inbox, including spam folder."
      );
    }

    const resetPasswordToken = nid();

    await db.chefUser.update({
      where: {
        id: chefUser.id,
      },
      data: {
        resetPasswordToken: resetPasswordToken,
        resetPasswordTokenExpires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });

    await sendResetPasswordEmail({
      email,
      resetPasswordToken,
    });
  });
