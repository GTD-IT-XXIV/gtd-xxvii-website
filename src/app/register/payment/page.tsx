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
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2">Please make a payment within 30 minutes</div>
          <CheckoutPage amount={store.price} bookingId={store.booking!.id} />
        </CardContent>
      </Card>
    </div>
  );
}
