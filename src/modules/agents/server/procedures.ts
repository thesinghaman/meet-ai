import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";

// Creating the agentsRouter using TRPC's router creation function
export const agentsRouter = createTRPCRouter({
  // Defining the 'getMany' query procedure, which retrieves multiple agents from the database
  getMany: baseProcedure.query(async () => {
    // Querying the database to select all agents from the 'agents' table
    const data = await db.select().from(agents);

    // Returning the data (list of agents) fetched from the database
    return data;
  }),
});
