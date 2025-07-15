import { inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@/trpc/routers/_app";

// Infer the return type of the `meetings.getOne` procedure from the AppRouter
// This provides type safety for the meeting data structure returned by the getOne query
export type MeetingGetOne = inferRouterOutputs<AppRouter>["meetings"]["getOne"];
export type MeetingGetMany =
  inferRouterOutputs<AppRouter>["meetings"]["getMany"]["items"];
