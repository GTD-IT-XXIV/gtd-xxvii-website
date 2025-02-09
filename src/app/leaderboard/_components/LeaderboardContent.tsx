"use client";
import {EventType} from "@prisma/client";
import {LeaderboardTable} from "./LeaderboardTable";
import {LoadingSpinner} from "@/components/LoadingSpinner";
import {useQuery} from "@tanstack/react-query";
import {fetchLeaderboard} from "@/app/actions/leaderboard";

type TeamData = {
  teamName: string;
  leaderName: string;
  completionTime: string;
  members: string[];
};

type TeamList = TeamData[];
export const useLeaderboard = (eventType: EventType) => {
  return useQuery<TeamList>({
    queryKey: ["leaderboard", eventType],
    queryFn: () => fetchLeaderboard(eventType),
    refetchInterval: 1000 * 60 * 60, // Refetch every hour
    staleTime: 1000 * 60 * 55, // Consider data stale after 55 minutes
    refetchOnWindowFocus: false,
  });
};

export const LeaderboardContent = ({eventType}: {eventType: EventType}) => {
  const {data, isLoading, isError, error} = useLeaderboard(eventType);

  if (isLoading) return <LoadingSpinner />;

  if (isError)
    return (
      <div className="p-4 text-center text-red-500">Error loading leaderboard: {error.message}</div>
    );

  return <LeaderboardTable data={data || []} />;
};
