"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useBookingStore} from "@/store/useBookingStore";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import CheckoutPage from "./_components/CheckoutPage";
import {LoadingSpinner} from "@/app/_components/LoadingSpinner";

export default function PaymentPage() {
  const router = useRouter();
  const store = useBookingStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    if (!store.selectedEvent || !store.selectedTimeSlotId || store.price === 0 || !store.booking) {
      router.push("/register");
    }
  }, [
    isHydrated,
    store.selectedEvent,
    store.selectedTimeSlotId,
    store.price,
    store.booking,
    router,
  ]);

  if (!isHydrated) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8 font-inter">
      <div className="w-11/12 md:w-2/3 mx-auto">
        <Card className="max-w-xl mx-auto border-transparent shadow-[-3px_4px_10px_0px_#94A3B8]">
          <CardHeader className="">
            <CardTitle>
              <p className="font-bold text-2xl font-headline text-center">Booking Summary</p>
              {store.selectedEvent == "CASE_FILE" && store.price == 45 && (
                <p className="text-green-600 text-center text-sm">
                  Congratulations you got the early bird discount!
                </p>
              )}
              {store.selectedEvent == "ESCAPE_ROOM" && store.price == 40 && (
                <p className="text-green-600 text-center text-sm">
                  Congratulations you got the early bird discount!
                </p>
              )}
              <p className="text-center text-gtd-primary text-sm">
                Please complete the payment within 30 minutes
              </p>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CheckoutPage amount={store.price} bookingId={store.booking!.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
