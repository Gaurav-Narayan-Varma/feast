"use client";

import { trpc } from "@/app/_trpc/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ResetPasswordRequest() {
  const [error, setError] = useState<string | null>(null);

  const requestPasswordReset = trpc.auth.requestPasswordReset.useMutation({
    onSuccess: () => {
      toast.success("Reset password email sent");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-ds-chef-50 to-ds-chef-100 relative">
      <Link href="/" className="absolute top-4 left-4">
        <Button variant="outline" label="Home" leftIcon={<ArrowLeftIcon />} />
      </Link>
      <div className="m-auto w-full max-w-md p-8 rounded-xl bg-white shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-ds-chef-800">
            Reset Password
          </h1>
          <p className="text-ds-chef-600 mt-2">
            Enter your email to reset your password
          </p>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <form
          className="space-y-6"
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault();

            const form = e.target as HTMLFormElement;
            const email = form.email.value;

            requestPasswordReset.mutate({ email });
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="email" className="text-ds-chef-700">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="your@email.com"
              className="w-full"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-ds-chef-700 hover:bg-ds-chef-800 text-white"
            label="Reset Password"
            isLoading={requestPasswordReset.isPending}
          />
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-ds-chef-600">Don't have an account?</p>
          <Link
            href="/auth/chef-signup"
            className="inline-block mt-2 text-ds-chef-700 hover:text-ds-chef-900 font-medium hover:underline"
          >
            Sign up as a Chef
          </Link>
        </div>
      </div>
    </div>
  );
}
