"use client";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { trpc } from "./client";

export default function Provider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error: any) => {
            if (error?.data?.code === "UNAUTHORIZED") {
              queryClient.clear();
              router.push("/auth/chef-login");
              toast.error(
                "You are not authorized to access this page. Please login."
              );
            }
          },
        }),
        mutationCache: new MutationCache({
          onError: (error: any) => {
            if (error?.data?.code === "UNAUTHORIZED") {
              queryClient.clear();
              router.push("/auth/chef-login");
              toast.error(
                "You are not authorized to access this page. Please login."
              );
            }
          },
        }),
      })
  );

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${process.env.NEXT_PUBLIC_FEAST_WEB_URL}/api/trpc`,
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
