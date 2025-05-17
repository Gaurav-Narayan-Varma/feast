import { Cookie, MAX_COOKIE_AGE } from "../../../src/constants";
import { initTRPC } from "@trpc/server";
import cookie, { CookieSerializeOptions } from "cookie";
import type { IncomingMessage, ServerResponse } from "http";

const t = initTRPC.create();

type SetCookieOptions = CookieSerializeOptions & {
  /**
   * Sets the Max-Age value to 1 year
   */
  persistent?: boolean;
};

export const trpcRouter = t.router;

export const publicProcedure = t.procedure
  /**
   * NOP middleware -- just for typing
   */
  .use((opts) => {
    const { ctx } = opts;
    const { req, res } = ctx as { req: IncomingMessage; res: ServerResponse };

    return opts.next({
      ctx: {
        req,
        res,
      },
    });
  })
  /**
   * Cookie helpers
   */
  .use((opts) => {
    const { req, res } = opts.ctx;

    const getCookies = () => {
      const cookieHeader = req.headers["Cookie"] ?? req.headers["cookie"];
      if (!cookieHeader) return {};
      return cookie.parse(cookieHeader.toString());
    };

    const getCookie = (name: Cookie) => {
      const cookieHeader = req.headers["Cookie"] ?? req.headers["cookie"];
      if (!cookieHeader) return;
      const cookies = cookie.parse(cookieHeader.toString());
      return cookies[name];
    };

    const setCookie = (
      name: Cookie,
      value: string,
      options?: SetCookieOptions
    ) => {
      const { persistent, ...defaultOptions } = options ?? {};

      res.appendHeader(
        "Set-Cookie",
        cookie.serialize(name, value, {
          secure: process.env.NODE_ENV === "production",
          domain: process.env.COOKIE_DOMAIN,
          path: "/",
          ...(persistent ? { maxAge: MAX_COOKIE_AGE } : {}),
          ...defaultOptions,
        })
      );
    };

    const deleteCookie = (name: Cookie) => {
      res.appendHeader(
        "Set-Cookie",
        cookie.serialize(name, "", {
          secure: process.env.NODE_ENV === "production",
          domain: process.env.COOKIE_DOMAIN,
          path: "/",
          maxAge: 0,
        })
      );
    };

    return opts.next({
      ctx: {
        getCookies,
        getCookie,
        setCookie,
        deleteCookie,
      },
    });
  });

  /**
   * TODO: Implement userProcedure
   */
// export const userWithoutWorkspaceProcedure = publicProcedure.use(
//   async (opts) => {
//     const { ctx } = opts;

//     const cookieHeader = ctx.req.headers["cookie"];

//     if (!cookieHeader) {
//       logoutUser(ctx);
//       throw new TRPCError({ code: "UNAUTHORIZED" });
//     }

//     const parsedCookie = cookie.parse(cookieHeader) as Record<
//       string,
//       string | undefined
//     >;
//     let userId = parsedCookie[Cookie.UserId];
//     const sessionId = parsedCookie[Cookie.SessionId];
//     let workspaceId = parsedCookie[Cookie.WorkspaceId];
//     const viewAsUserId = parsedCookie[Cookie.ViewAsUserId];
//     const viewAsWorkspaceId = parsedCookie[Cookie.ViewAsWorkspaceId];

//     if (!userId || !sessionId) {
//       logoutUser(ctx);
//       throw new TRPCError({ code: "UNAUTHORIZED" });
//     }

//     const session = await db.session.findUnique({
//       where: {
//         id: sessionId,
//         userId,
//       },
//     });

//     if (!session) {
//       logoutUser(ctx);
//       throw new TRPCError({ code: "UNAUTHORIZED" });
//     }

//     const user = await db.user.findUnique({
//       where: {
//         id: userId,
//       },
//       select: {
//         enabled: true,
//       },
//     });

//     if (!user?.enabled) {
//       logoutUser(ctx);
//       throw new TRPCError({ code: "UNAUTHORIZED" });
//     }

//     if (viewAsUserId) {
//       const user = await db.user.findUnique({
//         where: {
//           id: userId,
//         },
//       });

//       if (!user?.isSuperUser || !viewAsWorkspaceId) {
//         logoutUser(ctx);
//         throw new TRPCError({ code: "UNAUTHORIZED" });
//       }

//       userId = viewAsUserId;
//       workspaceId = viewAsWorkspaceId;
//     }

//     return opts.next({
//       ctx: {
//         userId,
//         workspaceId,
//       },
//     });
//   },
// );
