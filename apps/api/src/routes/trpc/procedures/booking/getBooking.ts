import { db } from "@/db.js";
import { publicProcedure } from "@/routes/trpc/trpcBase.js";
import { Booking, ChefUser } from "@prisma/client";
import { z } from "zod";

const input = z.object({
  bookingId: z.string(),
});

type Response = {
  booking: Booking & {
    chef: ChefUser;
  };
};

export const getBooking = publicProcedure
  .input(input)
  .query<Response>(async ({ input }) => {
    const booking = await db.booking.findUniqueOrThrow({
      where: { id: input.bookingId },
      include: {
        chef: true,
      },
    });

    return {
      booking: booking,
    };
  });
