import { CorsOptions } from "cors";

export const corsOptions: CorsOptions = {
  // We need to pass `true` to let the browser know to store the cookie
  // we include in the `Set-Cookie` header.
  credentials: true,
  // We need to pass the origin of the web app explicitly (rather than `*`)
  // otherwise we get a CORS error (due to credentials: true).
  origin: process.env.FEAST_WEB_URL,
  // We need to be explicit about what headers are allowed.
  allowedHeaders: ["Content-Type", "Cookie"],
};

export const MAX_COOKIE_AGE = 60 * 60 * 24 * 365;

/**
 * There is a Cookie constant in the web app, so update that too
 * if you change this.
 */
export enum Cookie {
  SessionId = "session_id",
}
