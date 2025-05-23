import { corsOptions } from "@/constants.js";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import { approveChef } from "./procedures/admin/approveChefUser.js";
import { listChefUsers } from "./procedures/admin/listChefUsers.js";
import { login } from "./procedures/auth/login.js";
import { logout } from "./procedures/auth/logout.js";
import { registerUser } from "./procedures/auth/registerUser.js";
import { verifyEmail } from "./procedures/auth/verifyEmail.js";
import { addDateOverride } from "./procedures/availability/addDateOverride.js";
import { addRecurringAvailability } from "./procedures/availability/addRecurringAvailability.js";
import { deleteDateOverride } from "./procedures/availability/deleteDateOverride.js";
import { deleteRecurringAvailability } from "./procedures/availability/deleteRecurringAvailability.js";
import { getChefUser } from "./procedures/chefUser/getChefUser.js";
import { updateChefUser } from "./procedures/chefUser/updateChefUser.js";
import { updateProfilePicture } from "./procedures/chefUser/updateProfilePicture.js";
import { createMenu } from "./procedures/menus/createMenu.js";
import { deleteMenu } from "./procedures/menus/deleteMenu.js";
import { listMenus } from "./procedures/menus/listMenus.js";
import { updateMenu } from "./procedures/menus/updateMenu.js";
import { get1099ContractLink } from "./procedures/onboarding/get1099ContractLink.js";
import { getOrCreateVerificationSession } from "./procedures/onboarding/getOrCreateVerificationSession.js";
import { getStripeOnboardingLink } from "./procedures/onboarding/getStripeOnboardingLink.js";
import { sign1099Contract } from "./procedures/onboarding/sign1099Contract.js";
import { createRecipe } from "./procedures/recipes/createRecipe.js";
import { deleteRecipe } from "./procedures/recipes/deleteRecipe.js";
import { editRecipe } from "./procedures/recipes/editRecipe.js";
import { listAvailableRecipes } from "./procedures/recipes/listAvailableRecipes.js";
import { listRecipes } from "./procedures/recipes/listRecipes.js";
import { removeRecipeFromMenu } from "./procedures/recipes/removeRecipeFromMenu.js";
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
    updateProfilePicture,
  }),
  recipes: trpcRouter({
    createRecipe,
    listRecipes,
    deleteRecipe,
    editRecipe,
    listAvailableRecipes,
  }),
  menus: trpcRouter({
    createMenu,
    listMenus,
    updateMenu,
    removeRecipeFromMenu,
    deleteMenu,
  }),
  availability: trpcRouter({
    addRecurringAvailability,
    deleteRecurringAvailability,
    addDateOverride,
    deleteDateOverride,
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
