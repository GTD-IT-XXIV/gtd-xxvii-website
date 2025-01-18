"use client";

import {useState, useEffect} from "react";
import {createCheckoutSession} from "@/app/actions/booking";
import {EmbeddedCheckoutProvider, EmbeddedCheckout} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutPage = ({amount, bookingId}: {amount: number; bookingId: string}) => {
  const [clientSecret, setClientSecret] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchStripeSession = async () => {
      try {
        const {clientSecret} = await createCheckoutSession(bookingId, amount);
        if (clientSecret) {
          setClientSecret(clientSecret);
        }
      } catch (error) {
        console.error("Error fetching stripe session:", error);
        setErrorMessage("Failed to fetch stripe session");
      }
    };
    fetchStripeSession();
  }, [amount, bookingId]);

  if (!clientSecret) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
      <EmbeddedCheckoutProvider stripe={stripePromise} options={{clientSecret}}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default CheckoutPage;
