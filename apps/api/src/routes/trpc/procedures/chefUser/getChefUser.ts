import { ChefUser } from "@prisma/client";
import { db } from "@/db.js";
import { chefUserProcedure } from "@/routes/trpc/trpcBase.js";
import { ImageQuality } from "@/utils/s3.js";
import { getImageSignedUrl } from "@/utils/s3.js";

type GetChefUserResponse = {
  chefUser: ChefUser & {
    profilePictureUrl: string | null;
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

    return { chefUser: { ...chefUser, profilePictureUrl } };
  }
);
