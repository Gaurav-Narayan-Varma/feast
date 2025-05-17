import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const db = prisma.$extends({
  query: {
    /**
     * Middleware to ensure that all user emails are stored in lowercase
     */
    chefUser: {
      create: async ({ args, query }) => {
        args.data.email = args.data.email.toLowerCase();

        return query(args);
      },
      createMany: async ({ args, query }) => {
        if (Array.isArray(args.data)) {
          args.data.forEach((user) => {
            user.email = user.email.toLowerCase();
          });
        } else {
          args.data.email = args.data.email.toLowerCase();
        }

        return query(args);
      },
      createManyAndReturn: async ({ args, query }) => {
        if (Array.isArray(args.data)) {
          args.data.forEach((user) => {
            user.email = user.email.toLowerCase();
          });
        } else {
          args.data.email = args.data.email.toLowerCase();
        }

        return query(args);
      },
      findFirst: async ({ args, query }) => {
        if (typeof args.where?.email === "string") {
          args.where.email = args.where.email.toLowerCase();
        }

        return query(args);
      },
      findMany: async ({ args, query }) => {
        if (typeof args.where?.email === "string") {
          args.where.email = args.where.email.toLowerCase();
        }

        return query(args);
      },
      findUnique: async ({ args, query }) => {
        if (typeof args.where?.email === "string") {
          args.where.email = args.where.email.toLowerCase();
        }

        return query(args);
      },
      update: async ({ args, query }) => {
        if (typeof args.data.email === "string") {
          args.data.email = args.data.email.toLowerCase();
        }

        if (typeof args.where.email === "string") {
          args.where.email = args.where.email.toLowerCase();
        }

        return query(args);
      },
      updateMany: async ({ args, query }) => {
        if (typeof args.data.email === "string") {
          args.data.email = args.data.email.toLowerCase();
        } else if (Array.isArray(args.data)) {
          args.data.forEach((user) => {
            user.email = user.email.toLowerCase();
          });
        }

        if (typeof args.where?.email === "string") {
          args.where.email = args.where.email.toLowerCase();
        }

        return query(args);
      },
      upsert: async ({ args, query }) => {
        if (typeof args.create.email === "string") {
          args.create.email = args.create.email.toLowerCase();
        }

        if (typeof args.update.email === "string") {
          args.update.email = args.update.email.toLowerCase();
        }

        if (typeof args.where.email === "string") {
          args.where.email = args.where.email.toLowerCase();
        }

        return query(args);
      },
    },
  },
});

export type DbConnType = Parameters<
  Parameters<(typeof db)["$transaction"]>[0]
>[0];
