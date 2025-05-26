import { CorsOptions } from "cors";

export const corsOptions: CorsOptions = {
  origin: process.env.FEAST_WEB_URL,
  credentials: true,
  allowedHeaders: ["Content-Type", "Cookie"],
};

export const MAX_COOKIE_AGE = 60 * 60 * 24 * 365;

export const ALLOWED_ORIGINS = [
  "https://joinfeastco.com",
  "https://www.joinfeastco.com",
  "http://localhost:3000",
];
