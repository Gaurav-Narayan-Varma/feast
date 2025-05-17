import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@feast/api";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: ({ req, resHeaders }) => ({
      req,
      res: {
        appendHeader: (key: string, value: string) => {
          resHeaders.append(key, value);
        }
      }
    }),
  });

export { handler as GET, handler as POST };