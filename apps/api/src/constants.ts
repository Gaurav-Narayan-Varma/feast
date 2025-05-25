import { CorsOptions } from "cors";

export const corsOptions: CorsOptions = {
  credentials: true,
  // Add more detailed origin handling
  origin: (origin, callback) => {
    console.log("Incoming request origin:", origin);
    
    const allowedOrigins = [
      'http://localhost:3001',
      'https://feast-hnbz.onrender.com',
      'https://feast-hnbz.onrender.com/' // with trailing slash
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("Origin not allowed:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  allowedHeaders: ["Content-Type", "Cookie"],
};

export const MAX_COOKIE_AGE = 60 * 60 * 24 * 365;

/**
 * There is a Cookie constant in the web app, so update that too
 * if you change this.
 */

export const ALLOWED_ORIGINS = [
  // Production URLs
  'https://joinfeastco.com',
  'https://www.joinfeastco.com',
  // Local development URLs
  'http://localhost:8080',
  'http://www.localhost:8080',
  'http://localhost:3000',
  'http://localhost:5173', 
  'http://localhost:8000',
  'http://localhost:4000',
  'http://localhost:4200',
  'http://localhost:5000',
  'http://localhost:3001',
];