import { Resend } from "resend";
import { sleep } from "./generalUtils";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string[] | string;
  subject: string;
  html: string;
  text: string;
}): Promise<string> {
  const MAX_RETRIES = 5;
  let attemptNumber = 0;

  while (attemptNumber <= MAX_RETRIES) {
    try {
      const response = await resend.emails.send({
        from: "Feast <feast-team@joinfeastco.com>",
        to,
        subject,
        html,
        text,
      });

      if (!response.data) {
        if (response.error?.name === "rate_limit_exceeded") {
          attemptNumber++;

          if (attemptNumber > MAX_RETRIES) {
            throw new Error(
              `Max retries reached for rate limit error: ${JSON.stringify(response)}`
            );
          }

          const delay = Math.floor(Math.random() * 4000) + 1000;
          console.log(
            `Rate limit hit, attempt ${attemptNumber}/${MAX_RETRIES}. Retrying in ${delay}ms...`
          );
          await sleep(delay);
          continue;
        }

        throw new Error(`Resend error: ${JSON.stringify(response)}`);
      }

      return response.data.id;
    } catch (error) {
      throw new Error(`No response received from Resend: ${error}`);
    }
  }

  throw new Error("Failed to send email after max retries");
}

export async function sendVerificationEmail({
  email,
  name,
  verifyToken,
}: {
  email: string;
  name: string;
  verifyToken: string;
}) {
  const verificationLink = `${process.env.FEAST_WEB_URL}/auth/verify-email?token=${verifyToken}`;

  const html = `
      <p>Hello ${name},</p>
      <p>Thank you for signing up for Feast! Please click the link below within 24 hours to verify your email address:</p>
      <p><a href="${verificationLink}">Verify Email</a></p>
    `;

  await sendEmail({
    to: email,
    subject: "Verify your email address",
    html,
    text: `Hello ${name},
  
      Thank you for signing up for Feast! Please click the link below to verify your email address:
      ${verificationLink}`,
  });
}
