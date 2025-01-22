import React, {Suspense} from "react";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {EventType} from "@prisma/client";
import {LeaderboardContent} from "./_components/LeaderboardContent";
import {LoadingSpinner} from "./_components/LoadingSpinner";

const LeaderboardPage = () => {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="escape-room">
            <TabsList>
              <TabsTrigger value="escape-room">Escape Room</TabsTrigger>
              <TabsTrigger value="case-file">Case File</TabsTrigger>
            </TabsList>
            <Suspense fallback={<LoadingSpinner />}>
              <TabsContent value="escape-room">
                <LeaderboardContent eventType={EventType.ESCAPE_ROOM} />
              </TabsContent>
              <TabsContent value="case-file">
                <LeaderboardContent eventType={EventType.CASE_FILE} />
              </TabsContent>
            </Suspense>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaderboardPage;
