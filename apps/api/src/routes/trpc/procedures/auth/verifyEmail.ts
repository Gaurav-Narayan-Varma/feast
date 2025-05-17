import { publicProcedure } from "../../trpcBase";
import { z } from "zod";
import { db } from "../../../../db";

export const verifyEmail = publicProcedure
  .input(z.object({ token: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const chefUser = await db.chefUser.findFirst({
      where: {
        verifyToken: input.token,
        /**
         * Check that the token, or 'invite', has not expired
         */
        verifyTokenExpires: {
          gt: new Date()
        }
      }
    });

    if (!chefUser) {
      throw new Error("Expired email verification link, please register again");
    }

    await db.chefUser.update({
      where: { id: chefUser.id },
      data: {
        emailVerified: true,
        verifyToken: null,
        verifyTokenExpires: null
      }
    });

    return {
      success: true,
      message: "Email verified successfully. You can now log in.",
    };
  });