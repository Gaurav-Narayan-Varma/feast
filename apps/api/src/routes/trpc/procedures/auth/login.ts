import { Cookie } from "@feast/shared";
import { db } from "@/db.js";
import { nid } from "@/utils/generalUtils.js";
import { compare } from "bcryptjs";
import { z } from "zod";
import { publicProcedure } from "@/routes/trpc/trpcBase.js";

const input = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const login = publicProcedure
  .input(input)
  .mutation(async ({ input, ctx }) => {
    const { email, password } = input;

    const chefUser = await db.chefUser.findUnique({
      where: { email },
    });

    if (!chefUser) {
      throw new Error("No user found with that email");
    }

    const isPasswordValid = await compare(password, chefUser.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const session = await db.session.create({
      data: {
        id: nid(),
        chefUserId: chefUser.id,
      },
    });

    ctx.setCookie(Cookie.SessionId, session.id, {
      httpOnly: true,
      persistent: true,
    });

    return {
      success: true,
      message: "Login successful",
    };
  });
