"use client";

import {useEffect, useState} from "react";
import {useSearchParams, useRouter} from "next/navigation";
import Link from "next/link";
import {useBookingStore} from "@/store/useBookingStore";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {getPaymentStatus} from "@/app/actions/booking";

export default function PaymentStatusPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reset = useBookingStore((state) => state.resetStore);
  const [paymentStatus, setPaymentStatus] = useState<"success" | "processing" | "error">(
    "processing",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      router.push("/register");
      return;
    }

    const checkStatus = async () => {
      try {
        const {status} = await getPaymentStatus(sessionId);

        if (status === "complete") {
          setPaymentStatus("success");
          setMessage("Your booking has been confirmed! Check your email for details.");
          reset(); // Clear the booking store
        } else if (status === "expired") {
          setPaymentStatus("error");
          setMessage("Your payment session has expired. Please try again.");
          reset(); // Clear the booking store
        } else {
          setPaymentStatus("processing");
          setMessage("Your payment is being processed...");
        }
      } catch {
        setPaymentStatus("error");
        setMessage("Something went wrong.");
      }
    };

    checkStatus();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="p-8 text-center">
          {paymentStatus === "success" && (
            <>
              <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <Button asChild>
                <Link href="/">Return Home</Link>
              </Button>
            </>
          )}

          {paymentStatus === "processing" && (
            <>
              <h1 className="text-3xl font-bold text-blue-600 mb-4">Processing Payment</h1>
              <p className="text-gray-600 mb-6">{message}</p>
            </>
          )}

          {paymentStatus === "error" && (
            <>
              <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Failed</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="space-x-4">
                <Button variant="outline" asChild>
                  <Link href="/">Return Home</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Try Again</Link>
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
