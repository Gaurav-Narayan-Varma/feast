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
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
// import { chefApi } from "@/utils/api";
// import { ChefStatusFlags } from "@/utils/api/types/chef";
import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  Download,
  Info,
  Loader2,
  Lock,
  ShieldCheck,
  Upload,
} from "lucide-react";
import React, { useState } from "react";

export default function AdminSection({
  onOpenContractDialog,
  onOpenPasswordDialog,
  chefStatusFlags,
}: {
  onOpenContractDialog: () => void;
  onOpenPasswordDialog: () => void;
  chefStatusFlags?: any;
}) {
  const isMobile = useIsMobile();
  const [isStripeLoading, setIsStripeLoading] = useState(false);
  const [isIdVerificationLoading, setIsIdVerificationLoading] = useState(false);
  const [isRefreshingIdVerification, setIsRefreshingIdVerification] =
    useState(false);
  const [isDownloading1099, setIsDownloading1099] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [localIdVerified, setLocalIdVerified] = useState(
    chefStatusFlags?.idVerification
  );

  // Handler functions
  // const handleConnectStripe = async () => {
  //   try {
  //     setIsStripeLoading(true);
  //     const result = await chefApi.createStripeAccount();

  //     if (result.stripeAccountUrl) {
  //       window.location.href = result.stripeAccountUrl;
  //     } else {
  //       toast({
  //         title: "Error",
  //         description: "No Stripe URL was returned. Please try again later.",
  //         variant: "destructive",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error connecting to Stripe:", error);
  //     toast({
  //       title: "Error",
  //       description: "Failed to connect to Stripe. Please try again later.",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsStripeLoading(false);
  //   }
  // };

  // const handleVerifyId = async () => {
  //   try {
  //     setIsIdVerificationLoading(true);
  //     const result = await chefApi.createIdVerificationSession();

  //     if (result.sessionUrl == "") {
  //       toast({
  //         title: "Success",
  //         description: "ID verification has already been completed.",
  //         variant: "default",
  //       });
  //     } else if (result.sessionUrl) {
  //       window.location.href = result.sessionUrl;
  //     } else {
  //       toast({
  //         title: "Error",
  //         description:
  //           "No verification URL was returned. Please try again later.",
  //         variant: "destructive",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error starting ID verification:", error);
  //     toast({
  //       title: "Error",
  //       description: "Failed to start ID verification. Please try again later.",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsIdVerificationLoading(false);
  //   }
  // };

  // const handleRefreshIdVerification = async () => {
  //   try {
  //     setIsRefreshingIdVerification(true);
  //     const result = await chefApi.refreshIdVerificationStatus();

  //     if (result.isIdVerified) {
  //       setLocalIdVerified(true);
  //       toast({
  //         title: "Success",
  //         description: "Your ID has been successfully verified!",
  //         variant: "default",
  //       });
  //     } else {
  //       setLocalIdVerified(false);
  //       toast({
  //         title: "Verification Pending",
  //         description: "Your ID verification is still pending or incomplete.",
  //         variant: "default",
  //       });
  //     }
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: error.message,
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsRefreshingIdVerification(false);
  //   }
  // };

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

  // const handleResendEmailConfirmation = async () => {
  //   try {
  //     setIsResendingEmail(true);
  //     const result = await chefApi.resendEmailConfirmation();

  //     if (result.chefEmail) {
  //       toast({
  //         title: "Email Sent",
  //         description: `Confirmation email sent to ${result.chefEmail}. Please check your inbox and spam folder.`,
  //         variant: "default",
  //       });
  //     } else {
  //       toast({
  //         title: "Error",
  //         description:
  //           "Failed to resend confirmation email. Please try again later.",
  //         variant: "destructive",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error resending confirmation email:", error);
  //     toast({
  //       title: "Error",
  //       description:
  //         "Failed to resend confirmation email. Please try again later.",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsResendingEmail(false);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Administrative</CardTitle>
        <CardDescription>Contract and payment processing</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <AdminCardItem
          icon={<ShieldCheck />}
          title="ID Verification"
          description="Verify your identity to build trust with customers"
          status={getTaskStatus("idVerification")}
        >
          <div className={`flex ${isMobile ? "flex-col" : "flex-row"} gap-2`}>
            <Button
              type="button"
              // onClick={handleRefreshIdVerification}
              disabled={isRefreshingIdVerification}
              variant="outline"
              className={isMobile ? "w-full" : ""}
            >
              {isRefreshingIdVerification ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Checking...
                </span>
              ) : (
                "Check Status"
              )}
            </Button>
            <Button
              type="button"
              // onClick={handleVerifyId}
              disabled={isIdVerificationLoading}
              className={isMobile ? "w-full" : ""}
            >
              {isIdVerificationLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </span>
              ) : (
                "Verify ID"
              )}
            </Button>
          </div>
        </AdminCardItem>

        <AdminCardItem
          icon={<CreditCard />}
          title="Stripe Account"
          description="Set up your Stripe account for direct payments"
          status={getTaskStatus("stripeAccountOnboarding")}
          tooltipContent="Stripe Connect allows Feast to securely process payments and transfer funds directly to your bank account. We use Stripe to handle all payment processing, ensuring your earnings are deposited promptly and securely. Setting up your Stripe account is required to receive payments from customers."
        >
          <Button
            type="button"
            // onClick={handleConnectStripe}
            disabled={isStripeLoading}
            className={isMobile ? "w-full mt-2" : ""}
          >
            {isStripeLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Connecting...
              </span>
            ) : (
              "Access Stripe Account"
            )}
          </Button>
        </AdminCardItem>

        <AdminCardItem
          icon={<Upload />}
          title="1099 Contract Form"
          description="Upload and digitally sign your 1099 contract"
          status={getTaskStatus("form1099")}
        >
          {/* Download Contract Button */}
          <TooltipProvider delayDuration={0}>
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
          </TooltipProvider>

          {/* Sign Contract Button */}
          <TooltipProvider delayDuration={0}>
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
          </TooltipProvider>
        </AdminCardItem>
        <AdminCardItem
          icon={<AlertCircle />}
          title="Email Confirmation"
          description="Verify your email address to receive important notifications"
          status={getTaskStatus("emailConfirmation")}
        >
          <Button
            type="button"
            // onClick={handleResendEmailConfirmation}
            disabled={isResendingEmail || chefStatusFlags.emailConfirmation}
            className={isMobile ? "w-full" : ""}
          >
            {isResendingEmail ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </span>
            ) : (
              "Resend Confirmation"
            )}
          </Button>
        </AdminCardItem>
        <AdminCardItem
          icon={<Lock />}
          title="Account Security"
          description="Update your password to secure your account"
          status="completed" // Security is always shown as completed
        >
          <Button
            type="button"
            onClick={onOpenPasswordDialog}
            className={isMobile ? "w-full mt-2" : ""}
          >
            Change Password
          </Button>
        </AdminCardItem>
      </CardContent>
    </Card>
  );
}

