import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import { corsOptions } from "@/constants.js";

import { approveChef } from "./procedures/admin/approveChefUser.js";
import { listChefUsers } from "./procedures/admin/listChefUsers.js";
import { login } from "./procedures/auth/login.js";
import { logout } from "./procedures/auth/logout.js";
import { registerUser } from "./procedures/auth/registerUser.js";
import { verifyEmail } from "./procedures/auth/verifyEmail.js";
import { getChefUser } from "./procedures/chefUser/getChefUser.js";
import { updateChefUser } from "./procedures/chefUser/updateChefUser.js";
import { get1099ContractLink } from "./procedures/onboarding/get1099ContractLink.js";
import { getOrCreateVerificationSession } from "./procedures/onboarding/getOrCreateVerificationSession.js";
import { getStripeOnboardingLink } from "./procedures/onboarding/getStripeOnboardingLink.js";
import { sign1099Contract } from "./procedures/onboarding/sign1099Contract.js";
import { trpcRouter } from "./trpcBase.js";

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
