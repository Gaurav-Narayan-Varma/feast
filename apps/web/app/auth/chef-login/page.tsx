"use client";

import { trpc } from "@/app/_trpc/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { toast } from "react-hot-toast";

export default function ChefLogin() {
  const [error, setError] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  /**
   * We manually track loading state instead of using React Query's isPending
   * because we want the button to remain in loading state during the
   * post-mutation navigation delay.
   */
  const [isLoading, setIsLoading] = useState(false);

  const login = trpc.auth.login.useMutation({
    onSuccess: () => {
      toast.success("Login successful! Welcome back");
      router.push("/chef-console/dashboard");
    },
    onError: (error) => {
      setError(error.message ?? "An error occurred");
      setIsLoading(false);
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    await login.mutateAsync({
      email: emailRef.current?.value || "",
      password: passwordRef.current?.value || "",
    });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-ds-chef-50 to-ds-chef-100 relative">
      <Link href="/" className="absolute top-4 left-4">
        <Button variant="outline" label="Home" leftIcon={<ArrowLeftIcon />} />
      </Link>
      <div className="m-auto w-full max-w-md p-8 rounded-xl bg-white shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-ds-chef-800">
            Chef Login
          </h1>
          <p className="text-ds-chef-600 mt-2">Welcome back to Feast</p>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-ds-chef-700">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="your@email.com"
              ref={emailRef}
              className="w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="text-chef-700">
                Password
              </Label>
              <Link
                href="/auth/reset-password-request"
                className="text-sm text-ds-chef-600 hover:text-ds-chef-800 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              type="password"
              id="password"
              name="password"
              ref={passwordRef}
              className="w-full"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-ds-chef-700 hover:bg-ds-chef-800 text-white"
            label="Login"
            isLoading={isLoading}
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
