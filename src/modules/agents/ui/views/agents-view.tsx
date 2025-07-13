"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { EmptyState } from "@/components/empty-state";

import { DataTable } from "../components/data-table";
import { columns } from "../components/columns";

// AgentsView component for displaying the fetched agents' data
export const AgentsView = () => {
  // Accessing the TRPC hook to interact with the backend
  const trpc = useTRPC();

  // Fetching the list of agents using the `useSuspenseQuery` hook
  // This hook will automatically throw a promise while data is loading, triggering Suspense
  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

  // This component returns a responsive layout containing a DataTable if data is available,
  // and an EmptyState component with a prompt to create the first agent if the data is empty.
  return (
    // Main container with responsive padding and vertical spacing
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      {/* Renders a data table with the provided data and column definitions */}
      <DataTable data={data} columns={columns} />

      {/* If there's no data, show an empty state message prompting the user to create an agent */}
      {data.length === 0 && (
        <EmptyState
          title="Create your first agent"
          description="Create an agent to join meetings. Each agent will follow your instructions and can interact with participants during the calls."
        />
      )}
    </div>
  );
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
