"use client";

import {useState, useEffect} from "react";
import {useRouter} from "next/router";
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
  const [stripeSessionId, setStripeSessionId] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchStripeSession = async () => {
      try {
        const {clientSecret, sessionId} = await createCheckoutSession(bookingId, amount);
        if (clientSecret && sessionId) {
          setClientSecret(clientSecret);
          setStripeSessionId(sessionId);

          // Set a timer for 30 minutes (matching the session expiry) to redirect to the status page
          // stripe.checkout.sessions will always redirect to this component after the session expires
          setTimeout(
            () => {
              const returnUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/register/payment/status?session_id=${stripeSessionId}`;
              router.push(returnUrl);
            },
            30 * 60 * 1000,
          );
        }
      } catch (error) {
        console.error("Error fetching stripe session:", error);
        setErrorMessage("Failed to fetch stripe session");
      }
    };
    fetchStripeSession();
  }, [amount, bookingId, router]);

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
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
