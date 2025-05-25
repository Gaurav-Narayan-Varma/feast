import { MAX_COOKIE_AGE } from "@/constants.js";
import { db } from "@/db.js";
import { logoutChefUser } from "@/utils/authUtils.js";
import { Cookie } from "@feast/shared";
import { initTRPC, TRPCError } from "@trpc/server";
import { CookieSerializeOptions, parse, serialize } from "cookie";
import type { IncomingMessage, ServerResponse } from "http";
import { Context } from "vm";
import { ZodError } from "zod";

/**
 * Custom TRPC error formatter for zod errors
 *
 * This is a custom error formatter that formats the error message so that
 * the error message can be accessed in the front end the same way that
 * a regular error message is.
 */
export const t = initTRPC.context<Context>().create({
  errorFormatter(opts) {
    const { shape, error } = opts;
    if (error.code === "BAD_REQUEST" && error.cause instanceof ZodError) {
      /**
       * Get the first error message from the ZodError
       */
      const firstError = error.cause.errors[0];
      return {
        ...shape,
        message: firstError?.message || "Validation error",
        data: {
          ...shape.data,
          zodError: error.cause.flatten(),
        },
      };
    }

    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: null,
      },
    };
  },
});

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
          sameSite: "none",
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
    logoutChefUser(ctx);
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  if (!chefUser.isAdmin) {
    logoutChefUser(ctx);
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return opts.next();
});
