"use client";
import { trpc } from "@/app/_trpc/client";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function ConfirmPaymentLoading() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const bookingId = searchParams.get("booking_id");
  const router = useRouter();

  const confirmBookingPayment = trpc.booking.confirmBookingPayment.useMutation({
    onSuccess: () => {
      router.push(`/booking/${bookingId}`);
      toast.success("Payment confirmed! The chef has been notified.");
    },
    onError: () => {
      router.push(`/booking/${bookingId}`);
      toast.error("Payment not confirmed");
    },
  });

  useEffect(() => {
    if (sessionId) {
      confirmBookingPayment.mutate({
        bookingId: bookingId ?? "",
        stripeSessionId: sessionId,
        timeCustomerPaidAt: new Date().toISOString(),
      });
    }
  }, [bookingId, sessionId]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Loader2 className="w-10 h-10 animate-spin" />
      <p>Confirming payment...</p>
    </div>
  );
}
