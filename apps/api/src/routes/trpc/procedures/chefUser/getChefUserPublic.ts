import { db } from "@/db.js";
import { publicProcedure } from "@/routes/trpc/trpcBase.js";
import { getImageSignedUrl, ImageQuality } from "@/utils/s3.js";
import {
  ChefUser,
  DateOverride,
  Menu,
  Recipe,
  RecurringAvailability,
} from "@prisma/client";
import { z } from "zod";

const input = z.object({
  chefUserId: z.string(),
});

type GetChefUserResponse = {
  chefUser: ChefUser & {
    profilePictureUrl: string | null;
    recurringAvailabilities: RecurringAvailability[];
    dateOverrides: DateOverride[];
    menus: (Menu & {
      recipes: Recipe[];
    })[];
  };
};

export const getChefUserPublic = publicProcedure
  .input(input)
  .query<GetChefUserResponse>(async ({ input }) => {
    const chefUser = await db.chefUser.findUniqueOrThrow({
      where: { id: input.chefUserId },
      include: {
        menus: {
          include: {
            recipes: true,
          },
        },
      },
    });

    const profilePictureUrl = chefUser.profilePictureKey
      ? await getImageSignedUrl(chefUser.profilePictureKey, ImageQuality.LARGE)
      : null;

    const recurringAvailabilities = await db.recurringAvailability.findMany({
      where: { chefUserId: input.chefUserId },
      orderBy: { startTime: "asc" },
    });

    const dateOverrides = await db.dateOverride.findMany({
      where: {
        chefUserId: input.chefUserId,
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
        recurringAvailabilities,
        dateOverrides,
      },
    };
  });
