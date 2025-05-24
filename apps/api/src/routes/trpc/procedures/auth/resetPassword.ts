import { db } from "@/db.js";
import z from "zod";
import { publicProcedure } from "../../trpcBase.js";
import { hash } from "bcryptjs";

const input = z.object({
  token: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
}); 

export const resetPassword = publicProcedure.input(input).mutation(async ({ input }) => {
  const { token, email, password } = input;

  const chefUser = await db.chefUser.findUniqueOrThrow({
    where: {
      email,
    },
  });

  if (chefUser.resetPasswordToken !== token) {
    throw new Error("Invalid reset password token");
  }

  if (chefUser.resetPasswordTokenExpires && chefUser.resetPasswordTokenExpires < new Date()) {
    throw new Error("Reset password link expired, please request a new one");
  }

  await db.chefUser.update({
    where: {
      id: chefUser.id,
    },
    data: {
      password: await hash(password, 12),
      resetPasswordToken: null,
      resetPasswordTokenExpires: null,
    },
  });

})
