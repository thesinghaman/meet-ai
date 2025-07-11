"use client";

import { useEffect, useState } from "react";
import { PanelLeftCloseIcon, PanelLeftIcon, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

import { DashboardCommand } from "./dashboard-command";

export const DashboardNavbar = () => {
  // Retrieve sidebar state and toggle function from context hook
  const { state, toggleSidebar, isMobile } = useSidebar();

  // State to track whether the command palette is open
  const [commandOpen, setCommandOpen] = useState(false);

  // State to determine if the user's platform is Mac for shortcut key display
  const [isMac, setIsMac] = useState(false);

  /**
   * Detect user's platform on component mount to customize UI (e.g., shortcut keys)
   */
  useEffect(() => {
    if (typeof window !== "undefined") {
      const platform = window.navigator.platform.toLowerCase();
      setIsMac(platform.includes("mac"));
    }
  }, []);

  /**
   * Setup keyboard event listener for opening/closing the command palette
   * using Cmd+K on Mac or Ctrl+K on other platforms
   */
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);

    // Cleanup event listener on component unmount
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      {/* Command palette modal controlled by open state */}
      <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />

      <nav className="flex px-4 gap-x-2 items-center py-3 border-b bg-background">
        {/* Sidebar toggle button - shows different icons based on sidebar state */}
        <Button className="size-9" variant="outline" onClick={toggleSidebar}>
          {state === "collapsed" || isMobile ? (
            <PanelLeftIcon className="size-4" />
          ) : (
            <PanelLeftCloseIcon className="size-4" />
          )}
        </Button>

        {/* Search button opens the command palette */}
        <Button
          className="h-9 w-[240px] justify-start font-normal text-muted-foreground hover:text-muted-foreground"
          variant="outline"
          size="sm"
          onClick={() => setCommandOpen((open) => !open)}
        >
          <SearchIcon />
          Search
          {/* Display keyboard shortcut hint, Cmd+K on Mac or Ctrl+K on others */}
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">{isMac ? "⌘" : "Ctrl"}</span>K
          </kbd>
        </Button>
      </nav>
    </>
  );
};
