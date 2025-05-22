import { db } from "@/db.js";
import {
  deleteImageVariants,
  generateS3Key,
  getImageSignedUrl,
  ImageQuality,
  S3Prefix,
  uploadImageToS3,
} from "@/utils/s3.js";
import { Readable } from "stream";
import { z } from "zod";
import { chefUserProcedure } from "../../trpcBase.js";

const input = z.object({
  name: z.string(),
  type: z.string(),
  base64: z.string(),
});

type Response = {
  pictureSignedUrl: string;
};

export const updateProfilePicture = chefUserProcedure
  .input(input)
  .mutation(async ({ ctx, input }): Promise<Response> => {
    const { base64, name, type } = input;

    const chef = await db.chefUser.findUniqueOrThrow({
      where: {
        id: ctx.chefUserId,
      },
    });

    // Convert base64 to buffer
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const multerFile: Express.Multer.File = {
      fieldname: "profilePicture",
      originalname: name,
      encoding: "7bit",
      mimetype: type,
      size: buffer.length,
      destination: "",
      filename: name,
      path: "",
      buffer,
      stream: Readable.from(buffer),
    };

    const baseKey = generateS3Key(
      S3Prefix.PROFILE_PICTURES,
      multerFile.originalname
    );

    await uploadImageToS3(multerFile, baseKey);

    if (chef.profilePictureKey) {
      await deleteImageVariants(chef.profilePictureKey);
    }

    await db.chefUser.update({
      where: { id: chef.id },
      data: { profilePictureKey: baseKey },
    });

    const pictureSignedUrl = await getImageSignedUrl(
      baseKey,
      ImageQuality.LARGE
    );

    return {
      pictureSignedUrl,
    };
  });
