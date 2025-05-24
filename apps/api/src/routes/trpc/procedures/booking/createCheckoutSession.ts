import { db } from "@/db.js";
import { publicProcedure } from "@/routes/trpc/trpcBase.js";
import { stripe } from "@/utils/stripe.js";
import { z } from "zod";

const input = z.object({
  bookingId: z.string(),
});

type Response = {
  checkoutUrl: string;
};

export const createCheckoutSession = publicProcedure
  .input(input)
  .mutation<Response>(async ({ input }) => {
    const booking = await db.booking.findUniqueOrThrow({
      where: { id: input.bookingId },
    });

    const chefUser = await db.chefUser.findUniqueOrThrow({
      where: { id: booking.chefUserId },
    });

    if (!chefUser.stripeAccountId) {
      throw new Error("Chef has not set up payments yet");
    }

    // Calculate total amount
    const totalAmount = booking.items.reduce(
      (sum, item) => sum + item.recipe.price * item.quantity * 100, // in cents
      0
    );
    const platformFee = 250; // $2.50 in cents

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: booking.items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.recipe.name,
          },
          unit_amount: item.recipe.price * 100, // Convert to cents
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.FEAST_WEB_URL}/booking/loading?session_id={CHECKOUT_SESSION_ID}&booking_id=${input.bookingId}`,
      cancel_url: `${process.env.FEAST_WEB_URL}/booking/${input.bookingId}`,
      payment_intent_data: {
        application_fee_amount: platformFee,
        metadata: {
          chefUserId: booking.chefUserId,
          bookingDate: booking.appointmentAt.toISOString(),
          transferAmount: totalAmount - platformFee,
        },
        transfer_data: {
          destination: chefUser.stripeAccountId,
        },
      },
      metadata: {
        chefUserId: booking.chefUserId,
        bookingDate: booking.appointmentAt.toISOString(),
      },
    });

    return { checkoutUrl: session.url ?? "" };
  });
