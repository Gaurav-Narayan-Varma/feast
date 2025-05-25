import { CorsOptions } from "cors";

export const corsOptions: CorsOptions = {
  // We need to pass `true` to let the browser know to store the cookie
  // we include in the `Set-Cookie` header.
  credentials: true,
  // We need to pass the origin of the web app explicitly (rather than `*`)
  // otherwise we get a CORS error (due to credentials: true).
  origin: process.env.FEAST_WEB_URL,
  // We need to be explicit about what headers are allowed.
  allowedHeaders: [
    "Content-Type",
    "Cookie",
    "Authorization",
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Methods",
  ],
  // Specify which headers the browser is allowed to expose to the client
  exposedHeaders: [
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Methods",
  ],
};

export const MAX_COOKIE_AGE = 60 * 60 * 24 * 365;

/**
 * There is a Cookie constant in the web app, so update that too
 * if you change this.
 */

export const ALLOWED_ORIGINS = [
  // Production URLs
  "https://joinfeastco.com",
  "https://www.joinfeastco.com",
  // Local development URLs
  "http://localhost:8080",
  "http://www.localhost:8080",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:8000",
  "http://localhost:4000",
  "http://localhost:4200",
  "http://localhost:5000",
  "http://localhost:3001",
];
