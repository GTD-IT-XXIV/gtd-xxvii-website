"use client";

import {useRouter} from "next/navigation";
import {useBookingStore} from "@/store/useBookingStore";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {EventType} from "@prisma/client";
import {generateTokens} from "@/server/actions/generate-token";
import Image from "next/image";
import {LucideCircleDollarSign, LucideCalendarDays} from "lucide-react";
import logoNoctura from "@/assets/images/logo-noctura-escaperoom.webp";
import logoRectivia from "@/assets/images/logo-rectivia-casefile.webp";

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
    <div className="container mx-auto px-4 py-8 font-inter w-11/12">
      <h1 className="text-4xl font-bold text-center my-4 font-headline text-gtd-background">
        Event Registration
      </h1>
      <p className="text-center mb-8 text-gtd-background text-sm">
        Choose the event you want to register for. You must complete all the registration steps
        within 30 minutes.
      </p>
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <Card
          className={`cursor-pointer flex flex-row items-center p-4 border-transparent shadow-[-3px_4px_10px_0px_#94A3B8] ${
            selectedEvent === "ESCAPE_ROOM" ? "ring-2 ring-gtd-primary" : ""
          }`}
          onClick={() => handleEventSelection("ESCAPE_ROOM")}
        >
          <Image
            className="w-[100px] h-[100px] m-2 bg-white rounded-lg"
            width={100}
            height={100}
            alt="Logo GTD"
            src={logoNoctura}
          ></Image>
          <div>
            <CardHeader className="p-2 px-4">
              <CardTitle className="font-inter font-bold text-xl text-gtd-primary">
                Escape Room
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2 px-4">
              <p className="text-gray-600 text-sm flex items-center gap-2 mb-1">
                <LucideCalendarDays size={22} />
                23 February
              </p>
              <p className="text-gray-600 text-sm flex items-center gap-2">
                <LucideCircleDollarSign size={22} />
                <span className="font-bold text-base">45/</span>
                <span>5 pax</span>
              </p>
            </CardContent>
          </div>
        </Card>

        <Card
          className={`cursor-pointer flex flex-row items-center p-4 border-transparent shadow-[-3px_4px_10px_0px_#94A3B8] ${selectedEvent === "CASE_FILE" ? "ring-2 ring-primary" : ""}`}
          onClick={() => handleEventSelection("CASE_FILE")}
        >
          <Image
            className="w-[100px] h-[100px] m-2 bg-white rounded-lg"
            width={100}
            height={100}
            alt="Logo GTD"
            src={logoRectivia}
          ></Image>
          <div>
            <CardHeader className="p-2 px-4">
              <CardTitle className="font-inter font-bold text-xl text-gtd-primary">
                Case File
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2 px-4">
              <p className="text-gray-600 text-sm flex items-center gap-2 mb-1">
                <LucideCalendarDays size={22} />1 March
              </p>
              <p className="text-gray-600 text-sm flex items-center gap-2">
                <LucideCircleDollarSign size={22} />
                <span className="font-bold text-base">50/</span>
                <span>5 pax</span>
              </p>
            </CardContent>
          </div>
        </Card>
      </div>
      <div className="flex justify-end space-x-4 mt-8 max-w-3xl mx-auto">
        <Button
          type="submit"
          onClick={handleNext}
          disabled={!selectedEvent}
          className="h-6 px-6 py-4 rounded-lg bg-gtd-secondary hover:opacity-80 hover:bg-gtd-secondary"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
