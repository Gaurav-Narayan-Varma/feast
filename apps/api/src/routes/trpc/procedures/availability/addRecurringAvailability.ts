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
    const isoStartTime = formatInTimeZone(
      parse(startTime, "h:mm a", new Date()),
      "America/New_York",
      "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"
    );
    const isoEndTime = formatInTimeZone(
      parse(endTime, "h:mm a", new Date()),
      "America/New_York",
      "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"
    );

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
              { startTime: { lte: isoStartTime } },
              { endTime: { gt: isoStartTime } },
            ],
          },
          {
            /**
             * New end time falls within existing window
             */
            AND: [
              { startTime: { lt: isoEndTime } },
              { endTime: { gte: isoEndTime } },
            ],
          },
          {
            /**
             * New window completely encompasses existing window
             */
            AND: [
              { startTime: { gte: isoStartTime } },
              { endTime: { lte: isoEndTime } },
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
        startTime: isoStartTime,
        endTime: isoEndTime,
        chefUserId: ctx.chefUserId,
      },
    });
  });
