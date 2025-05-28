import { db } from "@/db.js";
import { chefUserProcedure } from "@/routes/trpc/trpcBase.js";
import { getImageSignedUrl, ImageQuality } from "@/utils/s3.js";
import { ChefUser, DateOverride, Menu, RecurringAvailability, Booking } from "@prisma/client";

type GetChefUserResponse = {
  chefUser: ChefUser & {
    profilePictureUrl: string | null;
    availabilities: RecurringAvailability[];
    dateOverrides: DateOverride[];
    bookings: Booking[];
    menus: Menu[];
  };
};

export const getChefUser = chefUserProcedure.query<GetChefUserResponse>(
  async ({ ctx }) => {
    const chefUser = await db.chefUser.findUniqueOrThrow({
      where: { id: ctx.chefUserId },
      include: {
        bookings: true,
        menus: true,
      },
    });

    const profilePictureUrl = chefUser.profilePictureKey
      ? await getImageSignedUrl(chefUser.profilePictureKey, ImageQuality.LARGE)
      : null;

    const availabilities = await db.recurringAvailability.findMany({
      where: { chefUserId: ctx.chefUserId },
      orderBy: { startTime: "asc" },
    });

    const dateOverrides = await db.dateOverride.findMany({
      where: {
        chefUserId: ctx.chefUserId,
        startTime: {
          gte: new Date(new Date().setHours(0, 0, 0, 0) - 24 * 60 * 60 * 1000),
        },
      },
      orderBy: { startTime: "asc" },
    });

    return {
      chefUser: {
        ...chefUser,
        profilePictureUrl,
        availabilities,
        dateOverrides,
      },
    };
  }
);
