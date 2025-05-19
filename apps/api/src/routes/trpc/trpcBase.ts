import { initTRPC, TRPCError } from "@trpc/server";
import { parse, serialize, SerializeOptions } from "cookie";
import type { IncomingMessage, ServerResponse } from "http";
import { Cookie, MAX_COOKIE_AGE } from "../../constants";
import { db } from "../../db";
import { logoutChefUser } from "../../utils/authUtils";

const t = initTRPC.create();

type SetCookieOptions = SerializeOptions & {
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

    const getCookieHeader = () => {
      const cookieHeader =
        req.headers instanceof Headers
          ? req.headers.get("cookie")
          : req.headers.cookie;

      if (!cookieHeader) {
        return;
      }

      return cookieHeader;
    };

    const getCookies = () => {
      const cookieHeader = getCookieHeader();

      if (!cookieHeader) {
        return {};
      }

      return parse(cookieHeader.toString());
    };

    const getCookie = (name: Cookie) => {
      const cookieHeader = getCookieHeader();

      if (!cookieHeader) {
        return;
      }

      const cookies = parse(cookieHeader.toString());

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
        serialize(name, value, {
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
        serialize(name, "", {
          secure: process.env.NODE_ENV === "production",
          domain: process.env.COOKIE_DOMAIN,
          path: "/",
          maxAge: 0,
        })
      );
    };

    return opts.next({
      ctx: {
        getCookieHeader,
        getCookies,
        getCookie,
        setCookie,
        deleteCookie,
      },
    });
  });

export const chefUserProcedure = publicProcedure.use(async (opts) => {
  const { ctx } = opts;

  /**
   * Next.js will sometimes wrap the headers in a Headers object,
   * so we need to check for that and access the cookie header accordingly.
   */
  const cookieHeader = ctx.getCookieHeader();

  if (!cookieHeader) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const parsedCookie = parse(cookieHeader) as Record<
    string,
    string | undefined
  >;
  const sessionId = parsedCookie[Cookie.SessionId];

  if (!sessionId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const session = await db.session.findUnique({
    where: {
      id: sessionId,
    },
  });

  if (!session) {
    logoutChefUser(ctx);
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return opts.next({
    ctx: {
      chefUserId: session.chefUserId,
    },
  });
});

export const adminProcedure = chefUserProcedure.use(async (opts) => {
  const { ctx } = opts;

  const chefUser = await db.chefUser.findUnique({
    where: {
      id: ctx.chefUserId,
    },
  });

  if (!chefUser) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  if (!chefUser.isAdmin) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return opts.next();
});
