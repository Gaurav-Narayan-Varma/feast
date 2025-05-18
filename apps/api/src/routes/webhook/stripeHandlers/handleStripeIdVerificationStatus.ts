import { Request, Response } from "express";
import { db } from "../../../db";
import { stripe } from "../../../utils/stripe";

export async function handleStripeIdVerificationStatus(
  req: Request,
  res: Response<void>
) {
  let event;
  const signature = req.headers["stripe-signature"];

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature as string,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("Webhook signature verification failed:", err);
    return res.sendStatus(400);
  }

  /**
   * Not sure if I should set up webhook to notify FE when verification is completed
   * otherwise user might see verify button again after it's already verified
   *
   * At the same time, I think it verifies quickly enough (wait 5 seconds)
   * so that it's not a big deal and they won't see the button again
   */
  if (event.type === "identity.verification_session.verified") {
    if (event.data.object.status === "verified") {
      await db.chefUser.update({
        where: {
          id: event.data.object.metadata.chefUserId,
        },
        data: {
          isIdVerified: true,
          stripeVerificationSessionId: null,
        },
      });
      console.log(
        "Verification completed for user:",
        event.data.object.metadata.chefUserId
      );
    }
  } else if (event.type === "identity.verification_session.requires_input") {
    /**
     * If verification fails, clear verification session id
     * so that they user can try again at onboarding section
     */
    await db.chefUser.update({
      where: {
        id: event.data.object.metadata.chefUserId,
      },
      data: {
        isIdVerified: false,
        stripeVerificationSessionId: null,
      },
    });
  }

  res.status(200).json();
}
