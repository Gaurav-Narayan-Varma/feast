import { corsOptions } from "../../../src/constants";
import { logHelloWorld } from "./procedures/logHelloWorld";
import * as trpcExpress from "@trpc/server/adapters/express";
import * as cors from "cors";

import { trpcRouter } from "./trpcBase";

export const appRouter = trpcRouter({
  test: logHelloWorld,
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

