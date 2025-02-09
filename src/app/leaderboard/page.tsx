import React from "react";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {EventType} from "@prisma/client";
import {LeaderboardContent} from "./_components/LeaderboardContent";
import logoRecturaBorder from "@/assets/images/logo-rectura-border.webp";
import heroImage from "@/assets/images/hero-image.webp";
import Image from "next/image";

const LeaderboardPage = () => {
  return (
    <div className="container mx-auto py-8 px-2">
      <Card
        className="relative"
        style={{
          backgroundImage: `url(${heroImage.src})`,
          backgroundSize: "cover",
          backgroundPosition: "top",
        }}
      >
        <CardHeader>
          <div className="relative flex flex-col items-center">
            <Image
              src={logoRecturaBorder}
              alt="Logo Rectura"
              className="object-cover w-1/2 md:w-1/4 mx-auto z-20"
            />
          </div>
          <CardTitle>
            <div className="relative font-bold text-4xl md:text-6xl font-headline text-center py-2 text-white/90">
              <p className="drop-shadow-2xl text-shadow-[0_0_4px_var(--tw-shadow-color)] shadow-white-100 italic tracking-wider">
                Leaderboard
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="escape-room">
            <div className="flex justify-center">
              <TabsList>
                <TabsTrigger value="escape-room">Escape Room</TabsTrigger>
                <TabsTrigger value="case-file">Case File</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="escape-room" className="rounded-lg bg-white">
              <LeaderboardContent eventType={EventType.ESCAPE_ROOM} />
            </TabsContent>
            <TabsContent value="case-file" className="rounded-lg bg-white">
              <LeaderboardContent eventType={EventType.CASE_FILE} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaderboardPage;
