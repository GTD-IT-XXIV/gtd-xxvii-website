import React from "react";
import {EmptyState} from "./EmptyState";
import {TeamRow} from "./TeamRow";

type TeamData = {
  teamName: string;
  leaderName: string;
  completionTime: string;
  members: string[];
};

type TeamList = TeamData[];

export const LeaderboardTable = React.memo(({data}: {data: TeamList}) => {
  if (!data?.length) return <EmptyState />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-4 text-left">Rank</th>
            <th className="p-4 text-left">Team Name</th>
            <th className="p-4 text-left">Completion Time</th>
            <th className="p-4 text-left">Team Members</th>
          </tr>
        </thead>
        <tbody>
          {data.map((team, index) => (
            <TeamRow key={team.teamName} team={team} index={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
});

LeaderboardTable.displayName = "LeaderboardTable";
