import { Cookie } from "../../../../constants";
import { db } from "../../../../db";
import { chefUserProcedure } from "../../../../routes/trpc/trpcBase";
import { logoutChefUser } from "../../../../utils/authUtils";

type LogoutResponse = {};

export const logout = chefUserProcedure.mutation<LogoutResponse>(
  async ({ ctx }) => {
    const sessionId = ctx.getCookie(Cookie.SessionId);

    console.log("hello world");

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
