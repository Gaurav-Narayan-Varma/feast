import { z } from "zod";
import { Cuisine, DietaryTags, FoodAllergen } from "./types";

export const recipeSchema = z.object({
  name: z.string().min(1, "Recipe name is required"),
  description: z.string().min(1, "Recipe description is required"),
  cuisines: z.array(z.nativeEnum(Cuisine)),
  dietaryTags: z.array(z.nativeEnum(DietaryTags)),
  foodAllergens: z.array(z.nativeEnum(FoodAllergen)),
  ingredients: z.array(
    z.object({
      name: z.string(),
      quantity: z.number(),
      unit: z.string(),
      preparation: z.string(),
    })
  ),
  price: z.number().min(1, "Price must be greater than 0"),
});

export const menuSchema = z.object({
  name: z.string().min(1, "Menu name is required"),
  description: z.string().min(1, "Menu description is required"),
  recipes: z.array(z.string()).nonempty("At least one recipe is required"),
});

export const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const timesOfDay = [
  "12:00 AM",
  "1:00 AM",
  "2:00 AM",
  "3:00 AM",
  "4:00 AM",
  "5:00 AM",
  "6:00 AM",
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
  "10:00 PM",
  "11:00 PM",
] as const;

export const recurringAvailabilitySchema = z
  .object({
    dayOfWeek: z.enum(daysOfWeek, {
      errorMap: () => ({ message: "Day of week is required" }),
    }),
    startTime: z.enum(timesOfDay, {
      errorMap: () => ({ message: "Start time is required" }),
    }),
    endTime: z.enum(timesOfDay, {
      errorMap: () => ({ message: "End time is required" }),
    }),
  })
  .refine(
    (data) => {
      const startIndex = timesOfDay.indexOf(data.startTime);
      const endIndex = timesOfDay.indexOf(data.endTime);
      return startIndex < endIndex;
    },
    {
      message: "Start time must be before end time",
    }
  );

export const dateOverrideSchema = z.object({
  date: z.coerce.date(),
  startTime: z.enum(timesOfDay, {
    errorMap: () => ({ message: "Start time is required" }),
  }),
  endTime: z.enum(timesOfDay, {
    errorMap: () => ({ message: "End time is required" }),
  }),
  isAvailable: z.boolean(),
});
