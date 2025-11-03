// lib\corsHeaders.ts

// List of allowed origins
const allowedOrigins = [
  "https://ontap.ph",
  "http://localhost:3000", 
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001"
];

// Function to check if the origin is allowed
export const isAllowedOrigin = (origin: string | null): boolean => {
  if (!origin) return false;
  return allowedOrigins.includes(origin);
};

// Function to get the appropriate CORS headers
export const getCorsHeaders = (origin: string | null) => {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  };

  // If the origin is allowed, set it in the headers
  if (origin && isAllowedOrigin(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  } else {
    // For production, you might want to set a default or restrict it
    headers["Access-Control-Allow-Origin"] = "https://ontap.ph";
  }

  return headers;
};

// For backward compatibility - returns headers for a specific origin
export const corsHeaders = (origin?: string) => {
  return getCorsHeaders(origin || null);
};

// Default CORS headers (you can use this if you don't have the origin)
export const defaultCorsHeaders = {
  "Access-Control-Allow-Origin": "https://ontap.ph",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
};