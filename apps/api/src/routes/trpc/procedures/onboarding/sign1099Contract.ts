import {
  generateS3Key,
  generateSigned1099Pdf,
  S3Prefix,
  uploadToS3,
} from "../../../../utils/s3";
import { Form1099Status } from "@prisma/client";
import { z } from "zod";
import { db } from "../../../../db";
import { chefUserProcedure } from "../../../../routes/trpc/trpcBase";

const input = z.object({
  fullName: z.string(),
});

export const sign1099Contract = chefUserProcedure
  .input(input)
  .mutation<void>(async ({ ctx, input }) => {
    const chefUser = await db.chefUser.findUniqueOrThrow({
      where: { id: ctx.chefUserId },
    });

    if (chefUser.legalName !== input.fullName) {
      throw new Error("Legal name does not match");
    }

    if (!chefUser.isIdVerified) {
      throw new Error("ID verification has not been completed");
    }

    /**
     * Generate today's date in MM/DD/YYYY format
     */
    const today = new Date();
    const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;

    /**
     * Generate the PDF with chef's legal name and today's date
     */
    const pdfBuffer = await generateSigned1099Pdf(
      formattedDate,
      chefUser.legalName
    );

    // Generate a unique S3 key for the document
    const key = generateS3Key(
      S3Prefix.CONTRACTS_1099,
      `1099_contract_${chefUser.id}.pdf`,
      chefUser.id
    );

    // Upload to S3
    await uploadToS3(pdfBuffer, key, "application/pdf", {
      chefId: chefUser.id,
      documentType: "1099-contract",
      signedDate: formattedDate,
    });

    await db.chefUser.update({
      where: { id: chefUser.id },
      data: {
        form1099DocumentKey: key,
        form1099Status: Form1099Status.Submitted,
      },
    });
  });
