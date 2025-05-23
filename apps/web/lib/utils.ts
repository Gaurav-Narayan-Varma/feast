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
  recurringAvailability,
  dateOverride,
  selectedDate,
}: {
  recurringAvailability: {
    startTime: string;
    endTime: string;
    dayOfWeek: string;
  }[];
  dateOverride: {
    date: string;
    startTime: string;
    endTime: string;
  }[];
  selectedDate: Date;
}) {
  const dayOfWeek = DAYS_OF_WEEK[selectedDate.getDay()];

  const dateString = selectedDate.toISOString().split("T")[0];
  const override = dateOverride.find((o) => {
    return o.date.split("T")[0] === dateString;
  });

  if (override) {
    return (
      generateSlotsForRange(
        new Date(override.startTime),
        new Date(override.endTime),
        []
      ) ?? []
    );
  }

  /**
   * If there is a recurring availability on the day of the week selected
   * then generate slots for it
   */
  const recurringAvailabilityForSelectedDayOfWeek = recurringAvailability.find(
    (r) => {
      return r.dayOfWeek === dayOfWeek;
    }
  );

  if (recurringAvailabilityForSelectedDayOfWeek) {
    return (
      generateSlotsForRange(
        new Date(recurringAvailabilityForSelectedDayOfWeek.startTime),
        new Date(recurringAvailabilityForSelectedDayOfWeek.endTime),
        []
      ) ?? []
    );
  }

  return [];
}

function generateSlotsForRange(startTime: Date, endTime: Date, slots: Date[]) {
  /**
   * Calculate duration in hours
   */
  const durationHours =
    (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

  /**
   * If duration is less than 2 hours, return null
   */
  if (durationHours < 2) {
    return null;
  }

  /**
   * Generate slots
   */
  let currentSlot = new Date(startTime);

  while (currentSlot.getTime() + 1000 * 60 * 60 * 2 <= endTime.getTime()) {
    slots.push(new Date(currentSlot));
    // Add 30 minutes
    currentSlot = new Date(currentSlot.getTime() + 1000 * 60 * 30);
  }

  return slots;
}


/**
 * Spec for availability logic
 * 
 * - create new array for availabilities - store recurring availabilities in this slot
 * - iterate over this array and if available override intersects, then return new availability
 *      - if avail. override is completely inside, then ignore
 *      - if avail. override is completely outside, then return new availability
 *      - if only one end of avail. override intersects, then return extended avail
 * 
 * - iterate over extended avail. array, and if unavail. override intersects, then return new avail
 *      - if unavail. override is completely inside, then return two avail.
 *      - if unavail. override is completely outside, then ignore
 *      - if unavail. override overlaps on one end, then carve out that end and return new avail
 * 
 * - then with this new avail list, check for overlaps and if an overlap exists, then combine it
 *      - lastly with final array of availabilities, run it by generate timeslots function
 */
