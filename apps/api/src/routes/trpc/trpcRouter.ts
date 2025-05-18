import * as trpcExpress from "@trpc/server/adapters/express";
import * as cors from "cors";
import { corsOptions } from "../../../src/constants";

import { registerUser } from "./procedures/auth/registerUser";
import { trpcRouter } from "./trpcBase";
import { verifyEmail } from "./procedures/auth/verifyEmail";
import { login } from "./procedures/auth/login";
import { logout } from "./procedures/auth/logout";
import { getOrCreateVerificationSession } from "./procedures/onboarding/getOrCreateVerificationSession";
import { getChefUser } from "./procedures/chefUser/getChefUser";
import { getStripeOnboardingLink } from "./procedures/onboarding/getStripeOnboardingLink";
import { updateChefUser } from "./procedures/chefUser/updateChefUser";
import { sign1099Contract } from "./procedures/onboarding/sign1099Contract";
import { get1099ContractLink } from "./procedures/onboarding/get1099ContractLink";
import { listChefUsers } from "./procedures/admin/listChefUsers";
import { approveChef } from "./procedures/admin/approveChefUser";

export const appRouter = trpcRouter({
  auth: trpcRouter({
    registerUser,
    verifyEmail,
    login,
    logout,
  }),
  admin: trpcRouter({
    listChefUsers,
    approveChef,
  }),
  onboarding: trpcRouter({
    getOrCreateVerificationSession,
    getStripeOnboardingLink,
    sign1099Contract,
    get1099ContractLink,
  }),
  chefUser: trpcRouter({
    getChefUser,
    updateChefUser,
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
