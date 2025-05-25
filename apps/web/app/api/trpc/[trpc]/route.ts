import { appRouter } from "@feast/api";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = (req: Request) => {
  console.log(`[tRPC] Received ${req.method} request to ${req.url}`);

  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: ({ req, resHeaders }) => ({
      req,
      res: {
        appendHeader: (key: string, value: string) => {
          resHeaders.append(key, value);
        },
      },
    }),
  });
};

export { handler as GET, handler as POST };
