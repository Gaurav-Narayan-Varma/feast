import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertCircle, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import cx from "clsx"

export default function EarningsCard({
  isStripeOnboardingComplete,
}: {
  isStripeOnboardingComplete: boolean;
}) {
  const router = useRouter();

  const handleManagePayments = () => {
    if (isStripeOnboardingComplete) {
      window.open(
        "https://dashboard.stripe.com",
        "_blank",
        "noopener,noreferrer"
      );
    } else {
      router.push("/chef-console/settings");
    }
  };

  return (
    <Card className="flex flex-col gap-0 w-1/2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Manage Payments</CardTitle>
      </CardHeader>
      <CardContent
        className={cx(
          "pt-0 flex flex-col justify-center items-center flex-1",
          {
            "opacity-50": !isStripeOnboardingComplete,
          }
        )}
      >
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs relative"
                onClick={handleManagePayments}
                label={
                  isStripeOnboardingComplete
                    ? "Stripe Connect"
                    : "Set up your Stripe account"
                }
                rightIcon={
                  isStripeOnboardingComplete ? (
                    <ExternalLink />
                  ) : (
                    <AlertCircle />
                  )
                }
              />
            </TooltipTrigger>
            {!isStripeOnboardingComplete && (
              <TooltipContent className="p-3 text-xs max-w-[250px]">
                <p>
                  You need to complete your Stripe onboarding to manage payments
                  and receive earnings. Click to set up your account.
                </p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
