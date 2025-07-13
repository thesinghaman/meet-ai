import { z } from "zod";
import { desc, count, and, eq, getTableColumns, sql, ilike } from "drizzle-orm";

import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import {
  DEFAULT_PAGE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
  DEFAULT_PAGE_SIZE,
} from "@/constants";

import { agentsInsertSchema } from "../schema";

// Creating the agentsRouter using TRPC's router creation function
export const agentsRouter = createTRPCRouter({
  // Defining the 'getOne' query procedure, which retrieves a single agent
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
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { search, page, pageSize } = input;
      // Querying the database to select all agents from the 'agents' table
      const data = await db
        .select({
          meetingCount: sql<number>`5`,
          ...getTableColumns(agents),
        })
        .from(agents)
        .where(
          and(
            eq(agents.userId, ctx.auth.user.id), // Filter agents by the authenticated user's ID
            search ? ilike(agents.name, `%${search}%`) : undefined // Optional search filter
          )
        )
        .orderBy(desc(agents.createdAt), desc(agents.id)) // Order agents by creation date in descending order
        .limit(pageSize) // Limit the number of results to the specified page size
        .offset((page - 1) * pageSize); // Calculate the offset based on the current page and page size

      const [totalCount] = await db
        .select({ count: count() })
        .from(agents)
        .where(
          and(
            eq(agents.userId, ctx.auth.user.id), // Filter agents by the authenticated user's ID
            search ? ilike(agents.name, `%${search}%`) : undefined // Optional search filter
          )
        );

      const totalPages = Math.ceil(totalCount.count / pageSize);

      return {
        items: data, // Return the list of agents
        totalCount: totalCount.count, // Return the total count of agents
        totalPages, // Return the total number of pages
      };
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
