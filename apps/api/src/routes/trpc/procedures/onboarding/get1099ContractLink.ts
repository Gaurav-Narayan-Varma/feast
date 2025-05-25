import { getSignedUrlUtil } from "@/utils/s3.js";
import { db } from "@/db.js";
import { chefUserProcedure } from "@/routes/trpc/trpcBase.js";

type Response = {
  contractUrl: string;
};

export const get1099ContractLink = chefUserProcedure.query<Response>(
  async ({ ctx }) => {

    const chefUser = await db.chefUser.findUniqueOrThrow({
      where: { id: ctx.chefUserId },
    });

    if (!chefUser.form1099DocumentKey) {
      throw new Error("No 1099 contract found. Please reach out to support.");
    }

    const contractUrl = await getSignedUrlUtil(chefUser.form1099DocumentKey);
    
    return {
      contractUrl,
    };
  }
);
