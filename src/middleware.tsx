import {NextRequest, NextResponse} from "next/server";

// Allow production, local dev, and Vercel preview domains
const allowedOrigins = [
  "https://gtd-xxvii-website.vercel.app", // Production
  "http://localhost:3000", // Local Development
  /\.vercel\.app$/, // Allow any Vercel preview domain
];

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const origin = req.headers.get("origin");

  // Allow requests with no origin (e.g., static assets)
  if (
    origin &&
    !allowedOrigins.some((allowed) =>
      typeof allowed === "string" ? allowed === origin : allowed.test(origin),
    )
  ) {
    console.log(`Blocked request from origin: ${origin}`);
    return new NextResponse("Not allowed", {status: 403});
  }

  const response = NextResponse.next();

  // Only set CORS if there's an origin
  if (origin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }
  response.headers.set("Access-Control-Allow-Methods", "GET, POST");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Stripe-Signature",
  );

  return response;
}

export const config = {
  matcher: ["/:path*"], // Apply to all routes
};
