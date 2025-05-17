import * as trpcExpress from "@trpc/server/adapters/express";
import * as cors from "cors";
import { corsOptions } from "../../../src/constants";

import { registerUser } from "./procedures/auth/registerUser";
import { trpcRouter } from "./trpcBase";
import { verifyEmail } from "./procedures/auth/verifyEmail";
import { login } from "./procedures/auth/login";

export const appRouter = trpcRouter({
  auth: trpcRouter({
    registerUser,
    verifyEmail,
    login,
  }),
});

export type AppRouter = typeof appRouter;

/**
 * Used by express to handle /trpc routes
 */
export const trpcExpressRouter = trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext: ({ req, res }) => ({ req, res }),
  middleware: cors(corsOptions),
});
