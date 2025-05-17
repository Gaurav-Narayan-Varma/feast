import { Cookie } from "../../../../constants";
import { db } from "../../../../db";
import { nid } from "../../../../utils/generalUtils";
import { compare } from "bcryptjs";
import { z } from "zod";
import { publicProcedure } from "../../trpcBase";

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
