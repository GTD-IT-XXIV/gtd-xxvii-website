"use server";

import {getLeaderboardData} from "@/utils/googleSheets";
import {EventType} from "@prisma/client";

export async function fetchLeaderboard(eventType: EventType) {
  try {
    return await getLeaderboardData(eventType);
  } catch (error) {
    console.error("Failed to fetch leaderboard data:", error);
    return [];
  }
}
