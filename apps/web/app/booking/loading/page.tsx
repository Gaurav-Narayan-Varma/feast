"use client";
import ConfirmPaymentLoading from "@/components/confirm-payment-loading";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default function LoadingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center h-screen">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p>Loading...</p>
        </div>
      }
    >
      <ConfirmPaymentLoading />
    </Suspense>
  );
}
