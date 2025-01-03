"use client";

import {useEffect, useState} from "react";
import {useStripe, useElements, PaymentElement} from "@stripe/react-stripe-js";
import {createPaymentIntent} from "@/app/actions/booking";
import {Button} from "@/components/ui/button";

const CheckoutPage = ({amount, bookingId}: {amount: number; bookingId: string}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        const clientSecret = await createPaymentIntent(bookingId, amount);
        if (clientSecret) {
          setClientSecret(clientSecret);
        }
      } catch (error) {
        console.error("Error fetching payment intent:", error);
        setErrorMessage("Failed to fetch payment intent");
      }
    };

    fetchPaymentIntent();
  }, [amount, bookingId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    if (!stripe || !elements) {
      return;
    }

    const {error: submitError} = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message ?? "An error occurred");
      setLoading(false);
      return;
    }

    const {error} = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/register/payment/complete`,
      },
    });

    if (error) {
      // This point is only reached if there's an immediate error when
      // confirming the payment. Show the error to your customer (for example, payment details incomplete)
      setErrorMessage(error.message ?? "An error occurred");
    } else {
      // The payment UI automatically closes with a success animation.
      // Your customer is redirected to your `return_url`.
    }

    setLoading(false);
  };

  if (!clientSecret || !stripe || !elements) {
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
    <form onSubmit={handleSubmit}>
      {clientSecret && <PaymentElement />}
      {errorMessage && <div>{errorMessage}</div>}
      <div className="flex justify-end space-x-4 mt-4">
        <Button disabled={!stripe || loading}>
          {loading ? "Processing..." : `Pay ${amount} SGD`}
        </Button>
      </div>
    </form>
  );
};

export default CheckoutPage;
