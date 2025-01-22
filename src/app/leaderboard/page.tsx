import React from "react";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {getLeaderboardData} from "@/utils/googleSheets";
import {EventType} from "@prisma/client";
import {Medal, Timer} from "lucide-react";

type TeamData = {
  teamName: string;
  leaderName: string;
  completionTime: string;
  members: string[];
};

type TeamList = TeamData[];

const LeaderboardPage = async () => {
  // Fetch leaderboard data for both events
  const escapeRoomData = await getLeaderboardData(EventType.ESCAPE_ROOM);
  const caseFileData = await getLeaderboardData(EventType.CASE_FILE);

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
      <Timer size={48} className="mb-4" />
      <h3 className="text-lg font-medium mb-2">No Teams Have Completed Yet</h3>
      <p className="text-sm text-center max-w-md">
        The leaderboard will be updated as soon as teams start completing their challenges. Check
        back later!
      </p>
    </div>
  );

  const LeaderboardTable = ({data}: {data: TeamList}) => {
    if (!data || data.length === 0) {
      return <EmptyState />;
    }
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
              <tr key={team.teamName} className="border-b hover:bg-gray-50">
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
                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-1 text-sm bg-blue-100 rounded">{team.leaderName}</span>
                    {team.members.map((member, i) => (
                      <span key={i} className="px-2 py-1 text-sm bg-blue-100 rounded">
                        {member}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle> Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="escape-room">
            <TabsList>
              <TabsTrigger value="escape-room">Escape Room</TabsTrigger>
              <TabsTrigger value="case-file">Case File</TabsTrigger>
            </TabsList>
            <TabsContent value="escape-room">
              <LeaderboardTable data={escapeRoomData} />
            </TabsContent>
            <TabsContent value="case-file">
              <LeaderboardTable data={caseFileData} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaderboardPage;
