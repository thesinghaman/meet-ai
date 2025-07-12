import { inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@/trpc/routers/_app";

// Infer the return type of the agents.getOne procedure from the AppRouter
// This provides type safety for the agent data structure returned by the getOne query
export type AgentGetOne = inferRouterOutputs<AppRouter>["agents"]["getOne"];
