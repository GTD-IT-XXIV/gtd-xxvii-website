"use server";

import {v4 as uuidv4} from "uuid";
import redis from "@/lib/redis";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

const duration = 30; // seconds

export async function generateTokens() {
  const sessionToken = uuidv4();
  const csrfToken = uuidv4();

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

async function updateTTL(sessionToken: string, csrfToken: string) {
  if (!sessionToken) {
    return;
  }
  await redis.setex(sessionToken, duration, csrfToken);

  // Set cookies
  (await cookies()).set("session_token", sessionToken, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: duration,
  });
}

async function validateToken(session_token: string | null = null) {
  if (!session_token) {
    console.log("Token not found in cookie");
    await generateTokens();
    return false;
  }

  const csrfToken: string | null = await redis.get(session_token);
  if (!csrfToken) {
    console.log("Token not found in redis");
    await generateTokens();
    return false;
  }

  await updateTTL(session_token, csrfToken);
  return true;
}

export async function processStep() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) {
    console.log("Session expired");
    redirect("/register");
  }

  const isValid = await validateToken(sessionToken);
  if (!isValid) {
    console.log("Token invalid");
    redirect("/register");
  }
}
