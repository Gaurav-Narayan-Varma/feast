import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type AppRouter } from "@feast/api";
import {
  daysOfWeek,
  recurringAvailabilitySchema,
  timesOfDay,
} from "@feast/shared";
import { type inferProcedureOutput } from "@trpc/server";
import cx from "clsx";
import { format } from "date-fns";
import { Check, Plus, Trash, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type RecurringAvailabilityFormState = {
  dayOfWeek: (typeof daysOfWeek)[number];
  startTime: (typeof timesOfDay)[number] | null;
  endTime: (typeof timesOfDay)[number] | null;
};

type RecurringAvailability = inferProcedureOutput<
  AppRouter["chefUser"]["getChefUser"]
>["chefUser"]["availabilities"][number];

export default function WeeklyAvailabilityCard({
  availabilities,
}: {
  availabilities: RecurringAvailability[];
}) {
  const [isAddMode, setIsAddMode] = useState<boolean>(false);
  const [recurringAvailabilityForm, setRecurringAvailabilityForm] =
    useState<RecurringAvailabilityFormState>({
      dayOfWeek: "Monday",
      startTime: null,
      endTime: null,
    });

  const utils = trpc.useUtils();

  const addWeeklyAvailability =
    trpc.availability.addRecurringAvailability.useMutation({
      onSuccess: () => {
        setIsAddMode(false);
        setRecurringAvailabilityForm((current) => ({
          ...current,
          startTime: null,
          endTime: null,
        }));

        utils.chefUser.getChefUser.invalidate();

        toast.success("Weekly availability added successfully");
      },
      onError: (error) => {
        toast.error(error.message);

        // const parsedError = JSON.parse(error.message);
        // toast.error(parsedError[0].message);
      },
    });

  const deleteRecurringAvailability =
    trpc.availability.deleteRecurringAvailability.useMutation({
      onSuccess: () => {
        utils.chefUser.getChefUser.invalidate();

        toast.success("Availability deleted successfully");
      },
      onError: (error) => {
        const parsedError = JSON.parse(error.message);
        toast.error(parsedError[0].message);
      },
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Availability</CardTitle>
        <CardDescription>
          Set your cooking availability in Eastern Time (ET)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-6 h-[300px]">
          {/* Weekdays */}
          <div className="flex flex-col gap-2 w-1/3">
            {daysOfWeek.map((day) => (
              <Button
                key={day}
                variant="outline"
                label={day}
                className={cx(
                  recurringAvailabilityForm.dayOfWeek === day &&
                    "bg-ds-chef-100 "
                )}
                onClick={() =>
                  setRecurringAvailabilityForm({
                    ...recurringAvailabilityForm,
                    dayOfWeek: day,
                  })
                }
              />
            ))}
          </div>
          {/* Recurring availability manager */}
          <div className="flex flex-col w-2/3 gap-4">
            {/* Recurring availability header */}
            <div className="flex justify-between items-center">
              <div className="font-medium">
                {recurringAvailabilityForm.dayOfWeek} Availabilities
              </div>
              <Button
                variant="outline"
                label="Add Availability"
                size="sm"
                leftIcon={<Plus />}
                onClick={() => setIsAddMode(true)}
              />
            </div>
            {/* Add availability form */}
            {isAddMode && (
              <div className="flex gap-2">
                <div className="flex-1">
                  <Select
                    value={recurringAvailabilityForm.startTime || undefined}
                    onValueChange={(value: (typeof timesOfDay)[number]) =>
                      setRecurringAvailabilityForm((current) => ({
                        ...current,
                        startTime: value,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a time" />
                    </SelectTrigger>
                    <SelectContent className="h-60">
                      {timesOfDay.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Select
                    value={recurringAvailabilityForm.endTime || undefined}
                    onValueChange={(value: (typeof timesOfDay)[number]) =>
                      setRecurringAvailabilityForm((current) => ({
                        ...current,
                        endTime: value,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a time" />
                    </SelectTrigger>
                    <SelectContent className="w-fit h-60">
                      {timesOfDay.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  className="p-2 "
                  leftIcon={<Check />}
                  onClick={() => {
                    const result = recurringAvailabilitySchema.safeParse({
                      dayOfWeek: recurringAvailabilityForm.dayOfWeek,
                      startTime: recurringAvailabilityForm.startTime,
                      endTime: recurringAvailabilityForm.endTime,
                    });

                    if (!result.success) {
                      toast.error(
                        result.error.issues[0]?.message || "An error occurred"
                      );

                      return;
                    }

                    addWeeklyAvailability.mutate(result.data);
                  }}
                />
                <Button
                  variant="outline"
                  className="p-2"
                  leftIcon={<X />}
                  onClick={() => setIsAddMode(false)}
                />
              </div>
            )}
            {/* Recurring availability list */}
            <ScrollArea className="overflow-y-auto">
              {availabilities.map((availability) => {
                if (
                  availability.dayOfWeek === recurringAvailabilityForm.dayOfWeek
                ) {
                  return (
                    <Card
                      key={availability.id}
                      className="px-3 py-1 text-muted-foreground flex flex-row justify-between items-center ml-1 mr-3 mb-2 last:mb-1"
                    >
                      <div>
                        {format(availability.startTime, "h:mm a")} -{" "}
                        {format(availability.endTime, "h:mm a")}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Trash className="text-red-500" />}
                        onClick={() => {
                          deleteRecurringAvailability.mutate({
                            recurringAvailabilityId: availability.id,
                          });
                        }}
                      />
                    </Card>
                  );
                }
              })}
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
