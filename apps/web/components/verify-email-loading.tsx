"use client";
import { trpc } from "@/app/_trpc/client";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function VerifyEmailLoading() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const verifyEmail = trpc.auth.verifyEmail.useMutation({
    onSuccess: () => {
      toast.success("Email verified successfully");
      router.push("/auth/chef-login");
    },
    onError: (error) => {
      toast.error(error.message);
      router.push("/auth/chef-signup");
    },
  });

  useEffect(() => {
    if (token) {
      verifyEmail.mutate({ token });
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Loader2 className="animate-spin" />
      <div className="text-sm text-ds-chef-800">Verifying email...</div>
    </div>
  );
}