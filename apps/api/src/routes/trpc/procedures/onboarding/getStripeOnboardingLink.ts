import { db } from "@/db.js";
import { stripe } from "@/utils/stripe.js";
import { chefUserProcedure } from "@/routes/trpc/trpcBase.js";

type CreateStripeAccountResponse = {
  stripeAccountUrl: string;
};

/**
 * Gaurav TODO: setup handling verification updates, since verification requirements change over time
 * See video: https://www.youtube.com/watch?v=PfryNhLzZlg&ab_channel=StripeDevelopers
 */
export const getStripeOnboardingLink =
  chefUserProcedure.mutation<CreateStripeAccountResponse>(async ({ ctx }) => {
    let chefUser = await db.chefUser.findUniqueOrThrow({
      where: { id: ctx.chefUserId },
    });

    /**
     * If the chef user does not have a stripe account, create one
     */
    if (!chefUser.stripeAccountId) {
      const account = await stripe.accounts.create({
        country: "US",
        type: "express",
      });

      chefUser = await db.chefUser.update({
        where: { id: chefUser.id },
        data: { stripeAccountId: account.id },
      });
    }

    if (chefUser.stripeOnboardingComplete) {
      throw new Error("Stripe account onboarding complete");
    } else {
      const accountLink = await stripe.accountLinks.create({
        account: chefUser.stripeAccountId ?? "",
        refresh_url: `${process.env.FEAST_WEB_URL}/chef-console/stripe-return?status=refresh`,
        return_url: `${process.env.FEAST_WEB_URL}/chef-console/stripe-return?status=success`,
        type: "account_onboarding",
      });
      return { stripeAccountUrl: accountLink.url };
    }
  });
