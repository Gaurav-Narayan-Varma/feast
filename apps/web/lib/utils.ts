import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function generateTimeSlots({
  recurringAvailabilities,
  dateOverrides,
  selectedDate,
}: {
  recurringAvailabilities: {
    startTime: string;
    endTime: string;
    dayOfWeek: string;
  }[];
  dateOverrides: {
    date: string;
    startTime: string;
    endTime: string;
  }[];
  selectedDate: Date;
}) {
  const dateOverridesForSelectedDate = dateOverrides.filter((o) => {
    return (
      new Date(o.date)
        .toLocaleString("en-US", { timeZone: "America/New_York" })
        .split(",")[0] ===
      selectedDate.toLocaleDateString("en-US", {
        timeZone: "America/New_York",
      })
    );
  });

  if (dateOverridesForSelectedDate.length > 0) {
    const slots: Date[] = [];

    dateOverridesForSelectedDate.forEach((o) => {
      const slotsForRange = generateSlotsForRange(
        new Date(o.startTime),
        new Date(o.endTime),
        []
      );

      if (slotsForRange) {
        slots.push(...slotsForRange);
      }
    });

    return slots;
  }

  const recurringAvailabilitiesForSelectedDayOfWeek =
    recurringAvailabilities.filter((r) => {
      return r.dayOfWeek === DAYS_OF_WEEK[selectedDate.getDay()];
    });

  if (recurringAvailabilitiesForSelectedDayOfWeek.length > 0) {
    const slots: Date[] = [];

    recurringAvailabilitiesForSelectedDayOfWeek.forEach((r) => {
      const slotsForRange = generateSlotsForRange(
        new Date(r.startTime),
        new Date(r.endTime),
        []
      );

      if (slotsForRange) {
        slots.push(...slotsForRange);
      }
    });

    return slots;
  }

  return [];
}

function generateSlotsForRange(
  startTime: Date,
  endTime: Date,
  slots: Date[]
): Date[] {
  /**
   * Calculate duration in hours
   */
  const durationHours =
    (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

  /**
   * If duration is less than 2 hours, return null
   */
  if (durationHours < 2) {
    return [];
  }

  /**
   * Generate slots
   */
  let currentSlot = new Date(startTime);

  while (currentSlot.getTime() + 1000 * 60 * 60 * 2 <= endTime.getTime()) {
    slots.push(new Date(currentSlot));
    currentSlot = new Date(currentSlot.getTime() + 1000 * 60 * 30);
  }

  return slots;
}
