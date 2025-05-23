import { db } from "@/db.js";
import { chefUserProcedure } from "@/routes/trpc/trpcBase.js";
import { getImageSignedUrl, ImageQuality } from "@/utils/s3.js";
import { ChefUser, RecurringAvailability } from "@prisma/client";

type GetChefUserResponse = {
  chefUser: ChefUser & {
    profilePictureUrl: string | null;
    availabilities: RecurringAvailability[];
  };
};

export const getChefUser = chefUserProcedure.query<GetChefUserResponse>(
  async ({ ctx }) => {
    const chefUser = await db.chefUser.findUniqueOrThrow({
      where: { id: ctx.chefUserId },
    });

    const profilePictureUrl = chefUser.profilePictureKey
      ? await getImageSignedUrl(chefUser.profilePictureKey, ImageQuality.LARGE)
      : null;

    const availabilities = await db.recurringAvailability.findMany({
      where: { chefUserId: ctx.chefUserId },
      orderBy: { startTime: "asc" },
    });

    return { chefUser: { ...chefUser, profilePictureUrl, availabilities } };
  }
);
