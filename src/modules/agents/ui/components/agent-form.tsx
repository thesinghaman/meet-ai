import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GeneratedAvatar } from "@/components/generated-avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { AgentGetOne } from "../../types";
import { agentsInsertSchema } from "../../schema";

// Define the props interface for the AgentForm component
interface AgentFormProps {
  onSuccess?: () => void; // Optional callback function called when agent creation/update is successful
  onCancel?: () => void; // Optional callback function called when user cancels the form
  initialValues?: AgentGetOne; // Optional initial values for editing an existing agent
}

// Main AgentForm component for creating and editing agents
export const AgentForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: AgentFormProps) => {
  // Get TRPC client instance for making API calls
  const trpc = useTRPC();
  // Get query client for managing React Query cache
  const queryClient = useQueryClient();

  // Set up mutation for creating agents with success and error handling
  const createAgent = useMutation(
    trpc.agents.create.mutationOptions({
      // Handle successful agent creation
      onSuccess: async () => {
        // Invalidate the agents list query to refresh the data
        await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions());

        // If editing an existing agent, also invalidate its individual query
        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.agents.getOne.queryOptions({ id: initialValues.id })
          );
        }

        // Call the success callback if provided
        onSuccess?.();
      },
      // Handle errors during agent creation
      onError: (error) => {
        // Show error toast notification
        toast.error(`Failed to create agent: ${error.message}`);

        // TODO: Check if error code is "FORBIDDEN" and redirect to "/upgrade"
      },
    })
  );

  // Set up form with validation using react-hook-form and zod
  const form = useForm<z.infer<typeof agentsInsertSchema>>({
    resolver: zodResolver(agentsInsertSchema), // Use zod schema for validation
    defaultValues: {
      name: initialValues?.name ?? "", // Set default name from initial values or empty string
      instructions: initialValues?.instructions ?? "", // Set default instructions from initial values or empty string
    },
  });

  // Determine if this is an edit operation based on presence of initial values ID
  const isEdit = !!initialValues?.id;
  // Get pending state from the create mutation
  const isPending = createAgent.isPending;

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof agentsInsertSchema>) => {
    if (isEdit) {
      // TODO: Handle editing logic - currently just logs the values
      console.log("Editing agent with values:", values);
    } else {
      // Create new agent using the mutation
      createAgent.mutate(values);
    }
  };

  // Render the form UI
  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Generated avatar that updates based on the agent name */}
        <GeneratedAvatar
          seed={form.watch("name") || "New Agent"} // Use agent name as seed, fallback to "New Agent"
          variant="botttsNeutral"
          className="border size-16"
        />

        {/* Name input field */}
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Agent Name" />
              </FormControl>
              <FormMessage /> {/* Display validation errors */}
            </FormItem>
          )}
        />

        {/* Instructions textarea field */}
        <FormField
          name="instructions"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Agent Instructions" />
              </FormControl>
              <FormMessage /> {/* Display validation errors */}
            </FormItem>
          )}
        />

        {/* Form action buttons */}
        <div className="flex justify-end space-x-2">
          {/* Cancel button - only shown if onCancel callback is provided */}
          {onCancel && (
            <Button
              variant="ghost"
              disabled={isPending} // Disable while form is submitting
              type="button"
              onClick={() => onCancel()}
            >
              Cancel
            </Button>
          )}

          {/* Submit button - changes text based on edit mode */}
          <Button type="submit" disabled={isPending}>
            {isEdit ? "Save Changes" : "Create Agent"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
