"use client";
import { trpc } from "@/app/_trpc/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import Link from "next/link";

const passwordSchema = z.object({
  password: z.string().min(8).max(100),
  confirmPassword: z.string().min(8).max(100),
});

export default function ResetPasswordLoading() {
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const router = useRouter();

  const resetPassword = trpc.auth.resetPassword.useMutation({
    onSuccess: () => {
      toast.success("Password reset successfully!");
      router.push("/auth/chef-login");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="m-auto w-full max-w-md p-8 rounded-xl bg-white shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display font-bold text-ds-chef-800">
          Reset Password
        </h1>
        <p className="text-ds-chef-600 mt-2">Enter your new password below</p>
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
          const password = form.password.value;
          const confirmPassword = form.confirmPassword.value;

          if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
          }

          const result = passwordSchema.safeParse({
            password,
            confirmPassword,
          });

          if (!result.success) {
            setError(result.error.issues[0]?.message ?? "Invalid password");
            return;
          }

          resetPassword.mutate({
            email: email as string,
            token: token as string,
            password,
          });
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="password" className="text-ds-chef-700">
            Password
          </Label>
          <Input
            type="password"
            id="password"
            name="password"
            className="w-full"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-ds-chef-700">
            Confirm Password
          </Label>
          <Input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="w-full"
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-ds-chef-700 hover:bg-ds-chef-800 text-white"
          label="Reset Password"
          isLoading={resetPassword.isPending}
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
  );
}