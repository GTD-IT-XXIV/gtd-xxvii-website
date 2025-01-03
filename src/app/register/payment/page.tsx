"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
import {useBookingStore} from "@/store/useBookingStore";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import CheckoutPage from "./_components/CheckoutPage";

// if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
//   throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
// }
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PaymentPage() {
  const router = useRouter();
  const store = useBookingStore();

  useEffect(() => {
    if (!store.selectedEvent || !store.selectedTimeSlotId || store.price == 0 || !store.booking) {
      router.push("/register");
    }
  }, [store.selectedEvent, store.selectedTimeSlotId, store.price, store.booking, router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <Elements
            stripe={stripePromise}
            options={{mode: "payment", amount: store.price * 100, currency: "sgd"}}
          >
            <CheckoutPage amount={store.price} bookingId={store.booking!.id} />
          </Elements>
        </CardContent>
      </Card>
    </div>
  );
}
