"use client";

import {useRouter} from "next/navigation";
import {useBookingStore} from "@/store/useBookingStore";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {EventType} from "@prisma/client";
import {generateTokens} from "@/app/actions/generate-token";

export default function RegistrationPage() {
  const router = useRouter();
  const {selectedEvent, setSelectedEvent} = useBookingStore();

  const handleEventSelection = (event: EventType) => {
    setSelectedEvent(event);
  };

  const handleNext = () => {
    const generate = async () => {
      await generateTokens();
    };

    const parseCookie = () => {
      const cookie = document.cookie;
      return cookie.split(";").reduce((acc: Record<string, string>, cookie) => {
        const [key, value] = cookie.split("=");
        acc[key.trim()] = decodeURIComponent(value);
        return acc;
      }, {});
    };

    // !! BUGS: Session token resets every time page is refreshed
    const parsedCookie = parseCookie();
    if (!parsedCookie) generate();
    else {
      const sessionToken = parsedCookie["session_token"];
      if (!sessionToken) generate();
    }

    if (selectedEvent) {
      router.push("/register/details");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Event Registration</h1>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card
          className={`cursor-pointer ${
            selectedEvent === "ESCAPE_ROOM" ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => handleEventSelection("ESCAPE_ROOM")}
        >
          <CardHeader>
            <CardTitle>Escape Room</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Challenge yourself in our escape room experience. Team up with 5 people to solve
              puzzles and break free!
            </p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer ${selectedEvent === "CASE_FILE" ? "ring-2 ring-primary" : ""}`}
          onClick={() => handleEventSelection("CASE_FILE")}
        >
          <CardHeader>
            <CardTitle>Case File</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Put your detective skills to the test in this case file investigation. Work with your
              team to crack the case!
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center mt-8">
        <Button onClick={handleNext} disabled={!selectedEvent} className="w-full max-w-xs">
          Next
        </Button>
      </div>
    </div>
  );
}
