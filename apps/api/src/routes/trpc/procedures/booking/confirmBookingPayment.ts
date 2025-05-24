import { db } from "@/db.js";
import { publicProcedure } from "@/routes/trpc/trpcBase.js";
import { sendBookingPaidChefEmail } from "@/utils/emailUtils.js";
import { stripe } from "@/utils/stripe.js";
import { Booking } from "@prisma/client";
import { z } from "zod";

const input = z.object({
  bookingId: z.string(),
  stripeSessionId: z.string(),
  timeCustomerPaidAt: z.string(),
});

type Response = {
  booking: Booking;
};

export const confirmBookingPayment = publicProcedure
  .input(input)
  .mutation<Response>(async ({ input }) => {
    const stripeSession = await stripe.checkout.sessions.retrieve(
      input.stripeSessionId
    );

    if (stripeSession.payment_status !== "paid") {
      throw new Error("Payment not confirmed");
    }

    const booking = await db.booking.update({
      where: { id: input.bookingId },
      data: {
        timeCustomerPaidAt: input.timeCustomerPaidAt,
      },
      include: {
        chef: true,
      },
    });

    await sendBookingPaidChefEmail({
      email: booking.chef.email,
      bookingId: booking.id,
    });

    return { booking };
  });
