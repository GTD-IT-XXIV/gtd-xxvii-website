"use client";

import {useRouter} from "next/navigation";
import {useBookingStore} from "@/store/useBookingStore";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {EventType} from "@prisma/client";
import {generateTokens} from "@/app/actions/generate-token";
import Image from "next/image";
import logoGTDBlack from "@/assets/images/logo-gtd-black-transparent.png";

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
    <div className="container mx-auto px-4 py-8 font-sef w-11/12">
      <h1 className="text-3xl font-bold text-center my-4 font-headline">Event Registration</h1>
      <p className="text-center mb-8">
        Choose the event you want to register below. You must complete all the registration steps
        within 30 minutes.
      </p>
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card
          className={`cursor-pointer flex flex-row items-center p-4 border-transparent shadow-[-3px_4px_10px_0px_#94A3B8] ${
            selectedEvent === "ESCAPE_ROOM" ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => handleEventSelection("ESCAPE_ROOM")}
        >
          <Image
            className="w-[100px] h-[100px] m-2 bg-gray-300 rounded-lg"
            width={100}
            height={100}
            alt="Logo GTD"
            src={logoGTDBlack}
          ></Image>
          <div>
            <CardHeader className="p-2 px-4">
              <CardTitle className="font-kaftus text-lg text-gtd-secondary">
                Escape Room<span className="font-inter font-bold">:</span> Noctura
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2 px-4">
              <p className="text-gray-600">Date: 23 February 2025</p>
              <p className="text-gray-600">Price: 40 SGD</p>
            </CardContent>
          </div>
        </Card>

        <Card
          className={`cursor-pointer flex flex-row items-center p-4 border-transparent shadow-[-3px_4px_10px_0px_#94A3B8] ${selectedEvent === "CASE_FILE" ? "ring-2 ring-primary" : ""}`}
          onClick={() => handleEventSelection("CASE_FILE")}
        >
          <Image
            className="w-[100px] h-[100px] m-2 bg-gray-300 rounded-lg"
            width={100}
            height={100}
            alt="Logo GTD"
            src={logoGTDBlack}
          ></Image>
          <div>
            <CardHeader className="p-2 px-4">
              <CardTitle className="font-kaftus text-lg text-gtd-secondary">
                Case File<span className="font-inter font-bold">:</span> Rectivia
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2 px-4">
              <p className="text-gray-600">Date: 1 March 2025</p>
              <p className="text-gray-600">Price: 50 SGD</p>
            </CardContent>
          </div>
        </Card>
      </div>

      <div className="flex justify-end space-x-4 mt-8">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="h-6 px-6 py-4 mx-2 rounded-lg bg-gtd-primary hover:opacity-80 hover:bg-gtd-primary hover:text-white text-white"
        >
          Back
        </Button>
        <Button
          type="submit"
          onClick={handleNext}
          className="h-6 px-6 py-4 rounded-lg bg-gtd-secondary hover:opacity-80 hover:bg-gtd-secondary"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
