"use client";
import { trpc } from "@/app/_trpc/client";
import SignContractModal from "@/components/modals/sign-contract-modal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { CreditCard, Loader2, ShieldCheck, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import OnboardingItem from "./onboarding-item";

export default function OnboardingSection() {
  const isMobile = useIsMobile();
  const [isContractDialogOpen, setIsContractDialogOpen] = useState(false);
  const [isStripeOnboardingLoading, setIsStripeOnboardingLoading] =
    useState(false);
  const router = useRouter();

  const getOrCreateVerificationSession =
    trpc.onboarding.getOrCreateVerificationSession.useMutation({
      onSuccess: (data) => {
        if (data.sessionUrl) {
          router.push(data.sessionUrl);
        } else {
          toast.error(data.message);
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const getChefUser = trpc.chefUser.getChefUser.useQuery();

  const getStripeOnboardingLink =
    trpc.onboarding.getStripeOnboardingLink.useMutation({
      onSuccess: (data) => {
        router.push(data.stripeAccountUrl);
      },
      onError: (error) => {
        toast.error(error.message);
        setIsStripeOnboardingLoading(false);
      },
    });

  const get1099ContractLink = trpc.onboarding.get1099ContractLink.useQuery(
    undefined,
    {
      enabled: getChefUser.data?.chefUser.form1099Status === "Submitted",
    }
  );

  if (getChefUser.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="section-title">Account Settings</div>
      <Card>
        <CardHeader>
          <CardTitle>Onboarding Tasks</CardTitle>
          <CardDescription>
            Complete the following tasks to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* ID Verification */}
          <OnboardingItem
            icon={<ShieldCheck />}
            title="ID Verification"
            description="Verify your identity to build trust with customers"
            status={
              getChefUser.data?.chefUser.isIdVerified ? "completed" : "pending"
            }
            isMobile={isMobile}
          >
            {!getChefUser.data?.chefUser.isIdVerified && (
              <Button
                type="button"
                label="Verify ID"
                onClick={async () => {
                  await getOrCreateVerificationSession.mutate();
                }}
                isLoading={getOrCreateVerificationSession.isPending}
                className={isMobile ? "w-full" : ""}
              />
            )}
          </OnboardingItem>

          {/* Stripe Account */}
          <OnboardingItem
            icon={<CreditCard />}
            title="Stripe Account"
            description="Set up your Stripe account for direct payments"
            status={
              getChefUser.data?.chefUser.stripeOnboardingComplete
                ? "completed"
                : "pending"
            }
            tooltipContent="Stripe Connect allows Feast to securely process payments and transfer funds directly to your bank account. We use Stripe to handle all payment processing, ensuring your earnings are deposited promptly and securely. Setting up your Stripe account is required to receive payments from customers."
            isMobile={isMobile}
          >
            {!getChefUser.data?.chefUser.stripeOnboardingComplete && (
              <Button
                type="button"
                variant="outline"
                onClick={async () => {
                  setIsStripeOnboardingLoading(true);
                  await getStripeOnboardingLink.mutate();
                }}
                className={isMobile ? "w-full mt-2" : ""}
                label="Connect Stripe"
                isLoading={isStripeOnboardingLoading}
              />
            )}
          </OnboardingItem>

          {/* 1099 Contract */}
          <OnboardingItem
            icon={<Upload />}
            title="1099 Contract Form"
            description="Upload and digitally sign your 1099 contract"
            status={
              getChefUser.data?.chefUser.form1099Status === "Submitted"
                ? "completed"
                : "pending"
            }
            isMobile={isMobile}
          >
            {/* Download Contract Button */}
            {getChefUser.data?.chefUser.form1099Status === "Submitted" ? (
              <span className={isMobile ? "w-full" : ""}>
                <Button
                  type="button"
                  variant="outline"
                  label="Download Contract"
                  onClick={() => {
                    get1099ContractLink.data?.contractUrl &&
                      window.open(
                        get1099ContractLink.data.contractUrl,
                        "_blank"
                      );
                  }}
                  disabled={get1099ContractLink.isPending}
                  className="w-full"
                />
              </span>
            ) : (
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className={isMobile ? "w-full" : ""}>
                      <Button
                        type="button"
                        label="Sign Contract"
                        variant="outline"
                        onClick={() => setIsContractDialogOpen(true)}
                        disabled={!getChefUser.data?.chefUser.isIdVerified}
                        className="w-full"
                      />
                    </span>
                  </TooltipTrigger>
                  {!getChefUser.data?.chefUser.isIdVerified && (
                    <TooltipContent className="p-2">
                      <p className="text-xs">
                        Please complete ID verification first
                      </p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            )}
          </OnboardingItem>
        </CardContent>
      </Card>

      {/* Sign Contract Modal */}
      {getChefUser.data?.chefUser.legalName && (
        <SignContractModal
          open={isContractDialogOpen}
          onOpenChange={setIsContractDialogOpen}
          chefLegalName={getChefUser.data?.chefUser.legalName}
        />
      )}
    </>
  );
}
