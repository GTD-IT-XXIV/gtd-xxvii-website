"use server";

import {v4 as uuidv4} from "uuid";
import redis from "@/lib/redis";
import {cookies} from "next/headers";

export const config = {
  runtime: "edge",
};

export async function generateTokens() {
  const sessionToken = uuidv4();
  const csrfToken = uuidv4();

  const duration = 15; // seconds
  const expiry = Date.now() + 1000 * duration; // 15 seconds

  // Store in redis
  await redis.setex(sessionToken, duration, csrfToken);

  // Set cookies
  (await cookies()).set("session_token", sessionToken, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: duration,
  });
}
