"use client";
import { trpc } from "@/app/_trpc/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { AppRouter } from "@feast/api";
import { dateOverrideSchema, timesOfDay } from "@feast/shared";
import { inferProcedureOutput } from "@trpc/server";
import { format } from "date-fns";
import { Check, Plus, Trash, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type DateOverrideFormState = {
  selectedDate: Date;
  startTime: string | null;
  endTime: string | null;
  isAvailable: boolean;
};

type DateOverride = inferProcedureOutput<
  AppRouter["chefUser"]["getChefUser"]
>["chefUser"]["dateOverrides"][number];

export function DateOverridesCard({
  dateOverrides,
}: {
  dateOverrides: DateOverride[];
}) {
  const [dateOverrideForm, setDateOverrideForm] =
    useState<DateOverrideFormState>({
      selectedDate: new Date(),
      startTime: null,
      endTime: null,
      isAvailable: false,
    });
  const [isAddMode, setIsAddMode] = useState<boolean>(false);

  const utils = trpc.useUtils();

  const addDateOverride = trpc.availability.addDateOverride.useMutation({
    onSuccess: () => {
      setIsAddMode(false);

      setDateOverrideForm((current) => ({
        ...current,
        startTime: null,
        endTime: null,
        isAvailable: false,
      }));

      utils.chefUser.getChefUser.invalidate();
      toast.success("Date override added");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteDateOverride = trpc.availability.deleteDateOverride.useMutation({
    onSuccess: () => {
      utils.chefUser.getChefUser.invalidate();
      toast.success("Date override deleted");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Date Overrides</CardTitle>
        <CardDescription>
          Override your availability for specific dates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-6 h-[283.2px]">
          <div className="w-1/3 flex justify-center">
            <Calendar
              mode="single"
              selected={dateOverrideForm.selectedDate}
              onSelect={(date) =>
                date &&
                setDateOverrideForm((current) => ({
                  ...current,
                  selectedDate: date,
                }))
              }
              fromDate={new Date()}
            />
          </div>
          <div className="w-2/3 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="font-medium">
                {dateOverrideForm.selectedDate.toLocaleDateString()} Overrides
              </div>
              <Button
                variant="outline"
                label="Add Override"
                size="sm"
                leftIcon={<Plus />}
                onClick={() => setIsAddMode(true)}
              />
            </div>
            {isAddMode && (
              <div className="flex gap-2">
                <div className="flex-1">
                  <Select
                    value={dateOverrideForm.startTime || undefined}
                    onValueChange={(value: (typeof timesOfDay)[number]) =>
                      setDateOverrideForm((current) => ({
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
                    value={dateOverrideForm.endTime || undefined}
                    onValueChange={(value: (typeof timesOfDay)[number]) =>
                      setDateOverrideForm((current) => ({
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
                <div className="flex-1">
                  <Select
                    value={
                      dateOverrideForm.isAvailable ? "Available" : "Unavailable"
                    }
                    onValueChange={(value: "Available" | "Unavailable") =>
                      setDateOverrideForm((current) => ({
                        ...current,
                        isAvailable: value === "Available",
                      }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent className="w-fit">
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Unavailable">Unavailable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  className="p-2 "
                  leftIcon={<Check />}
                  onClick={() => {
                    const result = dateOverrideSchema.safeParse({
                      date: dateOverrideForm.selectedDate,
                      startTime: dateOverrideForm.startTime,
                      endTime: dateOverrideForm.endTime,
                      isAvailable: dateOverrideForm.isAvailable,
                    });

                    if (!result.success) {
                      toast.error(
                        result.error.issues[0]?.message || "An error occurred"
                      );

                      return;
                    }

                    addDateOverride.mutate(result.data);
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
              {dateOverrides.map((dateOverride) => {
                if (
                  dateOverride.date.toDateString() ===
                  dateOverrideForm.selectedDate.toDateString()
                ) {
                  return (
                    <Card
                      key={dateOverride.id}
                      className="px-3 py-1 text-muted-foreground flex flex-row justify-between items-center ml-1 mr-3 mb-2 last:mb-1"
                    >
                      <div className="flex flex-row gap-2 items-center">
                        <div className="text-sm">
                          {format(dateOverride.startTime, "h:mm a")} -{" "}
                          {format(dateOverride.endTime, "h:mm a")}
                        </div>
                        <Badge
                          variant={
                            dateOverride.isAvailable ? "outline" : "secondary"
                          }
                        >
                          {dateOverride.isAvailable
                            ? "Available"
                            : "Unavailable"}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Trash className="text-red-500" />}
                        onClick={() => {
                          deleteDateOverride.mutate({
                            dateOverrideId: dateOverride.id,
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
