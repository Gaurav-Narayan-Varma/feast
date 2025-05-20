import { db } from "@/db.js";
import { stripe } from "@/utils/stripe.js";
import { chefUserProcedure } from "@/routes/trpc/trpcBase.js";

type GetOrCreateVerificationSessionResponse = {
  sessionUrl: string;
  message: string;
};

export const getOrCreateVerificationSession =
  chefUserProcedure.mutation<GetOrCreateVerificationSessionResponse>(
    async ({ ctx }) => {
      const chefUser = await db.chefUser.findUniqueOrThrow({
        where: { id: ctx.chefUserId },
      });

      /**
       * If already verified, return empty session URL
       */
      if (chefUser.isIdVerified) {
        return {
          sessionUrl: "",
          message: "ID verification has already been completed",
        };
      }

      /**
       * If there is an existing session, return its' URL
       */
      if (chefUser.stripeVerificationSessionId) {
        const session = await stripe.identity.verificationSessions.retrieve(
          chefUser.stripeVerificationSessionId
        );

        if (session.url) {
          return {
            sessionUrl: session.url,
            message: "Using existing verification session",
          };
        }
      }

      /**
       * If no session exists, create a new verification session
       */
      const newSession = await stripe.identity.verificationSessions.create({
        type: "document",
        metadata: { chefUserId: chefUser.id },
        return_url: `${process.env.FEAST_WEB_URL}/chef-console/settings`,
      });

      if (!newSession.url) {
        throw new Error("Session URL is null");
      }

      await db.chefUser.update({
        where: { id: chefUser.id },
        data: {
          stripeVerificationSessionId: newSession.id,
        },
      });

      return {
        sessionUrl: newSession.url,
        message: "Created new verification session",
      };
    }
  );
