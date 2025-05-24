import { Resend } from "resend";
import { sleep } from "./generalUtils.js";

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

export async function sendBookingCreatedCustomerEmail({
  email,
  bookingId,
  chefName,
}: {
  email: string;
  bookingId: string;
  chefName: string;
}) {
  const bookingLink = `${process.env.FEAST_WEB_URL}/booking/${bookingId}`;

  const html = `
      <p>Hello,</p>
      <p>Thank you for requesting a booking with Chef ${chefName}! Your booking is pending chef approval. Once approved, we will notify you and you'll be able to complete your payment through the booking link below.</p>
      <p><a href="${bookingLink}">Track your booking status</a></p>
    `;

  await sendEmail({
    to: email,
    subject: "Your booking request has been sent!",
    html,
    text: `Hello,
  
      Thank you for requesting a booking with Chef ${chefName}! Your booking is pending chef approval. Once approved, you'll be able to complete your payment through the booking link below.

      Track your booking status here: ${bookingLink}`,
  });
}

export async function sendBookingCreatedChefEmail({
  email,
  bookingId,
}: {
  email: string;
  bookingId: string;
}) {
  const dashboardLink = `${process.env.FEAST_WEB_URL}/chef-console/dashboard`;
  const bookingLink = `${process.env.FEAST_WEB_URL}/booking/${bookingId}`;

  const html = `
      <p>Hello,</p>
      <p>You have a new booking request! The booking is pending your approval. Please click the link below to view the booking request and approve of it. Once approved, the customer will be notified and be able to complete their payment.</p>
      <p><a href="${dashboardLink}">View booking request and approve here</a></p>
      <p><a href="${bookingLink}">Track your booking status</a></p>
    `;

  await sendEmail({
    to: email,
    subject: "New booking request!",
    html,
    text: `Hello,
  
      You have a new booking request! The booking is pending your approval. Please click the link below to view the booking request and approve of it. Once approved, the customer will be able to complete their payment.

      View booking request and approve here: ${bookingLink}`,
  });
}

export async function sendBookingAcceptedCustomerEmail({
  email,
  bookingId,
  chefName,
}: {
  email: string;
  bookingId: string;
  chefName: string;
}) {
  const bookingLink = `${process.env.FEAST_WEB_URL}/booking/${bookingId}`;

  const html = `
      <p>Hello,</p>
      <p>Your booking with Chef ${chefName} has been accepted! Please click the link below to view the booking details and complete your payment.</p>
      <p><a href="${bookingLink}">View booking details and complete payment</a></p>
    `;

  await sendEmail({
    to: email,
    subject: "Your booking has been accepted!",
    html,
    text: `Hello,
    
      Your booking with Chef ${chefName} has been accepted! Please click the link below to view the booking request and complete your payment.

      View booking request and complete payment: ${bookingLink}`,
  });
}

export async function sendBookingRejectedCustomerEmail({
  email,
  chefId,
  chefName,
}: {
  email: string;
  chefId: string;
  chefName: string;
}) {
  const chefLink = `${process.env.FEAST_WEB_URL}/chefs/${chefId}`;

  const html = `
      <p>Hello,</p>
      <p>Chef ${chefName} has declined your booking request. They may be unavailable for your requested date and time. You can click the link below to view Chef ${chefName}'s profile and request a different booking time.</p>
      <p><a href="${chefLink}">View Chef ${chefName}'s profile</a></p>
    `;

  await sendEmail({
    to: email,
    subject: "Your booking has been rejected",
    html,
    text: `Hello,
    
      Chef ${chefName} has declined your booking request. They may be unavailable for your requested date and time. You can click the link below to view Chef ${chefName}'s profile and request a different booking time.

      View Chef ${chefName}'s profile: ${chefLink}`,
  });
}

export async function sendBookingPaidChefEmail({
  email,
  bookingId,
}: {
  email: string;
  bookingId: string;
}) {
  const bookingLink = `${process.env.FEAST_WEB_URL}/booking/${bookingId}`;

  const html = `
      <p>Hello,</p>
      <p>Your booking has been paid! The session is confirmed. Please click the link below to view the booking details.</p>
      <p><a href="${bookingLink}">View booking details</a></p>
    `;

  await sendEmail({
    to: email,
    subject: "Your booking has been paid!",
    html,
    text: `Hello,
    
      Your booking has been paid! The session is confirmed. Please click the link below to view the booking details.

      View booking details: ${bookingLink}`,
  });
}

export async function sendResetPasswordEmail({
  email,
  resetPasswordToken,
}: {
  email: string;
  resetPasswordToken: string;
}) {
  const resetPasswordLink = `${process.env.FEAST_WEB_URL}/auth/reset-password?token=${resetPasswordToken}&email=${email}`;

  const html = `
      <p>Hello,</p>
      <p>You have requested to reset your password. Please click the link below to reset your password.</p>
      <p><a href="${resetPasswordLink}">Reset password</a></p>
    `;

  await sendEmail({
    to: email,
    subject: "Reset your password",
    html,
    text: `Hello,
    
      You have requested to reset your password. Please click the link below to reset your password.

      Reset password: ${resetPasswordLink}`,
  });
}
