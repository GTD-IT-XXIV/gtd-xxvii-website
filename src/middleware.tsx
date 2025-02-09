import {NextRequest, NextResponse} from "next/server";

// !! IMPORTANT: Fill in the production domain
const allowedOrigins = [
  "https://gtd-xxvii-website.vercel.app", // Production
  "http://localhost:3000", // Local Development
];

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const origin = req.headers.get("origin");

  // Check if origin is allowed
  if (origin && !allowedOrigins.includes(origin)) {
    console.log("origin not allowed");
    return new NextResponse("Not allowed", {status: 403});
  }

  const response = NextResponse.next();

  // Set CORS headers
  // !!IMPORTANT: change the origin to your domain
  response.headers.set("Access-Control-Allow-Origin", origin ? origin : "http://localhost:3000");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Stripe-Signature",
  );

  return response;
}

export const config = {
  matcher: ["/:path*"], // Specify the path to match
};
