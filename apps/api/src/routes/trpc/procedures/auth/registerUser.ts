import { hash } from "bcryptjs";
import { z } from "zod";
import { db } from "../../../../db";
import { sendVerificationEmail } from "../../../../utils/emailUtils";
import { nid } from "../../../../utils/generalUtils";
import { publicProcedure } from "../../trpcBase";

const input = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string(),
  zipCode: z.string(),
  phoneNumber: z.string().optional(),
});

export const registerUser = publicProcedure
  .input(input)
  .mutation(async ({ input }) => {
    const { email, password, name, zipCode, phoneNumber } = input;

    const existingVerifiedUser = await db.chefUser.findFirst({
      where: {
        email,
        emailVerified: true,
      },
    });

    if (existingVerifiedUser) {
      throw new Error("Email already registered");
    }

    /**
     * Delete any existing unverified users with this email, thus expiring any existing verification tokens
     *
     * Must convert email to lowercase, because Prisma is case-insensitive by default and we store all emails in lowercase in the db
     */
    await db.chefUser.deleteMany({
      where: {
        email: email.toLowerCase(),
        emailVerified: false,
      },
    });

    const verifyToken = nid();

    /**
     * Set expiration to 24 hours from now
     */
    const verifyTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const hashedPassword = await hash(password, 12);

    const chefUser = await db.chefUser.create({
      data: {
        id: nid(),
        email,
        password: hashedPassword,
        name,
        zipCode,
        phoneNumber,
        verifyToken,
        verifyTokenExpires,
      },
    });

    await sendVerificationEmail({
      email: chefUser.email,
      name: chefUser.name,
      verifyToken: verifyToken,
    });

    return {
      success: true,
      message:
        "Registration successful. Please check your email to verify your account.",
    };
  });
