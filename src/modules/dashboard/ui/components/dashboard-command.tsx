import { Dispatch, SetStateAction } from "react";

import {
  CommandResponsiveDialog,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DashboardCommand = ({ open, setOpen }: Props) => {
  return (
    // CommandResponsiveDialog component manages the modal/dialog display logic
    <CommandResponsiveDialog open={open} onOpenChange={setOpen}>
      {/* Input field where users type their search queries or commands */}
      <CommandInput placeholder="Find a meeting or agent"></CommandInput>

      {/* List of available command items */}
      <CommandList>
        {/* Example command item */}
        <CommandItem>Test</CommandItem>
      </CommandList>
    </CommandResponsiveDialog>
  );
};
