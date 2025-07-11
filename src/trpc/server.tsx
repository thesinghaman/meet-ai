import "server-only";

import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { cache } from "react";

import { createTRPCContext } from "./init";
import { makeQueryClient } from "./query-client";
import { appRouter } from "./routers/_app";

export const getQueryClient = cache(makeQueryClient);

/**
 * Create a tRPC proxy with React Query integration.
 *
 * - ctx: Function to create the tRPC context for each request.
 * - router: The root tRPC app router that defines all API routes.
 * - queryClient: The stable React Query client instance.
 *
 * This proxy simplifies tRPC usage with React Query by combining context,
 * router, and query client into one hook-based interface.
 */
export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});
