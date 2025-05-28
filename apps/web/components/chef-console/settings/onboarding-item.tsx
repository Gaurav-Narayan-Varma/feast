import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { CheckCircle, Info } from "lucide-react";
import React from "react";

export default function OnboardingItem({
  icon,
  title,
  description,
  children,
  status = "pending",
  tooltipContent,
  isMobile,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
  status?: "completed" | "pending";
  tooltipContent?: string;
  isMobile: boolean;
}) {
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
          {React.cloneElement(icon as React.ReactElement<any>, {
            className: cn("h-6 w-6", textColor),
          })}
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
                    <Info className="h-4 w-4 text-muted-foreground cursor-help stroke-[1.5]" />
                  </TooltipTrigger>
                  <TooltipContent align="end" className="p-3 text-xs data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade">
                    {tooltipContent}
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
}
