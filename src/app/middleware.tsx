import {NextRequest, NextResponse} from "next/server";

const allowedOrigins = [
  "", // Production
  "http://localhost:3000", // Local Development
];

export function middleware(req: NextRequest): NextResponse {
  const origin = req.headers.get("origin");

  if (!origin || !allowedOrigins.includes(origin)) {
    return new NextResponse("Not allowed", {status: 403});
  }

  const response = NextResponse.next();

  // Set CORS headers
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Methods", "GET, POST");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Stripe-Signature",
  );

  return response;
}

export const config = {
  matcher: "/api/:path*", // Specify the path to match
};
