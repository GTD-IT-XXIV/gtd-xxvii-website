"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {loadStripe} from "@stripe/stripe-js";
import {useBookingStore} from "@/store/useBookingStore";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {createBooking, createPaymentIntent} from "@/app/actions/booking";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PaymentPage() {
  const router = useRouter();
  const store = useBookingStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!store.selectedEvent || !store.selectedTimeSlotId) {
      router.push("/register");
    }
  }, [store.selectedEvent, store.selectedTimeSlotId, router]);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create booking
      const {booking, price} = await createBooking({
        timeSlotId: store.selectedTimeSlotId!,
        buyerName: store.buyerName,
        buyerEmail: store.buyerEmail,
        buyerTelegram: store.buyerTelegram,
        teamMembers: store.teamMembers,
      });

      // Create payment intent
      const paymentIntent = await createPaymentIntent(booking.id, price);

      // Load Stripe
      const stripe = await stripePromise;

      if (!stripe) throw new Error("Stripe failed to load");

      // Redirect to Stripe checkout
      const {error: stripeError} = await stripe.confirmPayment({
        clientSecret: paymentIntent.client_secret!,
        confirmParams: {
          return_url: `${window.location.origin}/register/complete`,
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Booking Summary</h3>
              <p>Event: {store.selectedEvent === "CASE_FILE" ? "Case File" : "Escape Room"}</p>
              <p>Leader: {store.buyerName}</p>
              <p>Email Leader: {store.buyerEmail}</p>
              <p>Telegram Leader: {store.buyerTelegram}</p>
              <p>Team Members: {store.teamMembers.map((m) => m.name).join(", ")}</p>
            </div>

            {error && <div className="bg-red-50 text-red-500 p-4 rounded">{error}</div>}

            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => router.back()} disabled={loading}>
                Back
              </Button>
              <Button onClick={handlePayment} disabled={loading}>
                {loading ? "Processing..." : "Proceed to Payment"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
