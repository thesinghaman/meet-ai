import { z } from "zod";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import { agentsInsertSchema } from "../schema";

// Creating the agentsRouter using TRPC's router creation function
export const agentsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      // Querying the database to select all agents from the 'agents' table
      const [existingAgent] = await db
        // TODO: Change to actual count of meetings
        .select({
          meetingCount: sql<number>`5`,
          ...getTableColumns(agents),
        })
        .from(agents)
        .where(eq(agents.id, input.id));

      // Returning the data (list of agents) fetched from the database
      return existingAgent;
    }),

  // Defining the 'getMany' query procedure, which retrieves multiple agents from the database
  getMany: protectedProcedure.query(async () => {
    // Querying the database to select all agents from the 'agents' table
    const data = await db.select().from(agents);

    // Returning the data (list of agents) fetched from the database
    return data;
  }),

  // Defining the 'create' mutation procedure for creating new agents in the database
  // Uses protectedProcedure to ensure only authenticated users can create agents
  create: protectedProcedure
    .input(agentsInsertSchema) // Validates input data against the agents insert schema
    .mutation(async ({ input, ctx }) => {
      // Insert a new agent into the database with validated input data
      const [createdAgent] = await db
        .insert(agents)
        .values({
          ...input, // Spread all validated input fields
          userId: ctx.auth.user.id, // Associate the agent with the authenticated user's ID
        })
        .returning(); // Return the complete created record including auto-generated fields

      // Return the newly created agent data to the client
      return createdAgent;
    }),
});
