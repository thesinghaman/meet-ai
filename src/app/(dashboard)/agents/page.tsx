import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";

import {
  AgentsView,
  AgentsViewError,
  AgentsViewLoading,
} from "@/modules/agents/ui/views/agents-view";

// Page component responsible for rendering the agents view, with necessary data fetching and error handling
const Page = () => {
  // Instantiate the query client for managing data fetching and cache
  const queryClient = getQueryClient();

  // Prefetch the query data for agents, ensuring it's ready before rendering the page
  void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());

  return (
    // Hydration boundary for handling the initial state of the query cache on page load
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* Suspense for rendering the loading state while waiting for the query to resolve */}
      <Suspense fallback={<AgentsViewLoading />}>
        {/* ErrorBoundary for catching and displaying any errors that occur in the agent view */}
        <ErrorBoundary fallback={<AgentsViewError />}>
          {/* Main component that displays the list of agents */}
          <AgentsView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

// Exporting the Page component for use in other parts of the application
export default Page;
