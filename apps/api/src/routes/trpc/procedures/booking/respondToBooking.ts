import { db } from "@/db.js";
import { chefUserProcedure } from "@/routes/trpc/trpcBase.js";
import { sendBookingAcceptedCustomerEmail, sendBookingRejectedCustomerEmail } from "@/utils/emailUtils.js";
import { z } from "zod";

const input = z.object({
  bookingId: z.string(),
  accept: z.boolean(),
});

type Response = {
  accepted: boolean;
};

export const respondToBooking = chefUserProcedure
  .input(input)
  .mutation<Response>(async ({ input, ctx }) => {
    const booking = await db.booking.findUniqueOrThrow({
      where: { id: input.bookingId },
      include: {
        chef: true,
      },
    });

    await db.booking.update({
      where: { id: input.bookingId },
      data: {
        timeChefAcceptedAt: input.accept ? new Date() : null,
        timeChefRejectedAt: !input.accept ? new Date() : null,
      },
    });

    if (input.accept) {
      await sendBookingAcceptedCustomerEmail({
        email: booking.customerEmail,
        bookingId: booking.id,
        chefName: booking.chef.name,
      });
    } else {
      await sendBookingRejectedCustomerEmail({
        email: booking.customerEmail,
        chefId: booking.chef.id,
        chefName: booking.chef.name,
      });
    }

    return {
      accepted: input.accept,
    };
  });
