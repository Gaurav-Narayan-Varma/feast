import { db } from "@/db.js";
import { chefUserProcedure } from "@/routes/trpc/trpcBase.js";
import { nid } from "@/utils/generalUtils.js";
import { dateOverrideSchema } from "@feast/shared";
import { parse } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

export const addDateOverride = chefUserProcedure
  .input(dateOverrideSchema)
  .mutation(async ({ ctx, input }) => {
    const { date, startTime, endTime, isAvailable } = input;

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

    const overlappingDateOverride = await db.dateOverride.findFirst({
      where: {
        chefUserId: ctx.chefUserId,
        date,
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

    if (overlappingDateOverride) {
      throw new Error(
        "This time window overlaps with an existing availability window"
      );
    }

    await db.dateOverride.create({
      data: {
        id: nid(),
        date,
        startTime: isoStartTime,
        endTime: isoEndTime,
        isAvailable,
        chefUserId: ctx.chefUserId,
      },
    });
  });
