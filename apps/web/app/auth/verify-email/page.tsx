"use client";
import VerifyEmailLoading from "@/components/verify-email-loading";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center h-screen">
          <Loader2 className="animate-spin" />
          <div className="text-sm text-ds-chef-800">Loading...</div>
        </div>
      }
    >
      <VerifyEmailLoading />
    </Suspense>
  );
}
