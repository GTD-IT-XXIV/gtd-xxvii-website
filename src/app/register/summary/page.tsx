"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useBookingStore} from "@/store/useBookingStore";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {createBooking} from "@/app/actions/booking";

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
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Booking Summary</h3>
              <p>Event: {store.selectedEvent === "CASE_FILE" ? "Case File" : "Escape Room"}</p>
              <p>Leader: {store.buyerName}</p>
              <p>Email Leader: {store.buyerEmail}</p>
              <p>Telegram Leader: {store.buyerTelegram}</p>
              <p>Team Name: {store.teamName}</p>
              <p>Team Members: {store.teamMembers.map((m) => m.name).join(", ")}</p>
            </div>
            <div>
              <p className="text-red-600">
                Make sure that the details are correct. You can not go back after proceeding to
                payment
              </p>
            </div>

            {error && <div className="bg-red-50 text-red-500 p-4 rounded">{error}</div>}

            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => router.back()} disabled={loading}>
                Back
              </Button>
              <Button onClick={handleNext} disabled={loading}>
                {loading ? "Processing..." : "Proceed to Payment"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
