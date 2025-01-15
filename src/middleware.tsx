import {NextRequest, NextResponse} from "next/server";
import {generateTokens} from "@/app/actions/generate-token";
import redis from "@/lib/redis";

// !! IMPORTANT: Fill in the production domain
const allowedOrigins = [
  "", // Production
  "http://localhost:3000", // Local Development
];

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const origin = req.headers.get("origin");
  const sessionToken = req.cookies.get("session_token")?.value;

  // Check if origin is allowed
  if (origin && !allowedOrigins.includes(origin)) {
    console.log("origin not allowed");
    return new NextResponse("Not allowed", {status: 403});
  }

  // Check if session token exists in cookies
  if (!sessionToken) {
    console.log("session token not found, creating new session");
    await generateTokens();
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Check if session token exists in Redis
  const csrfToken = await redis.get(sessionToken);
  if (!csrfToken) {
    console.log("session data not found");
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
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
