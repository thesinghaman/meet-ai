import { initTRPC, TRPCError } from "@trpc/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { cache } from "react";

export const createTRPCContext = cache(async () => {
  // Example static user ID
  return { userId: "user_123" };
});

const t = initTRPC.create({
  // transformer: superjson,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource.",
    });
  }

  return next({ ctx: { ...ctx, auth: session } });
});
