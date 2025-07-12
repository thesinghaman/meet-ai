import { Suspense } from "react";
import { headers } from "next/headers";
import { ErrorBoundary } from "react-error-boundary";
import { redirect } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/trpc/server";

import { AgentsListHeader } from "@/modules/agents/ui/components/agents-list-header";
import {
  AgentsView,
  AgentsViewError,
  AgentsViewLoading,
} from "@/modules/agents/ui/views/agents-view";

// Page component responsible for rendering the agents view, with necessary data fetching and error handling
const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  // Instantiate the query client for managing data fetching and cache
  const queryClient = getQueryClient();

  // Prefetch the query data for agents, ensuring it's ready before rendering the page
  void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());

  return (
    <>
      <AgentsListHeader />

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
    </>
  );
};

// Exporting the Page component for use in other parts of the application
export default Page;
