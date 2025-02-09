import {Medal} from "lucide-react";
import React from "react";
import {TeamMembers} from "./TeamMembers";
type TeamData = {
  teamName: string;
  leaderName: string;
  completionTime: string;
  members: string[];
};

export const TeamRow = ({team, index}: {team: TeamData; index: number}) => (
  <tr className="border-b hover:bg-gray-50">
    <td className="p-4 text-center">
      <div className="flex justify-center items-center">
        {index === 0 && <Medal className="text-yellow-500" />}
        {index === 1 && <Medal className="text-gray-400" />}
        {index === 2 && <Medal className="text-amber-600" />}
        {index > 2 && `${index + 1}`}
      </div>
    </td>
    <td className="p-4 font-medium">{team.teamName}</td>
    <td className="p-4">{team.completionTime} minutes</td>
    <td className="p-4">
      <TeamMembers leader={team.leaderName} members={team.members} />
    </td>
  </tr>
);
