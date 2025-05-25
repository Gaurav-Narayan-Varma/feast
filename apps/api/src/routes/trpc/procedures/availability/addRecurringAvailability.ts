import { db } from "@/db.js";
import { chefUserProcedure } from "@/routes/trpc/trpcBase.js";
import { nid } from "@/utils/generalUtils.js";
import { recurringAvailabilitySchema } from "@feast/shared";
import { parse } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

export const addRecurringAvailability = chefUserProcedure
  .input(recurringAvailabilitySchema)
  .mutation(async ({ ctx, input }) => {
    const { dayOfWeek, startTime, endTime } = input;

    /**
     * Convert the start and end times to ISO 8601 format
     */
    // const isoStartTime = formatInTimeZone(
    //   parse(startTime, "h:mm a", new Date()),
    //   "America/New_York",
    //   "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"
    // );
    // const isoEndTime = formatInTimeZone(
    //   parse(endTime, "h:mm a", new Date()),
    //   "America/New_York",
    //   "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"
    // );

    const overlappingAvailability = await db.recurringAvailability.findFirst({
      where: {
        chefUserId: ctx.chefUserId,
        dayOfWeek,
        OR: [
          {
            /**
             * New start time falls within existing window
             */
            AND: [
              { startTime: { lte: parse(startTime, "h:mm a", new Date()) } },
              { endTime: { gt: parse(startTime, "h:mm a", new Date()) } },
            ],
          },
          {
            /**
             * New end time falls within existing window
             */
            AND: [
              { startTime: { lt: parse(endTime, "h:mm a", new Date()) } },
              { endTime: { gte: parse(endTime, "h:mm a", new Date()) } },
            ],
          },
          {
            /**
             * New window completely encompasses existing window
             */
            AND: [
              { startTime: { gte: parse(startTime, "h:mm a", new Date()) } },
              { endTime: { lte: parse(endTime, "h:mm a", new Date()) } },
            ],
          },
        ],
      },
    });

    if (overlappingAvailability) {
      throw new Error(
        "This time window overlaps with an existing availability window"
      );
    }

    await db.recurringAvailability.create({
      data: {
        id: nid(),
        dayOfWeek,
        startTime: parse(startTime, "h:mm a", new Date()),
        endTime: parse(endTime, "h:mm a", new Date()),
        chefUserId: ctx.chefUserId,
      },
    });
  });
