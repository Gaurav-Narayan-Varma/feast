"use client";
import { trpc } from "@/app/_trpc/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ChefOnboardingAlert() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getChefUser = trpc.chefUser.getChefUser.useQuery();

  const incompleteTasks = [];

  if (getChefUser.data?.chefUser.isIdVerified === false) {
    incompleteTasks.push("hasVerificationSession");
  }

  if (getChefUser.data?.chefUser.stripeAccountId === null) {
    incompleteTasks.push("stripeAccountOnboarding");
  }

  if (getChefUser.data?.chefUser.form1099DocumentKey === null) {
    incompleteTasks.push("form1099");
  }

  if (getChefUser.data?.chefUser.isApproved === false) {
    incompleteTasks.push("platformApproval");
  }

  const taskCount = incompleteTasks.length;

  const taskLabels = {
    hasVerificationSession: {
      label: "ID verification",
      path: "/chef-console/settings",
      tooltip:
        "Verify your identity to build trust with customers and ensure platform security.",
    },
    stripeAccountOnboarding: {
      label: "Stripe account setup",
      path: "/chef-console/settings",
      tooltip:
        "Set up your Stripe account to receive secure payments directly to your bank account.",
    },
    form1099: {
      label: "Form 1099 submission",
      path: "/chef-console/settings",
      tooltip:
        "Submit your 1099 contract to officially join the Feast platform.",
    },
    platformApproval: {
      label: "Platform approval",
      path: "/chef-console/settings",
      tooltip:
        "After finishing all other remaining tasks, please contact [feast-team@joinfeastco.com] for next steps in your approval process.",
    },
  };

  if (isCollapsed) {
    return (
      <div
        className="bg-amber-50 p-2 rounded-md cursor-pointer m-4"
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
    <div className="bg-amber-50 p-3 m-4 rounded-md text-sm">
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
            const task = taskLabels[key as keyof typeof taskLabels];
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
}
