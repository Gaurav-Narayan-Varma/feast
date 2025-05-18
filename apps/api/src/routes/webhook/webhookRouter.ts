import * as express from "express";
import { handleStripeIdVerificationStatus } from "./stripeHandlers/handleStripeIdVerificationStatus";

export const webhookRouter = express.Router();

export const errorHandler = (
  err: Error,
  _req: express.Request,
  res: express.Response
) => {
  console.error(err);
  res.sendStatus(500);
};

/**
 * Stripe webhooks require `express.raw`, so we handle them in a separate
 * router.
 */
const stripeWebhookRouter = express.Router();
stripeWebhookRouter.use(express.raw({ type: "application/json" }));

/**
 * Listens to:
 * identity.verification_session.verified
 * identity.verification_session.requires_input
 */
stripeWebhookRouter.post(
  "/stripe-id-verification-status",
  async (req: express.Request, res: express.Response) => {
    await handleStripeIdVerificationStatus(req, res);
  }
);

webhookRouter.use(stripeWebhookRouter);

webhookRouter.use(errorHandler);
