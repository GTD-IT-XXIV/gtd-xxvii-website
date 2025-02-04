"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useBookingStore} from "@/store/useBookingStore";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {createBooking} from "@/app/actions/booking";
import {LoadingSpinner} from "@/app/_components/LoadingSpinner";

export default function SummaryPage() {
  const router = useRouter();
  const store = useBookingStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    if (!store.selectedEvent || !store.selectedTimeSlotId) {
      router.push("/register");
    }
  }, [isHydrated, store.selectedEvent, store.selectedTimeSlotId, router]);

  const handleNext = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create booking
      const {booking, price} = await createBooking({
        timeSlotId: store.selectedTimeSlotId!,
        buyerName: store.buyerName,
        buyerEmail: store.buyerEmail,
        buyerTelegram: store.buyerTelegram,
        teamName: store.teamName,
        teamMembers: store.teamMembers,
      });

      store.setBooking(booking);
      // price still in dollars
      store.setPrice(price);
      router.push("/register/payment");
    } catch (err) {
      console.error("Booking creation error:", err);
      setError(err instanceof Error ? err.message : "Booking creation failed");
      setLoading(false);
    }
  };

  if (!isHydrated) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8 font-inter">
      <h2 className="text-3xl font-bold my-4 text-center font-headline">Summary</h2>
      <Card className="w-[90%] max-w-2xl mx-auto mt-8 h-4/5 text-gtd-primary shadow-[0px_4px_4px_0px_#00000040]">
        <CardHeader>
          <CardTitle className="font-bold text-lg font-kaftus">Booking Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-xs font-medium font text-muted-foreground font-inter">
            <div className="border-b-2 border-gtd-primary px-2">
              <div className="w-full flex my-4 mt-0 justify-between">
                <div className="w-2/5">Event</div>
                <div className="text-right w-3/5">
                  {store.selectedEvent === "CASE_FILE" ? "Case File" : "Escape Room"}
                </div>
              </div>

              <div className="w-full flex my-4 justify-between">
                <div className="w-2/5">Selected Timeslot</div>
                <div className="text-right w-3/5">{store.startTime}</div>
              </div>

              <div className="w-full flex my-4 justify-between">
                <div className="w-2/5">Leader</div>
                <div className="text-right w-3/5">{store.buyerName}</div>
              </div>

              <div className="w-full flex my-4 justify-between">
                <div className="w-2/5">Email Leader</div>
                <div className="text-right w-3/5">{store.buyerEmail}</div>
              </div>

              <div className="w-full flex my-4 justify-between">
                <div className="w-2/5">Telegram Leader</div>
                <div className="text-right w-3/5">{store.buyerTelegram}</div>
              </div>

              <div className="w-full flex my-4 justify-between">
                <div className="w-2/5">Team Name</div>
                <div className="text-right w-3/5">{store.teamName}</div>
              </div>

              <div className="w-full flex my-4 mb-12 justify-between">
                <div className="w-2/5 flex items-center">Team Member</div>
                <div className="text-right w-1/2">
                  {store.teamMembers.map((m) => m.name).join(", ")}
                </div>
              </div>
            </div>
            <div className="px-2 flex justify-between text-gtd-primary font-bold text-xs">
              <div className="">Total</div>
              <div>SGD{" " + store.price.toFixed(2)}</div>
            </div>
            <div className="px-2 text-xs">
              <p className="text-red-600 font-inter">
                **Make sure that the details are correct. You can not go back after proceeding to
                payment**
              </p>
            </div>

            {error && <div className="bg-red-50 text-red-500 p-4 rounded">{error}</div>}
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end space-x-4 mt-8 w-5/6 max-w-2xl mx-auto">
        <Button
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
          className="h-6 px-6 py-4  text-base rounded-lg bg-[#373737] hover:opacity-80 hover:bg-[#373737] hover:text-white text-white"
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={loading}
          className="h-6 px-6 py-4 text-base rounded-lg bg-gtd-secondary hover:opacity-80 hover:bg-[#FF0089]"
        >
          {loading ? "Processing..." : "Proceed to Payment"}
        </Button>
      </div>
    </div>
  );
}
