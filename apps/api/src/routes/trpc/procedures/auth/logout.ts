import { Cookie } from "@feast/shared";
import { db } from "@/db.js";
import { chefUserProcedure } from "@/routes/trpc/trpcBase.js";
import { logoutChefUser } from "@/utils/authUtils.js";

type LogoutResponse = {};

export const logout = chefUserProcedure.mutation<LogoutResponse>(
  async ({ ctx }) => {
    const sessionId = ctx.getCookie(Cookie.SessionId);

    /**
     * If the sessionId is not found, the user is not logged in
     * and we can just return an empty object
     */
    if (!sessionId) {
      return {};
    }

    logoutChefUser(ctx);

    await db.session.delete({
      where: {
        id: sessionId,
      },
    });

    return {};
  }
);
