import { ResponsiveDialog } from "@/components/responsive-dialog";

import { AgentForm } from "./agent-form";

interface CreateAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateAgentDialog = ({
  open,
  onOpenChange,
}: CreateAgentDialogProps) => {
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Create Agent"
      description="Create a new agent to assist you with your tasks."
    >
      <AgentForm
        onCancel={() => {
          onOpenChange(false);
        }}
        onSuccess={() => {
          onOpenChange(false);
        }}
      />
    </ResponsiveDialog>
  );
};
