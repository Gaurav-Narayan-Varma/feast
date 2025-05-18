"use client";
import { trpc } from "@/app/_trpc/client";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function StripeReturnPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const router = useRouter();

  const updateChefUser = trpc.chefUser.updateChefUser.useMutation({
    onSuccess: () => {
      toast.success("Stripe account onboarding complete");
      router.push("/chef-console/settings");
    },
    onError: () => {
      toast.error("Stripe account onboarding incomplete");
      router.push("/chef-console/settings");
    },
  });

  useEffect(() => {
    if (status === "success") {
      updateChefUser.mutate({
        data: {
          stripeOnboardingComplete: true,
        },
      });
    } else if (status === "refresh") {
      toast.error("Stripe account onboarding incomplete");
      router.push("/chef-console/settings");
    }
  }, [status]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Loader2 className="animate-spin" />
    </div>
  );
}
