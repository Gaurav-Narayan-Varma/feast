import { db } from "@/db.js";
import { publicProcedure } from "@/routes/trpc/trpcBase.js";
import { getImageSignedUrl, ImageQuality } from "@/utils/s3.js";
import { ChefUser, DateOverride, RecurringAvailability } from "@prisma/client";

type GetChefUserResponse = {
  chefUsers: (ChefUser & {
    profilePictureUrl: string | null;
    recurringAvailabilities: RecurringAvailability[];
    dateOverrides: DateOverride[];
  })[];
};

export const listChefUsersPublic = publicProcedure.query<GetChefUserResponse>(
  async () => {

    console.log("listChefUsersPublic");
    console.log("listChefUsersPublic");
    console.log("listChefUsersPublic");
    console.log("listChefUsersPublic");
    console.log("listChefUsersPublic");
    console.log("listChefUsersPublic");
    console.log("listChefUsersPublic");
    console.log("listChefUsersPublic");
    console.log("listChefUsersPublic");
    console.log("listChefUsersPublic");
    console.log("listChefUsersPublic");
    console.log("listChefUsersPublic");
    const chefUsers = await db.chefUser.findMany({
      where: {
        isApproved: true,
        isAdmin: false,
      },
      include: {
        recurringAvailabilities: true,
        dateOverrides: true,
      },
    });

    const chefUsersWithProfilePictureUrl = await Promise.all(
      chefUsers.map(async (chefUser) => {
        const profilePictureUrl = chefUser.profilePictureKey
          ? await getImageSignedUrl(
              chefUser.profilePictureKey,
              ImageQuality.LARGE
            )
          : null;

        return {
          ...chefUser,
          profilePictureUrl,
        };
      })
    );

    return {
      chefUsers: chefUsersWithProfilePictureUrl,
    };
  }
);
