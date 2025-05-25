"use client";
import ResetPasswordLoading from "@/components/reset-password-loading";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function ResetPassword() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-ds-chef-50 to-ds-chef-100 relative">
      <Link href="/" className="absolute top-4 left-4">
        <Button variant="outline" label="Home" leftIcon={<ArrowLeftIcon />} />
      </Link>
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center h-screen">
            <Loader2 className="animate-spin" />
            <p>Loading...</p>
          </div>
        }
      >
        <ResetPasswordLoading />
      </Suspense>
    </div>
  );
}
