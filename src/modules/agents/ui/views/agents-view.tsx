"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";

// AgentsView component for displaying the fetched agents' data
export const AgentsView = () => {
  // Accessing the TRPC hook to interact with the backend
  const trpc = useTRPC();

  // Fetching the list of agents using the `useSuspenseQuery` hook
  // This hook will automatically throw a promise while data is loading, triggering Suspense
  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

  // Rendering the fetched data (JSON stringified for easy inspection)
  return <div>{JSON.stringify(data, null, 2)}</div>;
};

// AgentsViewLoading component to show a loading spinner or message
// This component is used in Suspense as the fallback UI while waiting for data to load
export const AgentsViewLoading = () => {
  return (
    <LoadingState
      title="Loading Agents"
      description="This may take a few seconds depending on your internet connection"
    />
  );
};

// AgentsViewError component to show a user-friendly error message
// This component is used in ErrorBoundary to catch any errors during data fetching or rendering
export const AgentsViewError = () => {
  return (
    <ErrorState
      title="Error Loading Agents"
      description="Please try again later"
    />
  );
};
