import { db } from "@/db.js";
import { publicProcedure } from "@/routes/trpc/trpcBase.js";
import {
  sendBookingCreatedChefEmail,
  sendBookingCreatedCustomerEmail,
} from "@/utils/emailUtils.js";
import { nid } from "@/utils/generalUtils.js";
import z from "zod";

const input = z.object({
  chefUserId: z.string(),
  cart: z.array(
    z.object({
      recipe: z.object({
        id: z.string(),
        name: z.string(),
        price: z.number(),
      }),
      quantity: z.number(),
    })
  ),
  appointmentAt: z.string(),
  customerEmail: z.string().email(),
  customerAddress: z.string(),
});

export const createBooking = publicProcedure
  .input(input)
  .mutation(async ({ input }) => {
    const chef = await db.chefUser.findUniqueOrThrow({
      where: {
        id: input.chefUserId,
      },
    });

    const booking = await db.booking.create({
      data: {
        id: nid(),
        appointmentAt: input.appointmentAt,
        chefUserId: input.chefUserId,
        timeCustomerRequestedAt: new Date(),
        items: input.cart,
        customerEmail: input.customerEmail,
        totalAmount: input.cart.reduce(
          (acc, item) => acc + item.recipe.price * item.quantity,
          0
        ),
        customerAddress: input.customerAddress,
      },
    });

    await sendBookingCreatedCustomerEmail({
      email: input.customerEmail,
      bookingId: booking.id,
      chefName: chef.name,
    });

    await sendBookingCreatedChefEmail({
      email: chef.email,
      bookingId: booking.id,
    });

    return { booking };
  });
