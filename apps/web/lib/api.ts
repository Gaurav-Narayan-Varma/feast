// import type { AppRouter } from "@feast/api";
// import { createTRPCClient, httpBatchLink } from "@trpc/client";

// import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

// export const api = createTRPCClient<AppRouter>({
//   links: [
//     httpBatchLink({
//       url: process.env.NEXT_PUBLIC_API_URL as string,
//       fetch: async (url, options) => {
//         try {
//           const res = await fetch(url, {
//             ...options,
//             // We need to pass `true` to let the browser know to store the cookie
//             // we include in the `Set-Cookie` header.
//             credentials: "include",
//           });

//           // If status is UNAUTHORIZED, session cookies have been deleted so redirect to signup
//           if (res.status === 401 && window.location.pathname !== "/signup") {
//             window.location.pathname = "/signup";
//           }

//           return res;
//         } catch (error) {
//           throw error;
//         }
//       },
//     }),
//   ],
// });

// export type ArrayElement<ArrayType extends unknown[] | null> =
//   ArrayType extends (infer ElementType)[] ? ElementType : never;

// export type APIInput = inferRouterInputs<AppRouter>;
// export type APIOutput = inferRouterOutputs<AppRouter>;

// export type APIError = Error & {
//   data: { code: string; httpStatus: number; cause?: string };
// };

// export function isAPIError(error: unknown): error is APIError {
//   return error instanceof Error && "data" in error && Boolean(error.data);
// }
