import {EventType} from "@prisma/client";
import {getLeaderboardData} from "@/utils/googleSheets";
import {LeaderboardTable} from "./LeaderboardTable";

export const LeaderboardContent = async ({eventType}: {eventType: EventType}) => {
  const data = await getLeaderboardData(eventType);
  return <LeaderboardTable data={data} />;
};
