import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { createTRPCContext } from "@/trpc/init";
import { appRouter } from "@/trpc/routers/_app";

/**
 * tRPC request handler function for Next.js API routes.
 *
 * Handles incoming HTTP requests and forwards them to the tRPC router.
 * Supports both GET and POST methods.
 *
 */
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc", // API route endpoint path
    req, // Incoming request to handle
    router: appRouter, // The tRPC router handling all RPC calls
    createContext: createTRPCContext, // Context creator for request lifecycle
  });

// Export handler for both GET and POST HTTP methods in Next.js route handler
export { handler as GET, handler as POST };
