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

  const get1099ContractLink = trpc.onboarding.get1099ContractLink.useQuery();

  if (getChefUser.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-10">
      <div className="text-2xl font-bold">Account Settings</div>
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
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className={isMobile ? "w-full" : ""}>
                    <Button
                      type="button"
                      variant="outline"
                      label="Download Contract"
                      onClick={() => {
                        console.log(
                          "get1099ContractLink.data",
                          get1099ContractLink.data
                        );
                        // "https://s3.eu-north-1.amazonaws.com/venkatesh.goud/1099-contracts/llefj72dkx4x2ed8fj/5a967b2a-7961-4152-b847-c0779b6bd628.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA46ZDFJSTSZOD6GPG%2F20250518%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250518T175016Z&X-Amz-Expires=21600&X-Amz-Signature=e44dc2b65264d899fe978c9b7669ebd7ee6c95959c7d609f03b48f220bcba273&X-Amz-SignedHeaders=host"

                        // https://s3.eu-north-1.amazonaws.com/venkatesh.goud/1099-contracts/6828dfd19d34a43f0b5ffc9a/f0dbc74c-47dc-448f-8938-bc8193a0df12.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA46ZDFJSTSZOD6GPG%2F20250518%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20250518T175156Z&X-Amz-Expires=21600&X-Amz-Signature=499470235f2f2a25679216915da04c6ea18f62c42e6c8ff1b0c3f3800b738def&X-Amz-SignedHeaders=host
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
                </TooltipTrigger>
                {getChefUser.data?.chefUser.form1099Status !== "Submitted" && (
                  <TooltipContent className="p-2">
                    <p className="text-xs">
                      You must sign the contract before downloading it
                    </p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>

            {/* Sign Contract Button */}
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
    </div>
  );
}
