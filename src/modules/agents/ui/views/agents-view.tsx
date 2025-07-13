"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { EmptyState } from "@/components/empty-state";

import { DataTable } from "../components/data-table";
import { columns } from "../components/columns";
import { useAgentsFilters } from "../../hooks/use-agents-filters";
import { DataPagination } from "../components/data-pagination";

// AgentsView component for displaying the fetched agents' data
export const AgentsView = () => {
  const [filters, setFilters] = useAgentsFilters();

  // Accessing the TRPC hook to interact with the backend
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.agents.getMany.queryOptions({
      ...filters,
    })
  );

  // This component returns a responsive layout containing a DataTable if data is available,
  // and an EmptyState component with a prompt to create the first agent if the data is empty.
  return (
    // Main container with responsive padding and vertical spacing
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      {/* Renders a data table with the provided data and column definitions */}
      <DataTable data={data.items} columns={columns} />

      <DataPagination
        page={filters.page}
        totalPages={data.totalPages}
        onPageChange={(page) => setFilters({ page })}
      />

      {/* If there's no data, show an empty state message prompting the user to create an agent */}
      {data.items.length === 0 && (
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
