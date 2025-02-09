"use client";

import {useEffect, useState} from "react";
import {useSearchParams, useRouter} from "next/navigation";
import Link from "next/link";
import {useBookingStore} from "@/store/useBookingStore";
import {Card, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {getPaymentStatus} from "@/server/actions/booking";
import {LoadingSpinner} from "@/app/_components/LoadingSpinner";

export default function PaymentStatusPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reset = useBookingStore((state) => state.resetStore);
  const [paymentStatus, setPaymentStatus] = useState<"success" | "processing" | "error">(
    "processing",
  );
  const [message, setMessage] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
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
  }, [searchParams, isHydrated, reset, router]);

  if (!isHydrated) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8 font-inter">
      <div className="w-11/12 md:w-2/3 mx-auto">
        <Card className="max-w-2xl mx-auto text-center border-transparent shadow-[-3px_4px_10px_0px_#94A3B8]">
          <CardHeader>
            <CardTitle>
              {paymentStatus === "success" && (
                <>
                  <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
                  <p className="text-gray-600 font-normal mb-6">{message}</p>
                  <Button asChild>
                    <Link href="/">Return Home</Link>
                  </Button>
                </>
              )}
            </CardTitle>

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
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
