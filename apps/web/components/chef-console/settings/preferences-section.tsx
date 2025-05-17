import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "react-hot-toast";
// import { Chef } from "@/types/chef";
// import { chefApi } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bell, Calendar, Clock, Info, Loader2, TimerReset } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const chefPreferencesSchema = z.object({
  maxOrdersPerDay: z.coerce
    .number()
    .min(1, "Must have at least 1 order per day")
    .max(10, "Cannot exceed 10 orders per day"),
  totalEventLengthMinutes: z.coerce
    .number()
    .min(30, "Minimum event length must be at least 30 minutes")
    .max(720, "Maximum event length cannot exceed 12 hours (720 minutes)"),
  minimumNoticeHours: z.coerce
    .number()
    .min(1, "Minimum notice must be at least 1 hour")
    .max(168, "Minimum notice cannot exceed 1 week (168 hours)"),
  bufferBetweenEventsMinutes: z.coerce
    .number()
    .min(0, "Buffer time cannot be negative")
    .max(240, "Buffer time cannot exceed 4 hours (240 minutes)"),
});

type ChefPreferencesFormValues = z.infer<typeof chefPreferencesSchema>;

interface ChefPreferencesCardProps {
  chef: any;
  refreshProfile: () => Promise<void>;
}

const ChefPreferences: React.FC<ChefPreferencesCardProps> = ({
  chef,
  refreshProfile,
}) => {
  const isMobile = useIsMobile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [preferences, setPreferences] =
    useState<ChefPreferencesFormValues | null>(null);

  const form = useForm<ChefPreferencesFormValues>({
    resolver: zodResolver(chefPreferencesSchema),
    // Don't set default values here, we'll reset the form when data is loaded
    defaultValues: {
      maxOrdersPerDay: 0,
      totalEventLengthMinutes: 0,
      minimumNoticeHours: 0,
      bufferBetweenEventsMinutes: 0,
    },
  });

  // Fetch chef preferences when component mounts
  useEffect(() => {
    const fetchChefPreferences = async () => {
      try {
        setIsLoading(true);
        // const response = await chefApi.getChefPreferences();

        // const loadedPreferences = {
        //   maxOrdersPerDay: response.preferences.maxOrdersPerDay,
        //   totalEventLengthMinutes: response.preferences.totalEventLengthMinutes,
        //   minimumNoticeHours: response.preferences.minimumNoticeHours,
        //   bufferBetweenEventsMinutes:
        //     response.preferences.bufferBetweenEventsMinutes,
        // };

        // setPreferences(loadedPreferences);
        // form.reset(loadedPreferences);
        setIsLoading(false);
      } catch (error) {
        // console.error("Error fetching chef preferences:", error);
        // toast({
        //   title: "Error",
        //   description:
        //     "Failed to load chef preferences. Please try again later.",
        //   variant: "destructive",
        // });
      }
    };

    fetchChefPreferences();
  }, [form, toast]);

  const onSubmit = async (data: ChefPreferencesFormValues) => {
    try {
      setIsSubmitting(true);

      // Make the API call to update preferences
    //   await chefApi.updateChefPreferences(data);

      setPreferences(data);

      // toast({
      //   title: "Success",
      //   description: "Chef preferences updated successfully",
      // });

      // Refresh profile after successful update
      await refreshProfile();
    } catch (error) {
      console.error("Error updating chef preferences:", error);
      // toast({
      //   title: "Error",
      //   description:
      //     "Failed to update chef preferences. Please try again later.",
      //   variant: "destructive",
      // });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatMinutesToHoursAndMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) {
      return `${remainingMinutes} minutes`;
    } else if (remainingMinutes === 0) {
      return `${hours} hour${hours > 1 ? "s" : ""}`;
    } else {
      return `${hours} hour${hours > 1 ? "s" : ""} ${remainingMinutes} minutes`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chef Preferences</CardTitle>
        <CardDescription>
          Customize how you receive and manage orders
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="maxOrdersPerDay"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className="text-base">
                      Maximum Orders Per Day
                    </FormLabel>
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px] p-3 text-xs">
                          <p>
                            Set the maximum number of orders you can handle in a
                            single day. This helps prevent overbooking and
                            ensures you can deliver quality service to each
                            customer. Regardless of this value, we will not
                            allow you to be booked if you are unavailable.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <FormControl>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        {...field}
                        min={1}
                        max={10}
                        className="max-w-[100px]"
                      />
                      <span className="ml-2 text-sm text-muted-foreground">
                        orders
                      </span>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Limit the number of bookings you receive each day
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="totalEventLengthMinutes"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className="text-base">
                      Maximum Event Length
                    </FormLabel>
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px] p-3 text-xs">
                          <p>
                            Define the duration for a single event. This helps
                            ensures you don't get booked for events longer than
                            you're comfortable with. This value is not shown to
                            customers.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <FormControl>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        {...field}
                        min={30}
                        max={720}
                        step={30}
                        className="max-w-[100px]"
                      />
                      <span className="ml-2 text-sm text-muted-foreground">
                        minutes (
                        {formatMinutesToHoursAndMinutes(field.value || 0)})
                      </span>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Sets the amount of time each event will take up in your
                    calendar
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minimumNoticeHours"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className="text-base">
                      Minimum Notice Period
                    </FormLabel>
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px] p-3 text-xs">
                          <p>
                            Specify how much advance notice you need before
                            accepting a booking. This gives you enough time to
                            prepare, shop for ingredients, and arrange your
                            schedule.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <FormControl>
                    <div className="flex items-center">
                      <Bell className="mr-2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        {...field}
                        min={1}
                        max={168}
                        className="max-w-[100px]"
                      />
                      <span className="ml-2 text-sm text-muted-foreground">
                        hours
                      </span>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Set how much advance notice you need before an event
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bufferBetweenEventsMinutes"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className="text-base">
                      Buffer Between Events
                    </FormLabel>
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px] p-3 text-xs">
                          <p>
                            Set the minimum time you need between consecutive
                            events. This allows you time to clean up, reset, and
                            travel between bookings.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <FormControl>
                    <div className="flex items-center">
                      <TimerReset className="mr-2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        {...field}
                        min={0}
                        max={240}
                        step={15}
                        className="max-w-[100px]"
                      />
                      <span className="ml-2 text-sm text-muted-foreground">
                        minutes (
                        {formatMinutesToHoursAndMinutes(field.value || 0)})
                      </span>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Set the minimum time needed between consecutive events
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting || !form.formState.isDirty}
              className={isMobile ? "w-full" : ""}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                "Save Preferences"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ChefPreferences;