interface AdminCardItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
  status?: "completed" | "pending";
  tooltipContent?: string;
}

const AdminCardItem: React.FC<AdminCardItemProps> = ({
  icon,
  title,
  description,
  children,
  status = "pending",
  tooltipContent,
}) => {
  const isMobile = useIsMobile();

  const getStatusColors = () => {
    if (status === "completed") {
      return {
        bgColor: "bg-green-50/80 dark:bg-green-900/10",
        textColor: "text-green-600 dark:text-green-400",
        borderColor: "border-green-200 dark:border-green-800",
        iconBgColor: "bg-green-100 dark:bg-green-900/20",
      };
    }
    return {
      bgColor: "bg-orange-50/80 dark:bg-orange-900/10",
      textColor: "text-orange-600 dark:text-orange-400",
      borderColor: "border-orange-200 dark:border-orange-800",
      iconBgColor: "bg-orange-100 dark:bg-orange-900/20",
    };
  };

  const { bgColor, textColor, borderColor, iconBgColor } = getStatusColors();

  return (
    <div
      className={cn(
        "border rounded-lg p-4",
        bgColor,
        status === "completed" ? borderColor : ""
      )}
    >
      <div className={`flex ${isMobile ? "flex-col" : "items-center"} gap-4`}>
        <div
          className={cn(
            `${isMobile ? "" : "flex-shrink-0"} p-3 rounded-full ${
              isMobile ? "self-start" : ""
            }`,
            iconBgColor
          )}
        >
          {/* {React.cloneElement(icon as React.ReactElement, {
            className: cn("h-6 w-6", textColor),
          })} */}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">{title}</h4>
            {status === "completed" && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
            {tooltipContent && (
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[300px] p-3 text-xs bg-card text-card-foreground border shadow-md">
                    <p>{tooltipContent}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {children}
      </div>
    </div>
  );
};
