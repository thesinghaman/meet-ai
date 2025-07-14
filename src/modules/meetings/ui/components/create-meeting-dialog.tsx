import { ResponsiveDialog } from "@/components/responsive-dialog";
import { useRouter } from "next/navigation";

import { MeetingForm } from "./meeting-form";

interface CreateMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateMeetingDialog = ({
  open,
  onOpenChange,
}: CreateMeetingDialogProps) => {
  const router = useRouter();
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Create Meeting"
      description="Create a new meeting to discuss your projects and tasks."
    >
      <MeetingForm
        onSuccess={(id) => {
          onOpenChange(false);
          router.push(`/meetings/${id}`);
        }}
        onCancel={() => onOpenChange}
      />
    </ResponsiveDialog>
  );
};
