"use client";
import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import OnboardingItem from "./onboarding-item";

export default function OnboardingSection({
  onOpenContractDialog,
  onOpenPasswordDialog,
  chefStatusFlags,
}: {
  onOpenContractDialog: () => void;
  onOpenPasswordDialog: () => void;
  chefStatusFlags?: any;
}) {
  const isMobile = useIsMobile();
  const [isDownloading1099, setIsDownloading1099] = useState(false);
  const [localIdVerified, setLocalIdVerified] = useState(
    chefStatusFlags?.idVerification
  );
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

  // const handleDownload1099Contract = async () => {
  //   try {
  //     setIsDownloading1099(true);
  //     const result = await chefApi.get1099Contract();

  //     if (result.contractUrl) {
  //       // Open the contract URL in a new window
  //       window.open(result.contractUrl, "_blank");
  //       toast({
  //         title: "Success",
  //         description: "Contract downloaded successfully!",
  //         variant: "default",
  //       });
  //     } else {
  //       toast({
  //         title: "Error",
  //         description: "No contract URL was returned. Please try again later.",
  //         variant: "destructive",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error downloading contract:", error);
  //     toast({
  //       title: "Error",
  //       description: "Failed to download contract. Please try again later.",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsDownloading1099(false);
  //   }
  // };

  // Get task status ('completed' or 'pending')
  const getTaskStatus = (taskName: any) => {
    // Special case for ID verification to use local state
    if (taskName === "idVerification") {
      return localIdVerified ? "completed" : "pending";
    }
    // In CompletedTasksData, true means task is completed
    // return chefStatusFlags[taskName] ? "completed" : "pending";
    return "pending";
  };

  chefStatusFlags = {
    idVerification: false,
    stripeAccountOnboarding: false,
    form1099: false,
    emailConfirmation: false,
  };

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
            status={getChefUser.data?.chefUser.stripeOnboardingComplete ? "completed" : "pending"}
            tooltipContent="Stripe Connect allows Feast to securely process payments and transfer funds directly to your bank account. We use Stripe to handle all payment processing, ensuring your earnings are deposited promptly and securely. Setting up your Stripe account is required to receive payments from customers."
            isMobile={isMobile}
          >
            {!getChefUser.data?.chefUser.stripeOnboardingComplete && (
            <Button
              type="button"
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
          {/* <OnboardingItem
            icon={<Upload />}
            title="1099 Contract Form"
            description="Upload and digitally sign your 1099 contract"
            status={getTaskStatus("form1099")}
            isMobile={isMobile}
          > */}
          {/* Download Contract Button */}
          {/* <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className={isMobile ? "w-full" : ""}>
                    <Button
                      type="button"
                      variant="outline"
                      // onClick={handleDownload1099Contract}
                      disabled={!chefStatusFlags.form1099 || isDownloading1099}
                      className="w-full"
                    >
                      {isDownloading1099 ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          Download Contract
                        </span>
                      )}
                    </Button>
                  </span>
                </TooltipTrigger>
                {!chefStatusFlags.form1099 && (
                  <TooltipContent className="p-2">
                    <p className="text-xs">
                      You must sign the contract before downloading it
                    </p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider> */}

          {/* Sign Contract Button */}
          {/* <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className={isMobile ? "w-full" : ""}>
                    <Button
                      type="button"
                      onClick={onOpenContractDialog}
                      disabled={!localIdVerified || chefStatusFlags.form1099}
                      className="w-full"
                    >
                      Sign Contract
                    </Button>
                  </span>
                </TooltipTrigger>
                {!localIdVerified && (
                  <TooltipContent className="p-2">
                    <p className="text-xs">
                      Please complete ID verification first
                    </p>
                  </TooltipContent>
                )}
                {localIdVerified && chefStatusFlags.form1099 && (
                  <TooltipContent className="p-2">
                    <p className="text-xs">
                      You have already signed the contract
                    </p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider> */}
          {/* </OnboardingItem> */}
        </CardContent>
      </Card>
    </div>
  );
}
