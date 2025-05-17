"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// import { chefApi } from "@/utils/api";
// import { ChefStatusFlagsResponse } from "@/utils/api/types";
import {
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function ChefOnboardingAlert() {
  const [chefStatusFlagResponse, setChefStatusFlagResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const loadOnboardingTasks = async () => {
      try {
        // const flagResponse = await chefApi.getChefStatusFlags();
        // setChefStatusFlagResponse(flagResponse);
        // setIsLoading(false);

      } catch (error) {
        toast.error("Failed to load onboarding requirements");
      }
    };

    loadOnboardingTasks();
  }, [toast]);

  if (isLoading || !chefStatusFlagResponse) {
    return null;
  }

  // If there are no remaining tasks, don't show the component
//   if (chefStatusFlagResponse.isReadyToCook) {
//     return null;
//   }

  const { statuses } = chefStatusFlagResponse;
  // Pre-filter incomplete tasks
  const incompleteTasks = statuses
    ? Object.entries(statuses)
        .filter(([_, isCompleted]) => !isCompleted)
        .map(([key]) => key as keyof typeof taskLabels)
    : [];
  const taskCount = incompleteTasks.length;

  const taskLabels = {
    hasVerificationSession: {
      label: "ID verification",
      path: "/chef-dashboard/settings#administrative",
      tooltip: "Begin the process of ID verification.",
    },
    idVerification: {
      label: "ID verification",
      path: "/chef-dashboard/settings#administrative",
      tooltip:
        "Finish verifying your identity to build trust with customers and ensure platform security.",
    },
    emailConfirmation: {
      label: "Email confirmation",
      path: "/chef-dashboard/settings#administrative",
      tooltip:
        "Confirm your email address to receive important notifications and booking requests.",
    },
    stripeAccountOnboarding: {
      label: "Stripe account setup",
      path: "/chef-dashboard/settings#administrative",
      tooltip:
        "Set up your Stripe account to receive secure payments directly to your bank account.",
    },
    platformApproval: {
      label: "Platform approval",
      path: "/chef-dashboard/settings#administrative",
      tooltip:
        "After finishing all other remaining tasks, please contact [feast-team@joinfeastco.com] for next steps in your approval process.",
    },
    form1099: {
      label: "Form 1099 submission",
      path: "/chef-dashboard/settings#administrative",
      tooltip:
        "Submit your 1099 contract to officially join the Feast platform.",
    },
  };

  if (isCollapsed) {
    return (
      <div
        className="bg-amber-50 p-2 rounded-md cursor-pointer mb-2"
        onClick={() => setIsCollapsed(false)}
      >
        <div className="flex items-center justify-between text-amber-800 text-xs">
          <div className="flex items-center">
            <ClipboardCheck className="w-4 h-4 mr-1" />
            <span>
              {taskCount} task{taskCount !== 1 ? "s" : ""} remaining
            </span>
          </div>
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 p-3 rounded-md mb-2 text-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center text-amber-800 font-medium">
          <ClipboardCheck className="w-4 h-4 mr-2" />
          <span>Complete Your Profile</span>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="text-amber-800 hover:text-amber-950 flex items-center gap-1"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>
      <p className="text-amber-800 mb-2 text-xs">
        Complete these tasks to start accepting bookings:
      </p>
      <ul className="space-y-1">
        <TooltipProvider delayDuration={100}>
          {incompleteTasks.map((key) => {
            const task = taskLabels[key];
            return (
              <li key={key} className="text-xs">
                <div className="flex items-center">
                  <Link
                    href={task.path}
                    className="flex items-center text-amber-800 hover:text-amber-950"
                  >
                    <span>• {task.label}</span>
                  </Link>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3.5 w-3.5 ml-1 text-amber-800/70 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[250px] p-3 bg-card text-card-foreground border shadow-md">
                      <p className="text-xs">{task.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </li>
            );
          })}
        </TooltipProvider>
      </ul>
    </div>
  );
};