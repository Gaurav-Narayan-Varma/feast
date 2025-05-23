import { createTRPCReact } from "@trpc/react-query";
import { type AppRouter } from "@feast/api";

export const trpc = createTRPCReact<AppRouter>({});