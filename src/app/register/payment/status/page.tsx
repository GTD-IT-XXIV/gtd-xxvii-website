"use client";

import {useEffect, useState, Suspense} from "react";
import {useSearchParams, useRouter} from "next/navigation";
import Link from "next/link";
import {useBookingStore} from "@/store/useBookingStore";
import {Card, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {getPaymentStatus} from "@/server/actions/booking";
import {LoadingSpinner} from "@/app/_components/LoadingSpinner";

function PaymentStatusContent() {
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
          reset();
        } else if (status === "expired") {
          setPaymentStatus("error");
          setMessage("Your payment session has expired. Please try again.");
          reset();
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
  }, [searchParams, reset, router]);

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle>
            {paymentStatus === "success" && (
              <>
                <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
                <p className="mt-4 text-gray-600">{message}</p>
                <div className="mt-6">
                  <Link href="/">
                    <Button variant="default">Return Home</Button>
                  </Link>
                </div>
              </>
            )}

            {paymentStatus === "processing" && (
              <>
                <h2 className="text-2xl font-bold text-blue-600">Processing Payment</h2>
                <p className="mt-4 text-gray-600">{message}</p>
                <div className="mt-6">
                  <LoadingSpinner />
                </div>
              </>
            )}

            {paymentStatus === "error" && (
              <>
                <h2 className="text-2xl font-bold text-red-600">Payment Failed</h2>
                <p className="mt-4 text-gray-600">{message}</p>
                <div className="mt-6 space-x-4">
                  <Link href="/">
                    <Button variant="outline">Return Home</Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="default">Try Again</Button>
                  </Link>
                </div>
              </>
            )}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto py-8 text-center">
          <LoadingSpinner />
        </div>
      }
    >
      <PaymentStatusContent />
    </Suspense>
  );
}
